-- Migration: Create meetings table with proper RLS (FINAL VERSION)
-- This creates a comprehensive meetings system with explicit type casting
-- Run this in your Supabase SQL Editor

-- Create meetings table
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

-- Create meeting_participants table for tracking attendees
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

-- Create meeting_attachments table for documents/resources
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_meetings_teacher ON public.meetings(teacher_id);
CREATE INDEX IF NOT EXISTS idx_meetings_subject ON public.meetings(subject_id);
CREATE INDEX IF NOT EXISTS idx_meetings_start_time ON public.meetings(start_time);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON public.meetings(status);
CREATE INDEX IF NOT EXISTS idx_meetings_type ON public.meetings(meeting_type);
CREATE INDEX IF NOT EXISTS idx_meetings_created_by ON public.meetings(created_by);

CREATE INDEX IF NOT EXISTS idx_meeting_participants_meeting ON public.meeting_participants(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_participant ON public.meeting_participants(participant_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_status ON public.meeting_participants(attendance_status);

CREATE INDEX IF NOT EXISTS idx_meeting_attachments_meeting ON public.meeting_attachments(meeting_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_meetings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_meetings_updated_at_trigger ON public.meetings;
CREATE TRIGGER update_meetings_updated_at_trigger
    BEFORE UPDATE ON public.meetings
    FOR EACH ROW
    EXECUTE FUNCTION update_meetings_updated_at();

-- Enable RLS
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_attachments ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies first
DROP POLICY IF EXISTS "Teachers insert own meetings" ON public.meetings;
DROP POLICY IF EXISTS "Teachers view own meetings" ON public.meetings;
DROP POLICY IF EXISTS "Teachers update own meetings" ON public.meetings;
DROP POLICY IF EXISTS "Teachers delete own meetings" ON public.meetings;
DROP POLICY IF EXISTS "Students view invited meetings" ON public.meetings;
DROP POLICY IF EXISTS "Teachers manage participants" ON public.meeting_participants;
DROP POLICY IF EXISTS "Students view own participation" ON public.meeting_participants;
DROP POLICY IF EXISTS "Students update own attendance" ON public.meeting_participants;
DROP POLICY IF EXISTS "Teachers manage attachments" ON public.meeting_attachments;
DROP POLICY IF EXISTS "Students view attachments" ON public.meeting_attachments;

-- RLS Policies for meetings table (with explicit type casting)

-- 1. Teachers can INSERT their own meetings
CREATE POLICY "Teachers insert own meetings" ON public.meetings
    FOR INSERT 
    WITH CHECK (
        teacher_id = (auth.uid())::text 
        AND created_by = (auth.uid())::text
        AND (
            SELECT (raw_user_meta_data->>'role') IN ('teacher', 'dean')
            FROM auth.users 
            WHERE id = auth.uid()
        )
    );

-- 2. Teachers can SELECT their own meetings
CREATE POLICY "Teachers view own meetings" ON public.meetings
    FOR SELECT 
    USING (
        teacher_id = (auth.uid())::text 
        OR created_by = (auth.uid())::text
        OR (
            SELECT (raw_user_meta_data->>'role') = 'dean'
            FROM auth.users 
            WHERE id = auth.uid()
        )
    );

-- 3. Teachers can UPDATE their own meetings
CREATE POLICY "Teachers update own meetings" ON public.meetings
    FOR UPDATE 
    USING (
        teacher_id = (auth.uid())::text 
        OR created_by = (auth.uid())::text
    )
    WITH CHECK (
        teacher_id = (auth.uid())::text 
        OR created_by = (auth.uid())::text
    );

-- 4. Teachers can DELETE their own meetings
CREATE POLICY "Teachers delete own meetings" ON public.meetings
    FOR DELETE 
    USING (
        teacher_id = (auth.uid())::text 
        OR created_by = (auth.uid())::text
    );

-- 5. Students can view meetings they're invited to
CREATE POLICY "Students view invited meetings" ON public.meetings
    FOR SELECT 
    USING (
        (
            SELECT (raw_user_meta_data->>'role') = 'student'
            FROM auth.users 
            WHERE id = auth.uid()
        )
        AND EXISTS (
            SELECT 1 FROM meeting_participants mp
            INNER JOIN students s ON s.id = mp.participant_id
            WHERE mp.meeting_id = meetings.id
            AND s.auth_user_id = (auth.uid())::text
        )
    );

-- RLS Policies for meeting_participants

-- Teachers can manage all participants
CREATE POLICY "Teachers manage participants" ON public.meeting_participants
    FOR ALL 
    USING (
        (
            SELECT (raw_user_meta_data->>'role') IN ('teacher', 'dean')
            FROM auth.users 
            WHERE id = auth.uid()
        )
    )
    WITH CHECK (
        (
            SELECT (raw_user_meta_data->>'role') IN ('teacher', 'dean')
            FROM auth.users 
            WHERE id = auth.uid()
        )
    );

-- Students can view their own participation records
CREATE POLICY "Students view own participation" ON public.meeting_participants
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM students 
            WHERE auth_user_id = (auth.uid())::text
            AND id = meeting_participants.participant_id
        )
    );

-- Students can update their own attendance status
CREATE POLICY "Students update own attendance" ON public.meeting_participants
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM students 
            WHERE auth_user_id = (auth.uid())::text
            AND id = meeting_participants.participant_id
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM students 
            WHERE auth_user_id = (auth.uid())::text
            AND id = meeting_participants.participant_id
        )
    );

