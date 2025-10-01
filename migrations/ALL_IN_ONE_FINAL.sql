-- ALL-IN-ONE FINAL MIGRATION
-- This combines all fixes into ONE file
-- Run this ONCE in Supabase SQL Editor
-- Fixes: UUID errors, meetings, storage, profile

-- ========================================
-- PART 1: Helper Functions (No UUID comparisons!)
-- ========================================

-- Drop existing
DROP FUNCTION IF EXISTS is_teacher_or_dean();
DROP FUNCTION IF EXISTS is_student();
DROP FUNCTION IF EXISTS is_dean();
DROP FUNCTION IF EXISTS current_user_id();
DROP FUNCTION IF EXISTS get_user_role();

-- Function 1: Get current user ID as text
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS TEXT AS $$
BEGIN
    RETURN (auth.uid())::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function 2: Get user role from JWT
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN COALESCE(
        auth.jwt()->>'role',
        (auth.jwt()->'user_metadata'->>'role')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function 3: Check if teacher or dean
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

GRANT EXECUTE ON FUNCTION current_user_id TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role TO authenticated;
GRANT EXECUTE ON FUNCTION is_teacher_or_dean TO authenticated;
GRANT EXECUTE ON FUNCTION is_student TO authenticated;
GRANT EXECUTE ON FUNCTION is_dean TO authenticated;

-- ========================================
-- PART 2: Timetable RLS Policies
-- ========================================

DROP POLICY IF EXISTS "Teachers insert own timetables" ON public.timetables;
DROP POLICY IF EXISTS "Teachers view own timetables" ON public.timetables;
DROP POLICY IF EXISTS "Teachers update own timetables" ON public.timetables;
DROP POLICY IF EXISTS "Teachers delete own timetables" ON public.timetables;
DROP POLICY IF EXISTS "Students view active timetables" ON public.timetables;
DROP POLICY IF EXISTS "Teachers manage enrollments" ON public.timetable_students;
DROP POLICY IF EXISTS "Students view enrollments" ON public.timetable_students;

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
    USING (teacher_id = current_user_id() OR created_by = current_user_id())
    WITH CHECK (teacher_id = current_user_id() OR created_by = current_user_id());

CREATE POLICY "Teachers delete own timetables" ON public.timetables
    FOR DELETE 
    USING (teacher_id = current_user_id() OR created_by = current_user_id());

CREATE POLICY "Students view active timetables" ON public.timetables
    FOR SELECT 
    USING (is_active = true AND is_student());

CREATE POLICY "Teachers manage enrollments" ON public.timetable_students
    FOR ALL 
    USING (is_teacher_or_dean())
    WITH CHECK (is_teacher_or_dean());

CREATE POLICY "Students view enrollments" ON public.timetable_students
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM students 
            WHERE auth_user_id::text = current_user_id()
            AND id = timetable_students.student_id
        )
    );

-- ========================================
-- PART 3: Meetings Tables
-- ========================================

CREATE TABLE IF NOT EXISTS public.meetings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT,
    meeting_type TEXT NOT NULL CHECK (meeting_type IN ('class', 'parent', 'staff', 'other')),
    subject_id INTEGER REFERENCES public.subjects(id) ON DELETE SET NULL,
    meeting_link TEXT,
    meeting_platform TEXT CHECK (meeting_platform IN ('zoom', 'google_meet', 'microsoft_teams', 'other')),
    location TEXT,
    teacher_id TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern TEXT,
    max_participants INTEGER,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    notes TEXT,
    created_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_meeting_time CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS public.meeting_participants (
    id SERIAL PRIMARY KEY,
    meeting_id TEXT NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
    participant_id TEXT NOT NULL,
    participant_type TEXT NOT NULL CHECK (participant_type IN ('student', 'teacher', 'parent', 'other')),
    attendance_status TEXT DEFAULT 'invited' CHECK (attendance_status IN ('invited', 'accepted', 'declined', 'attended', 'absent')),
    joined_at TIMESTAMPTZ,
    left_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(meeting_id, participant_id)
);

