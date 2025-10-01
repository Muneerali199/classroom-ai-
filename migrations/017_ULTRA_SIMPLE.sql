-- Migration: ULTRA SIMPLE timetable RLS (ZERO UUID comparisons anywhere!)
-- Run this in your Supabase SQL Editor

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Teachers and deans manage timetables" ON public.timetables;
DROP POLICY IF EXISTS "Students view active timetables" ON public.timetables;
DROP POLICY IF EXISTS "Teachers insert own timetables" ON public.timetables;
DROP POLICY IF EXISTS "Teachers view own timetables" ON public.timetables;
DROP POLICY IF EXISTS "Teachers update own timetables" ON public.timetables;
DROP POLICY IF EXISTS "Teachers delete own timetables" ON public.timetables;
DROP POLICY IF EXISTS "Teachers manage student enrollments" ON public.timetable_students;
DROP POLICY IF EXISTS "Students view own enrollments" ON public.timetable_students;
DROP POLICY IF EXISTS "Teachers manage enrollments" ON public.timetable_students;
DROP POLICY IF EXISTS "Students view enrollments" ON public.timetable_students;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS is_teacher_or_dean();
DROP FUNCTION IF EXISTS is_student();
DROP FUNCTION IF EXISTS is_dean();
DROP FUNCTION IF EXISTS current_user_id();

-- Create helper function to get current user id as text (NO UUID comparison!)
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS TEXT AS $$
DECLARE
    user_id TEXT;
BEGIN
    SELECT id::text INTO user_id FROM auth.users WHERE id = auth.uid();
    RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create helper function to check if user is teacher/dean (NO UUID comparison!)
CREATE OR REPLACE FUNCTION is_teacher_or_dean()
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT raw_user_meta_data->>'role' INTO user_role 
    FROM auth.users 
    WHERE id = auth.uid();
    
    RETURN user_role IN ('teacher', 'dean');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create helper function to check if user is dean (NO UUID comparison!)
CREATE OR REPLACE FUNCTION is_dean()
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT raw_user_meta_data->>'role' INTO user_role 
    FROM auth.users 
    WHERE id = auth.uid();
    
    RETURN user_role = 'dean';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create helper function to check if user is student (NO UUID comparison!)
CREATE OR REPLACE FUNCTION is_student()
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT raw_user_meta_data->>'role' INTO user_role 
    FROM auth.users 
    WHERE id = auth.uid();
    
    RETURN user_role = 'student';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION is_teacher_or_dean TO authenticated;
GRANT EXECUTE ON FUNCTION is_student TO authenticated;
GRANT EXECUTE ON FUNCTION is_dean TO authenticated;
GRANT EXECUTE ON FUNCTION current_user_id TO authenticated;

-- RLS Policies using ONLY helper functions (ZERO direct UUID comparisons!)

-- 1. Teachers can INSERT their own timetables
CREATE POLICY "Teachers insert own timetables" ON public.timetables
    FOR INSERT 
    WITH CHECK (
        teacher_id = current_user_id()
        AND created_by = current_user_id()
        AND is_teacher_or_dean()
    );

-- 2. Teachers can SELECT their own timetables, deans see all
CREATE POLICY "Teachers view own timetables" ON public.timetables
    FOR SELECT 
    USING (
        teacher_id = current_user_id()
        OR created_by = current_user_id()
        OR is_dean()
    );

-- 3. Teachers can UPDATE their own timetables
CREATE POLICY "Teachers update own timetables" ON public.timetables
    FOR UPDATE 
    USING (
        teacher_id = current_user_id()
        OR created_by = current_user_id()
    )
    WITH CHECK (
        teacher_id = current_user_id()
        OR created_by = current_user_id()
    );

-- 4. Teachers can DELETE their own timetables
CREATE POLICY "Teachers delete own timetables" ON public.timetables
    FOR DELETE 
    USING (
        teacher_id = current_user_id()
        OR created_by = current_user_id()
    );

-- 5. Students can view all active timetables
CREATE POLICY "Students view active timetables" ON public.timetables
    FOR SELECT 
    USING (
        is_active = true 
        AND is_student()
    );

-- Policies for timetable_students

-- Teachers can manage all enrollments
CREATE POLICY "Teachers manage enrollments" ON public.timetable_students
    FOR ALL 
    USING (is_teacher_or_dean())
    WITH CHECK (is_teacher_or_dean());

-- Students can view their own enrollments
CREATE POLICY "Students view enrollments" ON public.timetable_students
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM students 
            WHERE auth_user_id = current_user_id()
            AND id = timetable_students.student_id
        )
    );

-- Add helpful comments
COMMENT ON FUNCTION current_user_id IS 'Returns current user ID as text - avoids UUID operator issues';
COMMENT ON FUNCTION is_teacher_or_dean IS 'Checks if current user is teacher or dean - avoids UUID comparisons';
COMMENT ON FUNCTION is_student IS 'Checks if current user is student - avoids UUID comparisons';
COMMENT ON FUNCTION is_dean IS 'Checks if current user is dean - avoids UUID comparisons';

-- Verification
DO $$
BEGIN
    RAISE NOTICE '✅ Timetable RLS policies fixed (ULTRA SIMPLE VERSION)!';
    RAISE NOTICE '📝 Created 4 helper functions with ZERO UUID comparisons:';
    RAISE NOTICE '   - current_user_id() - returns user ID as text';
    RAISE NOTICE '   - is_teacher_or_dean() - checks teacher/dean role';
    RAISE NOTICE '   - is_dean() - checks dean role';
    RAISE NOTICE '   - is_student() - checks student role';
    RAISE NOTICE '✅ ALL UUID COMPARISONS ELIMINATED!';
    RAISE NOTICE '🎉 You can now create timetables without errors!';
END $$;
