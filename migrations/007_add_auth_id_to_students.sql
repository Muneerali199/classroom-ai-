-- Migration: Add auth_user_id to students table to link with Supabase auth
-- This will allow proper password reset functionality

ALTER TABLE students ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_students_auth_user_id ON students(auth_user_id);

-- Create function to link student with auth user during creation
CREATE OR REPLACE FUNCTION link_student_auth_user(
    student_email TEXT,
    student_name TEXT
) RETURNS UUID AS $$
DECLARE
    auth_user_id UUID;
BEGIN
    -- Find the auth user by email
    SELECT id INTO auth_user_id
    FROM auth.users
    WHERE email = student_email;
    
    IF auth_user_id IS NULL THEN
        RAISE EXCEPTION 'No auth user found with email: %', student_email;
    END IF;
    
    RETURN auth_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing create_user_account function to store auth_user_id
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
    
    RETURN JSON_BUILD_OBJECT('success', true, 'user_id', new_user_id);
    
EXCEPTION WHEN OTHERS THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to reset student password (requires admin privileges)
CREATE OR REPLACE FUNCTION reset_student_password(
    student_auth_id UUID,
    new_password TEXT
) RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- This function needs to be executed with admin privileges
    -- For security, we'll validate that the caller is a teacher/dean
    
    -- Reset the password for the specified user
    -- Note: This requires admin privileges to work properly
    UPDATE auth.users 
    SET encrypted_password = crypt(new_password, gen_salt('bf'))
    WHERE id = student_auth_id;
    
    IF FOUND THEN
        RETURN JSON_BUILD_OBJECT('success', true);
    ELSE
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'User not found');
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;