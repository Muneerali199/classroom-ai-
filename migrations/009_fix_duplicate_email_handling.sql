-- Migration: Improve duplicate email handling in user creation
-- Add better error handling for duplicate emails

CREATE OR REPLACE FUNCTION create_user_account(
    user_email TEXT,
    user_password TEXT,
    user_display_name TEXT,
    user_role TEXT,
    creator_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    creator_role TEXT;
    new_user_id UUID;
    email_exists BOOLEAN := FALSE;
    result JSON;
BEGIN
    -- Normalize email (lowercase and trim)
    user_email := LOWER(TRIM(user_email));
    
    -- Check if email already exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = user_email) INTO email_exists;
    
    IF email_exists THEN
        RETURN json_build_object(
            'success', false, 
            'error', 'A user with email "' || user_email || '" already exists. Please use a different email address.'
        );
    END IF;
    
    -- Get the creator's role
    SELECT raw_user_meta_data->>'role' INTO creator_role
    FROM auth.users
    WHERE id = creator_id;
    
    -- Check permissions
    IF creator_role = 'dean' THEN
        -- Dean can create any role
        IF user_role NOT IN ('teacher', 'student', 'dean') THEN
            RETURN json_build_object('success', false, 'error', 'Invalid role specified');
        END IF;
    ELSIF creator_role = 'teacher' THEN
        -- Teachers can only create students
        IF user_role != 'student' THEN
            RETURN json_build_object('success', false, 'error', 'Teachers can only create student accounts');
        END IF;
    ELSE
        -- Only dean and teachers can create accounts
        RETURN json_build_object('success', false, 'error', 'Insufficient permissions to create accounts');
    END IF;
    
    -- Validate email format
    IF user_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RETURN json_build_object('success', false, 'error', 'Please enter a valid email address');
    END IF;
    
    -- Generate new user ID
    new_user_id := gen_random_uuid();
    
    -- Create the user
    INSERT INTO auth.users (
        id,
        email,
        email_confirmed_at,
        encrypted_password,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change_token_new,
        recovery_token
    )
    VALUES (
        new_user_id,
        user_email,
        NOW(),
        crypt(user_password, gen_salt('bf')),
        json_build_object(
            'role', user_role,
            'displayName', user_display_name,
            'full_name', user_display_name
        )::jsonb,
        NOW(),
        NOW(),
        '',
        '',
        ''
    );
    
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
            creator_id::TEXT, 
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
            creator_id::TEXT, 
            NOW()
        );
    END IF;
    
    RETURN json_build_object(
        'success', true,
        'user_id', new_user_id,
        'message', 'User created successfully'
    );
    
EXCEPTION 
    WHEN unique_violation THEN
        -- Handle any remaining unique constraint violations
        IF SQLERRM LIKE '%users_email%' THEN
            RETURN json_build_object(
                'success', false, 
                'error', 'A user with email "' || user_email || '" already exists. Please use a different email address.'
            );
        ELSE
            RETURN json_build_object(
                'success', false, 
                'error', 'This information is already in use. Please check your input and try again.'
            );
        END IF;
    WHEN OTHERS THEN
        -- Log the error for debugging
        RAISE WARNING 'Error creating user: %', SQLERRM;
        RETURN json_build_object(
            'success', false,
            'error', 'Failed to create user account. Please try again or contact support.'
        );
END;
$$;

-- Update function permissions
REVOKE ALL ON FUNCTION create_user_account FROM PUBLIC;
GRANT EXECUTE ON FUNCTION create_user_account TO authenticated;