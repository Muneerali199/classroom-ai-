-- Migration: Simplest timetable RLS fix (NO UUID comparisons)
-- Uses helper functions to completely avoid UUID operator issues
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

-- Create helper function to check if user is teacher/dean
CREATE OR REPLACE FUNCTION is_teacher_or_dean()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT COALESCE(
            (raw_user_meta_data->>'role') IN ('teacher', 'dean'),
            false
        )
        FROM auth.users 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to check if user is student
CREATE OR REPLACE FUNCTION is_student()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT COALESCE(
            (raw_user_meta_data->>'role') = 'student',
            false
        )
        FROM auth.users 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to get current user id as text
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS TEXT AS $$
BEGIN
    RETURN auth.uid()::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies using helper functions

-- 1. Teachers can INSERT their own timetables
CREATE POLICY "Teachers insert own timetables" ON public.timetables
    FOR INSERT 
    WITH CHECK (
        teacher_id = current_user_id()
        AND created_by = current_user_id()
        AND is_teacher_or_dean()
    );

-- 2. Teachers can SELECT their own timetables
CREATE POLICY "Teachers view own timetables" ON public.timetables
    FOR SELECT 
    USING (
        teacher_id = current_user_id()
        OR created_by = current_user_id()
        OR (is_teacher_or_dean() AND (
            SELECT (raw_user_meta_data->>'role') = 'dean'
            FROM auth.users WHERE id = auth.uid()
        ))
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION is_teacher_or_dean TO authenticated;
GRANT EXECUTE ON FUNCTION is_student TO authenticated;
GRANT EXECUTE ON FUNCTION current_user_id TO authenticated;

-- Verification
DO $$
BEGIN
    RAISE NOTICE '✅ Timetable RLS policies fixed (SIMPLEST VERSION)!';
    RAISE NOTICE '📝 Created helper functions to avoid UUID comparisons';
    RAISE NOTICE '   - is_teacher_or_dean()';
    RAISE NOTICE '   - is_student()';
    RAISE NOTICE '   - current_user_id()';
    RAISE NOTICE '✅ NO MORE UUID OPERATOR ERRORS!';
END $$;
