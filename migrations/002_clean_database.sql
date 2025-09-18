-- Clean database migration: Remove any demo/seed data
-- This migration ensures the database starts clean for production use

-- Remove any demo students if they exist
DELETE FROM students WHERE id IN ('s1', 's2', 's3', 's4', 's5', 's6');

-- Remove any demo attendance records
DELETE FROM attendance WHERE student_id IN ('s1', 's2', 's3', 's4', 's5', 's6');

-- Check if the enhanced student schema has been applied
-- If student_id column doesn't exist, we need to apply migration 006 first
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'student_id') THEN
        -- Apply enhanced student schema
        ALTER TABLE students ADD COLUMN IF NOT EXISTS email TEXT;
        ALTER TABLE students ADD COLUMN IF NOT EXISTS student_id TEXT UNIQUE;
        ALTER TABLE students ADD COLUMN IF NOT EXISTS grade TEXT;
        ALTER TABLE students ADD COLUMN IF NOT EXISTS date_of_birth DATE;
        ALTER TABLE students ADD COLUMN IF NOT EXISTS phone_number TEXT;
        ALTER TABLE students ADD COLUMN IF NOT EXISTS address TEXT;
        ALTER TABLE students ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
        ALTER TABLE students ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
        ALTER TABLE students ADD COLUMN IF NOT EXISTS blood_type TEXT;
        ALTER TABLE students ADD COLUMN IF NOT EXISTS medical_notes TEXT;
        ALTER TABLE students ADD COLUMN IF NOT EXISTS photo_url TEXT;
        ALTER TABLE students ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
        ALTER TABLE students ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
        ALTER TABLE students ADD COLUMN IF NOT EXISTS created_by TEXT;
        ALTER TABLE students ADD COLUMN IF NOT EXISTS auth_user_id UUID;

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
        CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
    END IF;
END
$$;

-- Add a comment to indicate this is a clean production database
INSERT INTO students (id, name, email, student_id, created_at) VALUES 
('system-note', 'System Note', 'system@note.local', 'SYS-NOTE', NOW())
ON CONFLICT (id) DO NOTHING;