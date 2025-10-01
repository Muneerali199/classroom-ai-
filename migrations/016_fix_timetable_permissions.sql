-- Migration: Fix timetable permissions and add enrollment function
-- This adds a secure RPC function for enrolling students in timetables
-- Run this in your Supabase SQL Editor

-- Create a secure function to enroll all students in a timetable
-- This function runs with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION enroll_all_students_in_timetable(
    p_timetable_id TEXT
)
RETURNS JSON AS $$
DECLARE
    v_result JSON;
    v_enrolled_count INTEGER := 0;
BEGIN
    -- Check if user is a teacher or dean
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.uid() = id 
        AND (raw_user_meta_data->>'role' = 'teacher' OR raw_user_meta_data->>'role' = 'dean')
    ) THEN
        RAISE EXCEPTION 'Only teachers and deans can enroll students';
    END IF;
    
    -- Check if timetable exists and belongs to current user
    IF NOT EXISTS (
        SELECT 1 FROM timetables 
        WHERE id = p_timetable_id 
        AND (teacher_id = auth.uid()::text OR created_by = auth.uid()::text)
    ) THEN
        RAISE EXCEPTION 'Timetable not found or access denied';
    END IF;
    
    -- Insert all students that aren't already enrolled
    INSERT INTO timetable_students (timetable_id, student_id)
    SELECT p_timetable_id, s.id
    FROM students s
    WHERE NOT EXISTS (
        SELECT 1 FROM timetable_students ts 
        WHERE ts.timetable_id = p_timetable_id 
        AND ts.student_id = s.id
    );
    
    GET DIAGNOSTICS v_enrolled_count = ROW_COUNT;
    
    -- Create notifications for the newly created timetable
    PERFORM create_class_notifications();
    
    v_result := json_build_object(
        'success', true,
        'enrolled_count', v_enrolled_count,
        'message', format('Successfully enrolled %s students', v_enrolled_count)
    );
    
    RETURN v_result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to enroll specific students in a timetable
CREATE OR REPLACE FUNCTION enroll_students_in_timetable(
    p_timetable_id TEXT,
    p_student_ids TEXT[]
)
RETURNS JSON AS $$
DECLARE
    v_result JSON;
    v_enrolled_count INTEGER := 0;
    v_student_id TEXT;
BEGIN
    -- Check if user is a teacher or dean
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.uid() = id 
        AND (raw_user_meta_data->>'role' = 'teacher' OR raw_user_meta_data->>'role' = 'dean')
    ) THEN
        RAISE EXCEPTION 'Only teachers and deans can enroll students';
    END IF;
    
    -- Check if timetable exists and belongs to current user
    IF NOT EXISTS (
        SELECT 1 FROM timetables 
        WHERE id = p_timetable_id 
        AND (teacher_id = auth.uid()::text OR created_by = auth.uid()::text)
    ) THEN
        RAISE EXCEPTION 'Timetable not found or access denied';
    END IF;
    
    -- Insert students that aren't already enrolled
    FOREACH v_student_id IN ARRAY p_student_ids
    LOOP
        INSERT INTO timetable_students (timetable_id, student_id)
        VALUES (p_timetable_id, v_student_id)
        ON CONFLICT (timetable_id, student_id) DO NOTHING;
        
        IF FOUND THEN
            v_enrolled_count := v_enrolled_count + 1;
        END IF;
    END LOOP;
    
    -- Create notifications
    PERFORM create_class_notifications();
    
    v_result := json_build_object(
        'success', true,
        'enrolled_count', v_enrolled_count,
        'message', format('Successfully enrolled %s students', v_enrolled_count)
    );
    
    RETURN v_result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION enroll_all_students_in_timetable TO authenticated;
GRANT EXECUTE ON FUNCTION enroll_students_in_timetable TO authenticated;

-- Add comments
COMMENT ON FUNCTION enroll_all_students_in_timetable IS 'Enrolls all students in a timetable (teacher/dean only)';
COMMENT ON FUNCTION enroll_students_in_timetable IS 'Enrolls specific students in a timetable (teacher/dean only)';

-- Verification
DO $$
BEGIN
    RAISE NOTICE '✅ Timetable permissions migration complete!';
    RAISE NOTICE '📝 Added secure RPC functions:';
    RAISE NOTICE '   - enroll_all_students_in_timetable(timetable_id)';
    RAISE NOTICE '   - enroll_students_in_timetable(timetable_id, student_ids[])';
    RAISE NOTICE '🔒 Functions use SECURITY DEFINER to bypass RLS safely';
    RAISE NOTICE '✅ Only teachers and deans can enroll students';
END $$;
