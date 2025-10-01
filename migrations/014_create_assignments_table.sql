-- Migration: Create assignments table and storage bucket
-- This table stores all assignments created by teachers for students

-- Create assignments table
CREATE TABLE IF NOT EXISTS public.assignments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    subject_id TEXT,
    created_by TEXT NOT NULL,
    file_url TEXT,
    file_type TEXT,
    file_path TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
    max_score INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_assignments_created_by ON public.assignments(created_by);
CREATE INDEX IF NOT EXISTS idx_assignments_subject_id ON public.assignments(subject_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON public.assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON public.assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignments_created_at ON public.assignments(created_at);

-- Create trigger for updated_at
CREATE TRIGGER update_assignments_updated_at 
    BEFORE UPDATE ON public.assignments 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create assignment_submissions table for student submissions
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    assignment_id TEXT NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    submission_text TEXT,
    file_url TEXT,
    file_type TEXT,
    file_path TEXT,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'late', 'missing')),
    score INTEGER,
    feedback TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    graded_at TIMESTAMPTZ,
    graded_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(assignment_id, student_id)
);

-- Create indexes for submissions
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON public.assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.assignment_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON public.assignment_submissions(submitted_at);

-- Create trigger for submissions updated_at
CREATE TRIGGER update_submissions_updated_at 
    BEFORE UPDATE ON public.assignment_submissions 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create student_notifications table for assignment notifications
CREATE TABLE IF NOT EXISTS public.student_notifications (
    id SERIAL PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    assignment_id TEXT REFERENCES public.assignments(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'assignment' CHECK (type IN ('assignment', 'grade', 'attendance', 'announcement')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_student ON public.student_notifications(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_assignment ON public.student_notifications(assignment_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.student_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.student_notifications(created_at);

-- Enable RLS on assignments tables
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assignments
-- Teachers can manage their own assignments
CREATE POLICY "Teachers manage own assignments" ON public.assignments
    FOR ALL USING (
        auth.uid()::text = created_by OR
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.uid() = id 
            AND (raw_user_meta_data->>'role' = 'teacher' OR raw_user_meta_data->>'role' = 'dean')
        )
    );

-- Students can view all assignments
CREATE POLICY "Students view assignments" ON public.assignments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.uid() = id 
            AND raw_user_meta_data->>'role' = 'student'
        )
    );

-- RLS Policies for submissions
-- Students can manage their own submissions
CREATE POLICY "Students manage own submissions" ON public.assignment_submissions
    FOR ALL USING (
        auth.uid()::text = student_id OR
        EXISTS (
            SELECT 1 FROM students 
            WHERE auth_user_id = auth.uid() 
            AND id = student_id
        )
    );

-- Teachers can view and grade all submissions
CREATE POLICY "Teachers manage submissions" ON public.assignment_submissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.uid() = id 
            AND (raw_user_meta_data->>'role' = 'teacher' OR raw_user_meta_data->>'role' = 'dean')
        )
    );

-- RLS Policies for notifications
-- Students can view their own notifications
CREATE POLICY "Students view own notifications" ON public.student_notifications
    FOR SELECT USING (
        auth.uid()::text = student_id OR
        EXISTS (
            SELECT 1 FROM students 
            WHERE auth_user_id = auth.uid() 
            AND id = student_id
        )
    );

-- Teachers can create notifications
CREATE POLICY "Teachers create notifications" ON public.student_notifications
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.uid() = id 
            AND (raw_user_meta_data->>'role' = 'teacher' OR raw_user_meta_data->>'role' = 'dean')
        )
    );

-- Students can update their own notifications (mark as read)
CREATE POLICY "Students update own notifications" ON public.student_notifications
    FOR UPDATE USING (
        auth.uid()::text = student_id OR
        EXISTS (
            SELECT 1 FROM students 
            WHERE auth_user_id = auth.uid() 
            AND id = student_id
        )
    );

-- Create view for assignment statistics
CREATE OR REPLACE VIEW public.assignment_stats AS
SELECT 
    a.id as assignment_id,
    a.title,
    a.due_date,
    a.created_by as teacher_id,
    COUNT(s.id) as total_submissions,
    COUNT(CASE WHEN s.status = 'graded' THEN 1 END) as graded_submissions,
    COUNT(CASE WHEN s.status = 'submitted' THEN 1 END) as pending_submissions,
    AVG(CASE WHEN s.score IS NOT NULL THEN s.score END) as average_score,
    a.max_score
FROM public.assignments a
LEFT JOIN public.assignment_submissions s ON a.id = s.assignment_id
GROUP BY a.id, a.title, a.due_date, a.created_by, a.max_score;

-- Grant appropriate permissions
GRANT SELECT ON public.assignment_stats TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE public.assignments IS 'Stores all assignments created by teachers';
COMMENT ON TABLE public.assignment_submissions IS 'Stores student submissions for assignments';
COMMENT ON TABLE public.student_notifications IS 'Notification system for students';
COMMENT ON VIEW public.assignment_stats IS 'Aggregated statistics for assignments';

-- Create storage bucket for assignments (Note: Run in Supabase Dashboard)
-- This is a comment/guide - storage buckets are created via Supabase API or Dashboard
/*
To create the storage bucket, run this in your Supabase Dashboard or via API:

INSERT INTO storage.buckets (id, name, public)
VALUES ('assignments', 'assignments', false);

-- Set up storage policies
CREATE POLICY "Teachers upload assignment files"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'assignments' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.uid() = id
        AND (raw_user_meta_data->>'role' = 'teacher' OR raw_user_meta_data->>'role' = 'dean')
    )
);

CREATE POLICY "Authenticated users view assignment files"
ON storage.objects FOR SELECT
USING (bucket_id = 'assignments' AND auth.role() = 'authenticated');
*/

-- Verification
DO $$
BEGIN
    RAISE NOTICE '✅ Assignments table migration complete!';
    RAISE NOTICE '📝 Tables created: assignments, assignment_submissions, student_notifications';
    RAISE NOTICE '🔒 Row Level Security enabled';
    RAISE NOTICE '📊 Views created: assignment_stats';
    RAISE NOTICE '🗂️ Storage bucket: Remember to create "assignments" bucket in Supabase Dashboard';
END $$;
