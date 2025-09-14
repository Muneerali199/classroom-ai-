-- Migration: Update authentication system to remove public signup and rename admin to dean

-- Update any existing admin roles to dean
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"dean"'
)
WHERE raw_user_meta_data->>'role' = 'admin';

-- Create a function to create users (only callable by dean or teachers)
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
    result JSON;
BEGIN
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
    
    -- Create the user using auth.admin_create_user
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
        gen_random_uuid(),
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
    )
    RETURNING id INTO new_user_id;
    
    RETURN json_build_object(
        'success', true,
        'user_id', new_user_id,
        'message', 'User created successfully'
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$;

-- Create RLS policies for the function
REVOKE ALL ON FUNCTION create_user_account FROM PUBLIC;
GRANT EXECUTE ON FUNCTION create_user_account TO authenticated;

-- Add comments
COMMENT ON FUNCTION create_user_account IS 'Creates new user accounts. Dean can create any role, teachers can create students only.';