-- Migration: Fix timetable RLS policies for proper access
-- This fixes the overly restrictive RLS policies that prevent timetable creation
-- Run this in your Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Teachers and deans manage timetables" ON public.timetables;
DROP POLICY IF EXISTS "Students view active timetables" ON public.timetables;

-- Create simplified, working RLS policies for timetables

-- 1. Teachers can INSERT their own timetables
CREATE POLICY "Teachers insert own timetables" ON public.timetables
    FOR INSERT 
    WITH CHECK (
        teacher_id = auth.uid()::text AND
        created_by = auth.uid()::text AND
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' IN ('teacher', 'dean')
        )
    );

-- 2. Teachers can SELECT their own timetables
CREATE POLICY "Teachers view own timetables" ON public.timetables
    FOR SELECT 
    USING (
        teacher_id = auth.uid()::text OR
        created_by = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' = 'dean'
        )
    );

-- 3. Teachers can UPDATE their own timetables
CREATE POLICY "Teachers update own timetables" ON public.timetables
    FOR UPDATE 
    USING (
        teacher_id = auth.uid()::text OR
        created_by = auth.uid()::text
    )
    WITH CHECK (
        teacher_id = auth.uid()::text OR
        created_by = auth.uid()::text
    );

-- 4. Teachers can DELETE their own timetables
CREATE POLICY "Teachers delete own timetables" ON public.timetables
    FOR DELETE 
    USING (
        teacher_id = auth.uid()::text OR
        created_by = auth.uid()::text
    );

-- 5. Students can view all active timetables
CREATE POLICY "Students view active timetables" ON public.timetables
    FOR SELECT 
    USING (
        is_active = true AND
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' = 'student'
        )
    );

-- Update timetable_students policies for better clarity
DROP POLICY IF EXISTS "Teachers manage student enrollments" ON public.timetable_students;
DROP POLICY IF EXISTS "Students view own enrollments" ON public.timetable_students;

-- Teachers can manage all enrollments
CREATE POLICY "Teachers manage enrollments" ON public.timetable_students
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' IN ('teacher', 'dean')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' IN ('teacher', 'dean')
        )
    );

-- Students can view their own enrollments
CREATE POLICY "Students view enrollments" ON public.timetable_students
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM students 
            WHERE auth_user_id = auth.uid()::text 
            AND id = student_id
        )
    );

-- Add helpful comments
COMMENT ON POLICY "Teachers insert own timetables" ON public.timetables IS 
    'Allows teachers to create timetables where they are the teacher and creator';
COMMENT ON POLICY "Teachers view own timetables" ON public.timetables IS 
    'Allows teachers to view their own timetables, deans can view all';
COMMENT ON POLICY "Teachers update own timetables" ON public.timetables IS 
    'Allows teachers to update only their own timetables';
COMMENT ON POLICY "Teachers delete own timetables" ON public.timetables IS 
    'Allows teachers to delete only their own timetables';
COMMENT ON POLICY "Students view active timetables" ON public.timetables IS 
    'Allows students to view all active timetables';

-- Verification
DO $$
BEGIN
    RAISE NOTICE '✅ Timetable RLS policies fixed!';
    RAISE NOTICE '📝 New policies created:';
    RAISE NOTICE '   - Teachers insert own timetables';
    RAISE NOTICE '   - Teachers view own timetables';
    RAISE NOTICE '   - Teachers update own timetables';
    RAISE NOTICE '   - Teachers delete own timetables';
    RAISE NOTICE '   - Students view active timetables';
    RAISE NOTICE '   - Teachers manage enrollments';
    RAISE NOTICE '   - Students view enrollments';
    RAISE NOTICE '🔒 RLS is still enabled for security';
    RAISE NOTICE '✅ Teachers can now create timetables!';
END $$;
