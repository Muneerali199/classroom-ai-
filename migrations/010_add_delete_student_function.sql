-- Migration: Add secure delete student function
-- This function allows teachers and deans to delete students and their auth accounts

CREATE OR REPLACE FUNCTION delete_student_account(
    student_id TEXT,
    deleter_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleter_role TEXT;
    student_auth_id UUID;
    result JSON;
BEGIN
    -- Get the deleter's role
    SELECT raw_user_meta_data->>'role' INTO deleter_role
    FROM auth.users
    WHERE id = deleter_id;
    
    -- Check permissions - only teachers and deans can delete students
    IF deleter_role NOT IN ('teacher', 'dean') THEN
        RETURN json_build_object(
            'success', false, 
            'error', 'Only teachers and deans can delete students'
        );
    END IF;
    
    -- Get the student's auth_user_id before deletion
    SELECT auth_user_id INTO student_auth_id
    FROM students
    WHERE id = student_id;
    
    IF student_auth_id IS NULL THEN
        RETURN json_build_object(
            'success', false, 
            'error', 'Student not found'
        );
    END IF;
    
    -- Delete the student record (this will cascade to attendance records)
    DELETE FROM students WHERE id = student_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false, 
            'error', 'Student not found'
        );
    END IF;
    
    -- Delete the auth user account
    DELETE FROM auth.users WHERE id = student_auth_id;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Student account deleted successfully'
    );
    
EXCEPTION WHEN OTHERS THEN
    -- Log the error for debugging
    RAISE WARNING 'Error deleting student: %', SQLERRM;
    RETURN json_build_object(
        'success', false,
        'error', 'Failed to delete student account. Please try again or contact support.'
    );
END;
$$;

-- Update function permissions
REVOKE ALL ON FUNCTION delete_student_account FROM PUBLIC;
GRANT EXECUTE ON FUNCTION delete_student_account TO authenticated;

-- Add comment
COMMENT ON FUNCTION delete_student_account IS 'Securely deletes a student and their auth account. Only teachers and deans can delete students.';