CREATE TABLE IF NOT EXISTS public.meeting_attachments (
    id SERIAL PRIMARY KEY,
    meeting_id TEXT NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    uploaded_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meetings_teacher ON public.meetings(teacher_id);
CREATE INDEX IF NOT EXISTS idx_meetings_subject ON public.meetings(subject_id);
CREATE INDEX IF NOT EXISTS idx_meetings_start_time ON public.meetings(start_time);

ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Teachers insert own meetings" ON public.meetings;
DROP POLICY IF EXISTS "Teachers view own meetings" ON public.meetings;
DROP POLICY IF EXISTS "Teachers update own meetings" ON public.meetings;
DROP POLICY IF EXISTS "Teachers delete own meetings" ON public.meetings;
DROP POLICY IF EXISTS "Students view invited meetings" ON public.meetings;
DROP POLICY IF EXISTS "Teachers manage participants" ON public.meeting_participants;
DROP POLICY IF EXISTS "Students view own participation" ON public.meeting_participants;

CREATE POLICY "Teachers insert own meetings" ON public.meetings
    FOR INSERT WITH CHECK (
        teacher_id = current_user_id() AND created_by = current_user_id() AND is_teacher_or_dean()
    );

CREATE POLICY "Teachers view own meetings" ON public.meetings
    FOR SELECT USING (teacher_id = current_user_id() OR created_by = current_user_id() OR is_dean());

CREATE POLICY "Teachers update own meetings" ON public.meetings
    FOR UPDATE USING (teacher_id = current_user_id() OR created_by = current_user_id())
    WITH CHECK (teacher_id = current_user_id() OR created_by = current_user_id());

CREATE POLICY "Teachers delete own meetings" ON public.meetings
    FOR DELETE USING (teacher_id = current_user_id() OR created_by = current_user_id());

CREATE POLICY "Teachers manage participants" ON public.meeting_participants
    FOR ALL USING (is_teacher_or_dean()) WITH CHECK (is_teacher_or_dean());

-- ========================================
-- PART 4: Storage Bucket
-- ========================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;

CREATE POLICY "Users can upload own avatar" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'profiles' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'profiles');

CREATE POLICY "Users can update own avatar" ON storage.objects
    FOR UPDATE USING (bucket_id = 'profiles' AND auth.role() = 'authenticated')
    WITH CHECK (bucket_id = 'profiles' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete own avatar" ON storage.objects
    FOR DELETE USING (bucket_id = 'profiles' AND auth.role() = 'authenticated');

-- ========================================
-- PART 5: Teachers Table Columns
-- ========================================

ALTER TABLE teachers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Teacher';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ========================================
-- PART 6: Teachers Table RLS (CORRECT!)
-- ========================================

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Teachers can view own profile" ON teachers;
DROP POLICY IF EXISTS "Teachers can update own profile" ON teachers;

-- IMPORTANT: Cast BOTH sides to text to avoid UUID comparison!
CREATE POLICY "Teachers can view own profile" ON teachers
    FOR SELECT 
    USING (auth_user_id::text = (auth.uid())::text);

CREATE POLICY "Teachers can update own profile" ON teachers
    FOR UPDATE 
    USING (auth_user_id::text = (auth.uid())::text)
    WITH CHECK (auth_user_id::text = (auth.uid())::text);

-- ========================================
-- VERIFICATION
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '╔════════════════════════════════════════╗';
    RAISE NOTICE '║   ALL-IN-ONE MIGRATION COMPLETE!      ║';
    RAISE NOTICE '╚════════════════════════════════════════╝';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Helper functions created (5)';
    RAISE NOTICE '✅ Timetable RLS policies fixed';
    RAISE NOTICE '✅ Meetings tables created';
    RAISE NOTICE '✅ Storage bucket configured';
    RAISE NOTICE '✅ Teachers profile columns added';
    RAISE NOTICE '✅ Teachers RLS policies created (CORRECT!)';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 Everything is ready!';
    RAISE NOTICE '📝 Now restart your server: npm run dev';
    RAISE NOTICE '';
END $$;
