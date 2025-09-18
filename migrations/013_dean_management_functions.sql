-- Migration: Add Dean management functions for comprehensive teacher management

-- Create function to delete user account (for Dean use)
CREATE OR REPLACE FUNCTION delete_user_account(
    user_id UUID
) RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Delete from auth.users (this will cascade to teachers/students tables)
    DELETE FROM auth.users WHERE id = user_id;
    
    IF FOUND THEN
        RETURN JSON_BUILD_OBJECT('success', true);
    ELSE
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'User not found');
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (Dean role check is done in app)
GRANT EXECUTE ON FUNCTION delete_user_account TO authenticated;

-- Create function to get teacher statistics
CREATE OR REPLACE FUNCTION get_teacher_statistics()
RETURNS JSON AS $$
DECLARE
    stats JSON;
BEGIN
    SELECT JSON_BUILD_OBJECT(
        'total', COUNT(*),
        'full_time', COUNT(*) FILTER (WHERE employment_status = 'Full-time'),
        'part_time', COUNT(*) FILTER (WHERE employment_status = 'Part-time'),
        'contract', COUNT(*) FILTER (WHERE employment_status = 'Contract'),
        'substitute', COUNT(*) FILTER (WHERE employment_status = 'Substitute'),
        'departments', (
            SELECT JSON_OBJECT_AGG(department, count)
            FROM (
                SELECT department, COUNT(*) as count
                FROM teachers
                WHERE department IS NOT NULL
                GROUP BY department
            ) dept_counts
        )
    ) INTO stats
    FROM teachers;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_teacher_statistics TO authenticated;

-- Create function to search teachers
CREATE OR REPLACE FUNCTION search_teachers(
    search_query TEXT
) RETURNS TABLE (
    id TEXT,
    name TEXT,
    email TEXT,
    teacher_id TEXT,
    department TEXT,
    subject TEXT,
    phone_number TEXT,
    address TEXT,
    date_of_birth DATE,
    hire_date DATE,
    employment_status TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    qualifications TEXT,
    notes TEXT,
    photo_url TEXT,
    auth_user_id UUID,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    created_by TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.name,
        t.email,
        t.teacher_id,
        t.department,
        t.subject,
        t.phone_number,
        t.address,
        t.date_of_birth,
        t.hire_date,
        t.employment_status,
        t.emergency_contact_name,
        t.emergency_contact_phone,
        t.qualifications,
        t.notes,
        t.photo_url,
        t.auth_user_id,
        t.created_at,
        t.updated_at,
        t.created_by
    FROM teachers t
    WHERE 
        t.name ILIKE '%' || search_query || '%' OR
        t.email ILIKE '%' || search_query || '%' OR
        t.teacher_id ILIKE '%' || search_query || '%' OR
        t.department ILIKE '%' || search_query || '%' OR
        t.subject ILIKE '%' || search_query || '%'
    ORDER BY t.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION search_teachers TO authenticated;

-- Update the reset_teacher_password function to be more robust
CREATE OR REPLACE FUNCTION reset_teacher_password(
    teacher_auth_id UUID,
    new_password TEXT
) RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = teacher_auth_id) THEN
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'User not found');
    END IF;
    
    -- Reset the password for the specified user
    UPDATE auth.users 
    SET 
        encrypted_password = crypt(new_password, gen_salt('bf')),
        updated_at = NOW()
    WHERE id = teacher_auth_id;
    
    IF FOUND THEN
        RETURN JSON_BUILD_OBJECT('success', true);
    ELSE
        RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Failed to update password');
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to validate dean access
CREATE OR REPLACE FUNCTION validate_dean_access(
    user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT raw_user_meta_data->>'role' INTO user_role
    FROM auth.users
    WHERE id = user_id;
    
    RETURN user_role = 'dean';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION validate_dean_access TO authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION delete_user_account IS 'Deletes a user account and all associated records. For Dean use only.';
COMMENT ON FUNCTION get_teacher_statistics IS 'Returns comprehensive statistics about teachers in the system.';
COMMENT ON FUNCTION search_teachers IS 'Searches teachers by name, email, ID, department, or subject.';
COMMENT ON FUNCTION validate_dean_access IS 'Validates if a user has dean access privileges.';