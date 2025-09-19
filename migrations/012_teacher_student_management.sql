-- Migration: Teacher-only student management system
-- Only teachers can create, edit, delete students and manage subject/room assignments
-- Dean access to these operations is restricted

-- First, drop existing functions that allow dean access to student management
-- Use dynamic SQL to drop functions by finding their exact signatures
DO $$
DECLARE
    func_signature TEXT;
BEGIN
    -- Find and drop all create_user_account functions
    FOR func_signature IN 
        SELECT format('DROP FUNCTION IF EXISTS %s(%s)', 
               p.proname, 
               pg_get_function_identity_arguments(p.oid))
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE p.proname = 'create_user_account' 
        AND n.nspname = 'public'
    LOOP
        EXECUTE func_signature;
    END LOOP;
    
    -- Find and drop all delete_student_account functions
    FOR func_signature IN 
        SELECT format('DROP FUNCTION IF EXISTS %s(%s)', 
               p.proname, 
               pg_get_function_identity_arguments(p.oid))
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE p.proname = 'delete_student_account' 
        AND n.nspname = 'public'
    LOOP
        EXECUTE func_signature;
    END LOOP;
    
EXCEPTION WHEN OTHERS THEN
    -- Continue if there are any issues
    RAISE NOTICE 'Function cleanup completed with notice: %', SQLERRM;
END
$$;

-- Create function for teacher-only student creation with email/password
CREATE OR REPLACE FUNCTION create_student_account(
    student_email TEXT,
    student_password TEXT,
    student_name TEXT,
    student_id_code TEXT,
    grade_level TEXT,
    creator_teacher_id TEXT,
    additional_data JSONB DEFAULT '{}'::jsonb
) RETURNS JSON AS $$
DECLARE
    new_user_id UUID;
    result JSON;
    creator_role TEXT;
BEGIN
    -- Verify creator is a teacher
    SELECT t.id INTO creator_role
    FROM teachers t 
    WHERE t.id = creator_teacher_id OR t.auth_user_id::text = creator_teacher_id;
    
    IF creator_role IS NULL THEN
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Only teachers can create student accounts');
    END IF;
    
    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = student_email) THEN
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Email already exists');
    END IF;
    
    -- Check if student_id already exists
    IF EXISTS (SELECT 1 FROM students WHERE student_id = student_id_code) THEN
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Student ID already exists');
    END IF;
    
    -- Create the auth user
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_user_meta_data,
        raw_app_meta_data
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        student_email,
        crypt(student_password, gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        JSON_BUILD_OBJECT('role', 'student', 'displayName', student_name, 'full_name', student_name),
        JSON_BUILD_OBJECT('provider', 'email', 'providers', ARRAY['email'])
    ) RETURNING id INTO new_user_id;
    
    -- Create the student record
    INSERT INTO students (
        id,
        name,
        email,
        student_id,
        grade,
        auth_user_id,
        phone_number,
        address,
        emergency_contact_name,
        emergency_contact_phone,
        medical_notes,
        created_by,
        created_at,
        updated_at
    ) VALUES (
        new_user_id::TEXT,
        student_name,
        student_email,
        student_id_code,
        grade_level,
        new_user_id,
        COALESCE(additional_data->>'phone_number', ''),
        COALESCE(additional_data->>'address', ''),
        COALESCE(additional_data->>'emergency_contact_name', ''),
        COALESCE(additional_data->>'emergency_contact_phone', ''),
        COALESCE(additional_data->>'medical_notes', ''),
        creator_teacher_id,
        NOW(),
        NOW()
    );
    
    RETURN JSON_BUILD_OBJECT('success', true, 'student_id', new_user_id);
    
EXCEPTION WHEN OTHERS THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for teacher-only student deletion (replaces previous version)
CREATE OR REPLACE FUNCTION delete_student_account(
    student_id TEXT,
    deleter_teacher_id TEXT
) RETURNS JSON AS $$
DECLARE
    student_auth_id UUID;
    creator_role TEXT;
BEGIN
    -- Verify deleter is a teacher
    SELECT t.id INTO creator_role
    FROM teachers t 
    WHERE t.id = deleter_teacher_id OR t.auth_user_id::text = deleter_teacher_id;
    
    IF creator_role IS NULL THEN
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Only teachers can delete student accounts');
    END IF;
    
    -- Get student's auth_user_id
    SELECT auth_user_id INTO student_auth_id
    FROM students
    WHERE id = student_id;
    
    IF student_auth_id IS NULL THEN
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Student not found');
    END IF;
    
    -- Delete from students table (cascades to related records)
    DELETE FROM students WHERE id = student_id;
    
    -- Delete from auth.users
    DELETE FROM auth.users WHERE id = student_auth_id;
    
    RETURN JSON_BUILD_OBJECT('success', true);
    
