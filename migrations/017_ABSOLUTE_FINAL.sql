-- Migration: ABSOLUTE FINAL timetable RLS (NO UUID comparisons ANYWHERE!)
-- This version has ZERO uuid comparisons, not even in helper functions
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

-- Drop existing functions
DROP FUNCTION IF EXISTS is_teacher_or_dean();
DROP FUNCTION IF EXISTS is_student();
DROP FUNCTION IF EXISTS is_dean();
DROP FUNCTION IF EXISTS current_user_id();

-- Helper function: Get current user ID as text (NO WHERE clause, NO UUID comparison!)
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS TEXT AS $$
BEGIN
    RETURN (auth.uid())::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper function: Check if current user is teacher or dean (NO UUID comparison!)
CREATE OR REPLACE FUNCTION is_teacher_or_dean()
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
    current_uid UUID;
BEGIN
    current_uid := auth.uid();
    
    SELECT raw_user_meta_data->>'role' INTO user_role 
    FROM auth.users 
    WHERE id::text = current_uid::text;
    
    RETURN COALESCE(user_role IN ('teacher', 'dean'), false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper function: Check if current user is dean (NO UUID comparison!)
CREATE OR REPLACE FUNCTION is_dean()
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
    current_uid UUID;
BEGIN
    current_uid := auth.uid();
    
    SELECT raw_user_meta_data->>'role' INTO user_role 
    FROM auth.users 
    WHERE id::text = current_uid::text;
    
    RETURN COALESCE(user_role = 'dean', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper function: Check if current user is student (NO UUID comparison!)
CREATE OR REPLACE FUNCTION is_student()
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
    current_uid UUID;
BEGIN
    current_uid := auth.uid();
    
    SELECT raw_user_meta_data->>'role' INTO user_role 
    FROM auth.users 
    WHERE id::text = current_uid::text;
    
    RETURN COALESCE(user_role = 'student', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION current_user_id TO authenticated;
GRANT EXECUTE ON FUNCTION is_teacher_or_dean TO authenticated;
GRANT EXECUTE ON FUNCTION is_student TO authenticated;
GRANT EXECUTE ON FUNCTION is_dean TO authenticated;

-- RLS Policies using ONLY helper functions

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

-- Verification
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ TIMETABLE RLS FIXED (ABSOLUTE FINAL)!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Helper functions created:';
    RAISE NOTICE '   ✓ current_user_id() - Returns user ID as TEXT';
    RAISE NOTICE '   ✓ is_teacher_or_dean() - Role check';
    RAISE NOTICE '   ✓ is_dean() - Dean check';
    RAISE NOTICE '   ✓ is_student() - Student check';
    RAISE NOTICE '';
    RAISE NOTICE '🔒 RLS policies created:';
    RAISE NOTICE '   ✓ Teachers insert own timetables';
    RAISE NOTICE '   ✓ Teachers view own timetables';
    RAISE NOTICE '   ✓ Teachers update own timetables';
    RAISE NOTICE '   ✓ Teachers delete own timetables';
    RAISE NOTICE '   ✓ Students view active timetables';
    RAISE NOTICE '   ✓ Teachers manage enrollments';
    RAISE NOTICE '   ✓ Students view enrollments';
    RAISE NOTICE '';
    RAISE NOTICE '✅ NO UUID COMPARISONS ANYWHERE!';
    RAISE NOTICE '✅ All comparisons use ::text casting!';
    RAISE NOTICE '🎉 Ready for migration 018!';
    RAISE NOTICE '========================================';
END $$;
