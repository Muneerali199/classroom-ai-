-- Migration: Create comprehensive teachers table for dean management
-- This will allow proper teacher lifecycle management

-- Create teachers table with comprehensive profile information
CREATE TABLE IF NOT EXISTS teachers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    teacher_id TEXT UNIQUE,
    department TEXT,
    subject TEXT,
    phone_number TEXT,
    address TEXT,
    date_of_birth DATE,
    hire_date DATE,
    employment_status TEXT CHECK (employment_status IN ('Full-time', 'Part-time', 'Contract', 'Substitute')),
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    qualifications TEXT,
    notes TEXT,
    photo_url TEXT,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_teachers_teacher_id ON teachers(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teachers_email ON teachers(email);
CREATE INDEX IF NOT EXISTS idx_teachers_auth_user_id ON teachers(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_department ON teachers(department);

-- Create teacher attendance table
CREATE TABLE IF NOT EXISTS teacher_attendance (
    id SERIAL PRIMARY KEY,
    teacher_id TEXT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Late', 'Excused', 'Sick Leave', 'Personal Leave')),
    notes TEXT,
    recorded_by TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(teacher_id, date)
);

-- Create index for teacher attendance
CREATE INDEX IF NOT EXISTS idx_teacher_attendance_teacher_id ON teacher_attendance(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_attendance_date ON teacher_attendance(date);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_teachers_updated_at 
    BEFORE UPDATE ON teachers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Update create_user_account function to handle teachers
CREATE OR REPLACE FUNCTION create_user_account(
    user_email TEXT,
    user_password TEXT,
    user_display_name TEXT,
    user_role TEXT,
    creator_id TEXT
) RETURNS JSON AS $$
DECLARE
    new_user_id UUID;
    result JSON;
BEGIN
    -- Create the auth user first
    SELECT auth.signup(user_email, user_password, JSON_BUILD_OBJECT(
        'role', user_role,
        'displayName', user_display_name,
        'full_name', user_display_name
    )) INTO new_user_id;
    
    IF new_user_id IS NULL THEN
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Failed to create auth user');
    END IF;
    
    -- If this is a student, create the student record with auth link
    IF user_role = 'student' THEN
        INSERT INTO students (
            id, 
            name, 
            email, 
            auth_user_id, 
            created_by, 
            created_at
        ) VALUES (
            new_user_id::TEXT, 
            user_display_name, 
            user_email, 
            new_user_id, 
            creator_id, 
            NOW()
        );
    END IF;
    
    -- If this is a teacher, create the teacher record with auth link
    IF user_role = 'teacher' THEN
        INSERT INTO teachers (
            id, 
            name, 
            email, 
            auth_user_id, 
            created_by, 
            created_at
        ) VALUES (
            new_user_id::TEXT, 
            user_display_name, 
            user_email, 
            new_user_id, 
            creator_id, 
            NOW()
        );
    END IF;
    
    RETURN JSON_BUILD_OBJECT('success', true, 'user_id', new_user_id);
    
EXCEPTION WHEN OTHERS THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to reset teacher password
CREATE OR REPLACE FUNCTION reset_teacher_password(
    teacher_auth_id UUID,
    new_password TEXT
) RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Reset the password for the specified user
    UPDATE auth.users 
    SET encrypted_password = crypt(new_password, gen_salt('bf'))
    WHERE id = teacher_auth_id;
    
    IF FOUND THEN
        RETURN JSON_BUILD_OBJECT('success', true);
    ELSE
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'User not found');
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;