EXCEPTION WHEN OTHERS THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for teacher-only student updates
CREATE OR REPLACE FUNCTION update_student_account(
    student_id TEXT,
    updater_teacher_id TEXT,
    student_data JSONB
) RETURNS JSON AS $$
DECLARE
    creator_role TEXT;
BEGIN
    -- Verify updater is a teacher
    SELECT t.id INTO creator_role
    FROM teachers t 
    WHERE t.id = updater_teacher_id OR t.auth_user_id::text = updater_teacher_id;
    
    IF creator_role IS NULL THEN
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Only teachers can update student accounts');
    END IF;
    
    -- Update student record
    UPDATE students SET
        name = COALESCE(student_data->>'name', name),
        email = COALESCE(student_data->>'email', email),
        student_id = COALESCE(student_data->>'student_id', student_id),
        grade = COALESCE(student_data->>'grade', grade),
        phone_number = COALESCE(student_data->>'phone_number', phone_number),
        address = COALESCE(student_data->>'address', address),
        emergency_contact_name = COALESCE(student_data->>'emergency_contact_name', emergency_contact_name),
        emergency_contact_phone = COALESCE(student_data->>'emergency_contact_phone', emergency_contact_phone),
        medical_notes = COALESCE(student_data->>'medical_notes', medical_notes),
        updated_at = NOW()
    WHERE id = student_id;
    
    -- Update auth user email if changed
    IF student_data->>'email' IS NOT NULL THEN
        UPDATE auth.users 
        SET email = student_data->>'email', updated_at = NOW()
        WHERE id = (SELECT auth_user_id FROM students WHERE id = student_id);
    END IF;
    
    RETURN JSON_BUILD_OBJECT('success', true);
    
EXCEPTION WHEN OTHERS THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for teacher-only subject assignment
CREATE OR REPLACE FUNCTION assign_student_to_subject(
    student_id TEXT,
    subject_id INTEGER,
    teacher_id TEXT
) RETURNS JSON AS $$
DECLARE
    creator_role TEXT;
BEGIN
    -- Verify assigner is a teacher
    SELECT t.id INTO creator_role
    FROM teachers t 
    WHERE t.id = teacher_id OR t.auth_user_id::text = teacher_id;
    
    IF creator_role IS NULL THEN
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Only teachers can assign subjects');
    END IF;
    
    -- Check if assignment already exists
    IF EXISTS (SELECT 1 FROM subject_students WHERE student_id = assign_student_to_subject.student_id AND subject_id = assign_student_to_subject.subject_id) THEN
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Student already assigned to this subject');
    END IF;
    
    -- Create the assignment
    INSERT INTO subject_students (subject_id, student_id, created_at)
    VALUES (assign_student_to_subject.subject_id, assign_student_to_subject.student_id, NOW());
    
    RETURN JSON_BUILD_OBJECT('success', true);
    
EXCEPTION WHEN OTHERS THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for teacher-only room assignment
CREATE OR REPLACE FUNCTION assign_room_to_subject(
    room_id INTEGER,
    subject_id INTEGER,
    teacher_id TEXT
) RETURNS JSON AS $$
DECLARE
    creator_role TEXT;
BEGIN
    -- Verify assigner is a teacher
    SELECT t.id INTO creator_role
    FROM teachers t 
    WHERE t.id = teacher_id OR t.auth_user_id::text = teacher_id;
    
    IF creator_role IS NULL THEN
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Only teachers can assign rooms to subjects');
    END IF;
    
    -- Update subject with room assignment
    UPDATE subjects 
    SET description = COALESCE(description, '') || ' (Room: ' || (SELECT room_number FROM rooms WHERE id = assign_room_to_subject.room_id) || ')',
        updated_at = NOW()
    WHERE id = assign_room_to_subject.subject_id;
    
    RETURN JSON_BUILD_OBJECT('success', true);
    
EXCEPTION WHEN OTHERS THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for teacher-only student blocking/unblocking
CREATE OR REPLACE FUNCTION block_student_account(
    student_id TEXT,
    teacher_id TEXT,
    is_blocked BOOLEAN
) RETURNS JSON AS $$
DECLARE
    creator_role TEXT;
    student_auth_id UUID;
BEGIN
    -- Verify blocker is a teacher
    SELECT t.id INTO creator_role
    FROM teachers t 
    WHERE t.id = teacher_id OR t.auth_user_id::text = teacher_id;
    
    IF creator_role IS NULL THEN
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Only teachers can block/unblock students');
    END IF;
    
    -- Get student's auth_user_id
    SELECT auth_user_id INTO student_auth_id
    FROM students
    WHERE id = student_id;
    
    IF student_auth_id IS NULL THEN
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Student not found');
    END IF;
    
    -- Update auth user banned status
    UPDATE auth.users 
    SET 
        banned_until = CASE WHEN is_blocked THEN '2099-12-31'::timestamptz ELSE NULL END,
        updated_at = NOW()
    WHERE id = student_auth_id;
    
    RETURN JSON_BUILD_OBJECT('success', true);
    
