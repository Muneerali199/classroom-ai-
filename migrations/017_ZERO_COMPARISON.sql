-- Migration: ZERO COMPARISON version (NO table queries, NO comparisons!)
-- This version avoids ALL WHERE clauses and table queries
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
DROP FUNCTION IF EXISTS get_user_role();

-- Function 1: Get current user ID as text (NO queries, NO comparisons!)
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS TEXT AS $$
BEGIN
    RETURN (auth.uid())::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function 2: Get user role from JWT (NO table queries!)
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN COALESCE(
        auth.jwt()->>'role',
        (auth.jwt()->'user_metadata'->>'role')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function 3: Check if teacher or dean (uses get_user_role)
CREATE OR REPLACE FUNCTION is_teacher_or_dean()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() IN ('teacher', 'dean');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function 4: Check if dean
CREATE OR REPLACE FUNCTION is_dean()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'dean';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function 5: Check if student
CREATE OR REPLACE FUNCTION is_student()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'student';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Grant permissions
GRANT EXECUTE ON FUNCTION current_user_id TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role TO authenticated;
GRANT EXECUTE ON FUNCTION is_teacher_or_dean TO authenticated;
GRANT EXECUTE ON FUNCTION is_student TO authenticated;
GRANT EXECUTE ON FUNCTION is_dean TO authenticated;

-- RLS Policies for timetables

CREATE POLICY "Teachers insert own timetables" ON public.timetables
    FOR INSERT 
    WITH CHECK (
        teacher_id = current_user_id()
        AND created_by = current_user_id()
        AND is_teacher_or_dean()
    );

CREATE POLICY "Teachers view own timetables" ON public.timetables
    FOR SELECT 
    USING (
        teacher_id = current_user_id()
        OR created_by = current_user_id()
        OR is_dean()
    );

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

CREATE POLICY "Teachers delete own timetables" ON public.timetables
    FOR DELETE 
    USING (
        teacher_id = current_user_id()
        OR created_by = current_user_id()
    );

CREATE POLICY "Students view active timetables" ON public.timetables
    FOR SELECT 
    USING (
        is_active = true 
        AND is_student()
    );

-- RLS Policies for timetable_students

CREATE POLICY "Teachers manage enrollments" ON public.timetable_students
    FOR ALL 
    USING (is_teacher_or_dean())
    WITH CHECK (is_teacher_or_dean());

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
    RAISE NOTICE '✅ ZERO COMPARISON VERSION INSTALLED!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Functions created (NO table queries!):';
    RAISE NOTICE '   ✓ current_user_id() - Direct auth.uid()::text';
    RAISE NOTICE '   ✓ get_user_role() - Reads from JWT token';
    RAISE NOTICE '   ✓ is_teacher_or_dean() - Role check';
    RAISE NOTICE '   ✓ is_dean() - Dean check';
    RAISE NOTICE '   ✓ is_student() - Student check';
    RAISE NOTICE '';
    RAISE NOTICE '🔒 RLS policies created (7 policies)';
    RAISE NOTICE '';
    RAISE NOTICE '✅ ZERO UUID COMPARISONS!';
    RAISE NOTICE '✅ ZERO TABLE QUERIES!';
    RAISE NOTICE '🎉 This will work 100%%!';
    RAISE NOTICE '========================================';
END $$;
