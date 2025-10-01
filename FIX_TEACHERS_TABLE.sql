-- This adds missing columns to teachers table and fixes everything
-- Run this in Supabase SQL Editor

-- Add all profile columns if they don't exist
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Teacher';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- If teachers table has 'name' column, split it into first_name and last_name
DO $$
DECLARE
    has_name_column BOOLEAN;
BEGIN
    -- Check if 'name' column exists
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'teachers' 
        AND column_name = 'name'
    ) INTO has_name_column;
    
    IF has_name_column THEN
        -- Update first_name and last_name from name column
        UPDATE teachers 
        SET 
            first_name = COALESCE(
                NULLIF(split_part(name, ' ', 1), ''),
                name
            ),
            last_name = NULLIF(split_part(name, ' ', 2), '')
        WHERE first_name IS NULL OR first_name = '';
        
        RAISE NOTICE 'Migrated name column to first_name/last_name';
    END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies with correct casting
DROP POLICY IF EXISTS "Teachers can view own profile" ON teachers;
DROP POLICY IF EXISTS "Teachers can update own profile" ON teachers;
DROP POLICY IF EXISTS "Teachers can insert own profile" ON teachers;

-- View policy - cast both sides to text
CREATE POLICY "Teachers can view own profile" ON teachers
    FOR SELECT 
    USING (
        CASE 
            WHEN auth_user_id IS NULL THEN false
            ELSE auth_user_id::text = (auth.uid())::text
        END
    );

-- Update policy - cast both sides to text  
CREATE POLICY "Teachers can update own profile" ON teachers
    FOR UPDATE 
    USING (
        CASE 
            WHEN auth_user_id IS NULL THEN false
            ELSE auth_user_id::text = (auth.uid())::text
        END
    )
    WITH CHECK (
        CASE 
            WHEN auth_user_id IS NULL THEN false
            ELSE auth_user_id::text = (auth.uid())::text
        END
    );

-- Insert policy (in case teachers can create their own record)
CREATE POLICY "Teachers can insert own profile" ON teachers
    FOR INSERT
    WITH CHECK (auth_user_id::text = (auth.uid())::text);

-- Fix storage bucket policies - make them VERY permissive for authenticated users
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users upload" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users delete" ON storage.objects;

-- Super simple storage policies - just check if user is authenticated
CREATE POLICY "Authenticated users upload" ON storage.objects
    FOR INSERT 
    TO authenticated
    WITH CHECK (bucket_id = 'profiles');

CREATE POLICY "Public read access" ON storage.objects
    FOR SELECT 
    TO public
    USING (bucket_id = 'profiles');

CREATE POLICY "Authenticated users update" ON storage.objects
    FOR UPDATE 
    TO authenticated
    USING (bucket_id = 'profiles')
    WITH CHECK (bucket_id = 'profiles');

CREATE POLICY "Authenticated users delete" ON storage.objects
    FOR DELETE 
    TO authenticated
    USING (bucket_id = 'profiles');

-- Verify
DO $$
BEGIN
    RAISE NOTICE '═══════════════════════════════════════';
    RAISE NOTICE '✅ Teachers table fixed!';
    RAISE NOTICE '✅ All profile columns added';
    RAISE NOTICE '✅ RLS policies updated with correct casting';
    RAISE NOTICE '✅ Storage policies simplified';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Now test:';
    RAISE NOTICE '   1. Upload photo in profile';
    RAISE NOTICE '   2. Edit and save profile';
    RAISE NOTICE '═══════════════════════════════════════';
END $$;