EXCEPTION WHEN OTHERS THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Revoke all previous permissions and grant only to authenticated users
REVOKE ALL ON FUNCTION create_student_account FROM PUBLIC;
REVOKE ALL ON FUNCTION delete_student_account FROM PUBLIC;  
REVOKE ALL ON FUNCTION update_student_account FROM PUBLIC;
REVOKE ALL ON FUNCTION assign_student_to_subject FROM PUBLIC;
REVOKE ALL ON FUNCTION assign_room_to_subject FROM PUBLIC;
REVOKE ALL ON FUNCTION block_student_account FROM PUBLIC;

-- Grant permissions only to authenticated users (teachers will be verified within functions)
GRANT EXECUTE ON FUNCTION create_student_account TO authenticated;
GRANT EXECUTE ON FUNCTION delete_student_account TO authenticated;
GRANT EXECUTE ON FUNCTION update_student_account TO authenticated;
GRANT EXECUTE ON FUNCTION assign_student_to_subject TO authenticated;
GRANT EXECUTE ON FUNCTION assign_room_to_subject TO authenticated;
GRANT EXECUTE ON FUNCTION block_student_account TO authenticated;

-- Recreate create_user_account function with teacher-only student creation
CREATE OR REPLACE FUNCTION create_user_account(
    user_email TEXT,
    user_password TEXT,
    user_display_name TEXT,
    user_role TEXT,
    creator_id TEXT
) RETURNS JSON AS $$
DECLARE
    new_user_id UUID;
    creator_role TEXT;
BEGIN
    -- Get creator's role
    SELECT raw_user_meta_data->>'role' INTO creator_role
    FROM auth.users
    WHERE id = creator_id::UUID;
    
    -- Role-based restrictions
    IF user_role = 'student' THEN
        -- Only teachers can create students
        SELECT t.id INTO creator_role
        FROM teachers t 
        WHERE t.id = creator_id OR t.auth_user_id::text = creator_id;
        
        IF creator_role IS NULL THEN
            RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Only teachers can create student accounts');
        END IF;
    ELSIF user_role = 'teacher' THEN
        -- Only deans can create teachers
        IF creator_role != 'dean' THEN
            RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Only deans can create teacher accounts');
        END IF;
    ELSIF user_role = 'dean' THEN
        -- Only existing deans can create new deans
        IF creator_role != 'dean' THEN
            RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Only deans can create dean accounts');
        END IF;
    END IF;
    
    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = user_email) THEN
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Email already exists');
    END IF;
    
    -- Create the auth user
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_user_meta_data,
        raw_app_meta_data
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        user_email,
        crypt(user_password, gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        JSON_BUILD_OBJECT('role', user_role, 'displayName', user_display_name, 'full_name', user_display_name),
        JSON_BUILD_OBJECT('provider', 'email', 'providers', ARRAY['email'])
    ) RETURNING id INTO new_user_id;
    
    -- Create role-specific records
    IF user_role = 'student' THEN
        INSERT INTO students (
            id, name, email, auth_user_id, created_by, created_at
        ) VALUES (
            new_user_id::TEXT, user_display_name, user_email, new_user_id, creator_id, NOW()
        );
    ELSIF user_role = 'teacher' THEN
        INSERT INTO teachers (
            id, name, email, auth_user_id, created_by, created_at
        ) VALUES (
            new_user_id::TEXT, user_display_name, user_email, new_user_id, creator_id, NOW()
        );
    END IF;
    
    RETURN JSON_BUILD_OBJECT('success', true, 'user_id', new_user_id);
    
EXCEPTION WHEN OTHERS THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions for the updated function
REVOKE ALL ON FUNCTION create_user_account FROM PUBLIC;
GRANT EXECUTE ON FUNCTION create_user_account TO authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION create_user_account IS 'Role-restricted user creation: Teachers create students, Deans create teachers';
COMMENT ON FUNCTION create_student_account IS 'Teachers only: Create student accounts with email/password';
COMMENT ON FUNCTION delete_student_account IS 'Teachers only: Delete student accounts and auth users';
COMMENT ON FUNCTION update_student_account IS 'Teachers only: Update student profile information';
COMMENT ON FUNCTION assign_student_to_subject IS 'Teachers only: Assign students to subjects';
COMMENT ON FUNCTION assign_room_to_subject IS 'Teachers only: Assign rooms to subjects';
COMMENT ON FUNCTION block_student_account IS 'Teachers only: Block/unblock student login access';