-- RLS Policies for meeting_attachments

-- Teachers can manage attachments for their meetings
CREATE POLICY "Teachers manage attachments" ON public.meeting_attachments
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM meetings m
            WHERE m.id = meeting_attachments.meeting_id
            AND (m.teacher_id = (auth.uid())::text OR m.created_by = (auth.uid())::text)
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM meetings m
            WHERE m.id = meeting_attachments.meeting_id
            AND (m.teacher_id = (auth.uid())::text OR m.created_by = (auth.uid())::text)
        )
    );

-- Students can view attachments for meetings they're invited to
CREATE POLICY "Students view attachments" ON public.meeting_attachments
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM meeting_participants mp
            INNER JOIN students s ON s.id = mp.participant_id
            WHERE mp.meeting_id = meeting_attachments.meeting_id
            AND s.auth_user_id = (auth.uid())::text
        )
    );

-- Create helpful views

-- View for upcoming meetings with subject info
CREATE OR REPLACE VIEW public.upcoming_meetings AS
SELECT 
    m.*,
    sub.name as subject_name,
    sub.code as subject_code,
    COUNT(DISTINCT mp.id) as total_participants,
    COUNT(DISTINCT CASE WHEN mp.attendance_status = 'accepted' THEN mp.id END) as accepted_count,
    COUNT(DISTINCT ma.id) as attachment_count
FROM meetings m
LEFT JOIN subjects sub ON m.subject_id = sub.id
LEFT JOIN meeting_participants mp ON m.id = mp.meeting_id
LEFT JOIN meeting_attachments ma ON m.id = ma.meeting_id
WHERE m.start_time > NOW()
AND m.status = 'scheduled'
GROUP BY m.id, sub.name, sub.code
ORDER BY m.start_time;

-- View for teacher's meetings with subject info
CREATE OR REPLACE VIEW public.teacher_meetings_view AS
SELECT 
    m.*,
    sub.name as subject_name,
    sub.code as subject_code,
    COUNT(DISTINCT mp.id) as total_participants,
    COUNT(DISTINCT CASE WHEN mp.attendance_status = 'attended' THEN mp.id END) as attended_count,
    COUNT(DISTINCT ma.id) as attachment_count
FROM meetings m
LEFT JOIN subjects sub ON m.subject_id = sub.id
LEFT JOIN meeting_participants mp ON m.id = mp.meeting_id
LEFT JOIN meeting_attachments ma ON m.id = ma.meeting_id
GROUP BY m.id, sub.name, sub.code
ORDER BY m.start_time DESC;

-- Grant permissions on views
GRANT SELECT ON public.upcoming_meetings TO authenticated;
GRANT SELECT ON public.teacher_meetings_view TO authenticated;

-- Add comments
COMMENT ON TABLE public.meetings IS 'Stores all meeting/class schedules with subject association';
COMMENT ON TABLE public.meeting_participants IS 'Tracks who is invited/attending each meeting';
COMMENT ON TABLE public.meeting_attachments IS 'Stores files/resources shared in meetings';
COMMENT ON COLUMN public.meetings.subject_id IS 'Optional link to subjects table for class-related meetings';
COMMENT ON VIEW public.upcoming_meetings IS 'Shows all upcoming scheduled meetings with subject info';
COMMENT ON VIEW public.teacher_meetings_view IS 'Teacher view with participant counts and subject info';

-- Verification
DO $$
BEGIN
    RAISE NOTICE '✅ Meetings system migration complete (FINAL VERSION)!';
    RAISE NOTICE '📅 Tables created: meetings (with subject_id), meeting_participants, meeting_attachments';
    RAISE NOTICE '🔒 Row Level Security enabled with explicit type casting';
    RAISE NOTICE '📊 Views created: upcoming_meetings, teacher_meetings_view';
    RAISE NOTICE '📚 Subject support added to meetings';
    RAISE NOTICE '✅ Teachers can now create and manage meetings without UUID errors!';
    RAISE NOTICE '👥 Students can view meetings they are invited to';
END $$;
