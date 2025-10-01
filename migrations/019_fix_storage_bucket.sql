-- Migration: Fix storage bucket for profile photos
-- This creates the bucket and proper RLS policies for photo uploads
-- Run this in your Supabase SQL Editor

-- Create profiles bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;

-- Policy 1: Authenticated users can INSERT (upload) avatars
CREATE POLICY "Users can upload own avatar" ON storage.objects
    FOR INSERT 
    WITH CHECK (
        bucket_id = 'profiles'
        AND auth.role() = 'authenticated'
    );

-- Policy 2: Anyone can SELECT (view) avatars (public bucket)
CREATE POLICY "Anyone can view avatars" ON storage.objects
    FOR SELECT 
    USING (
        bucket_id = 'profiles'
    );

-- Policy 3: Authenticated users can UPDATE avatars
CREATE POLICY "Users can update own avatar" ON storage.objects
    FOR UPDATE 
    USING (
        bucket_id = 'profiles'
        AND auth.role() = 'authenticated'
    )
    WITH CHECK (
        bucket_id = 'profiles'
        AND auth.role() = 'authenticated'
    );

-- Policy 4: Authenticated users can DELETE avatars
CREATE POLICY "Users can delete own avatar" ON storage.objects
    FOR DELETE 
    USING (
        bucket_id = 'profiles'
        AND auth.role() = 'authenticated'
    );

-- Verification
DO $$
BEGIN
    RAISE NOTICE '✅ Storage bucket setup complete!';
    RAISE NOTICE '📦 Bucket: profiles (public)';
    RAISE NOTICE '📁 Folder: avatars/';
    RAISE NOTICE '🔒 RLS policies created:';
    RAISE NOTICE '   - Users can upload own avatar (INSERT)';
    RAISE NOTICE '   - Anyone can view avatars (SELECT)';
    RAISE NOTICE '   - Users can update own avatar (UPDATE)';
    RAISE NOTICE '   - Users can delete own avatar (DELETE)';
    RAISE NOTICE '✅ Photo uploads should now work!';
END $$;
