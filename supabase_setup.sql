-- ===================================================================
-- SUPABASE DATABASE SETUP FOR CLASSROOM ATTENDANCE MANAGEMENT SYSTEM
-- ===================================================================
-- 
-- This file contains all the SQL needed to set up your Supabase database
-- Run this in your Supabase Dashboard > SQL Editor
--
-- Features:
-- - Student management
-- - Daily attendance tracking  
-- - QR code session-based attendance
-- - Attendance analytics and reporting
-- ===================================================================

-- ===================================================================
-- 1. CREATE TABLES
-- ===================================================================

-- Create students table
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create attendance table for daily attendance records
CREATE TABLE IF NOT EXISTS public.attendance (
    id SERIAL PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Late', 'Excused')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, date)
);

-- Create attendance_sessions table for QR code based attendance
CREATE TABLE IF NOT EXISTS public.attendance_sessions (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    teacher_id TEXT NOT NULL,
    title TEXT,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create session_attendance_records table for QR scan records
CREATE TABLE IF NOT EXISTS public.session_attendance_records (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    location TEXT,
    device_info TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, student_id)
);

-- Create courses table (optional - for better organization)
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE,
    description TEXT,
    teacher_id TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create student_courses junction table (many-to-many)
CREATE TABLE IF NOT EXISTS public.student_courses (
    id SERIAL PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(student_id, course_id)
);

-- ===================================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ===================================================================

-- Indexes for students table
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_students_name ON public.students(name);

-- Indexes for attendance table
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON public.attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON public.attendance(status);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON public.attendance(student_id, date);

-- Indexes for attendance_sessions table
CREATE INDEX IF NOT EXISTS idx_sessions_teacher_id ON public.attendance_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_sessions_course_id ON public.attendance_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON public.attendance_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON public.attendance_sessions(is_active);

-- Indexes for session_attendance_records table
CREATE INDEX IF NOT EXISTS idx_session_records_session_id ON public.session_attendance_records(session_id);
CREATE INDEX IF NOT EXISTS idx_session_records_student_id ON public.session_attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_session_records_timestamp ON public.session_attendance_records(timestamp);

-- Indexes for courses table
CREATE INDEX IF NOT EXISTS idx_courses_teacher_id ON public.courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_courses_code ON public.courses(code);
CREATE INDEX IF NOT EXISTS idx_courses_active ON public.courses(is_active);

-- ===================================================================
-- 3. CREATE FUNCTIONS AND TRIGGERS FOR UPDATED_AT
-- ===================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON public.students 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at 
    BEFORE UPDATE ON public.attendance 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at 
    BEFORE UPDATE ON public.attendance_sessions 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at 
    BEFORE UPDATE ON public.courses 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===================================================================
-- 4. CREATE VIEWS FOR COMMON QUERIES
-- ===================================================================

-- View for student attendance statistics
CREATE OR REPLACE VIEW public.student_attendance_stats AS
SELECT 
    s.id,
    s.name,
    s.email,
    COUNT(a.id) as total_records,
    COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present_count,
    COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent_count,
    COUNT(CASE WHEN a.status = 'Late' THEN 1 END) as late_count,
    COUNT(CASE WHEN a.status = 'Excused' THEN 1 END) as excused_count,
    ROUND(
        COUNT(CASE WHEN a.status = 'Present' THEN 1 END) * 100.0 / 
        NULLIF(COUNT(a.id), 0), 2
    ) as attendance_percentage
FROM public.students s
LEFT JOIN public.attendance a ON s.id = a.student_id
GROUP BY s.id, s.name, s.email;

-- View for session attendance summary
CREATE OR REPLACE VIEW public.session_attendance_summary AS
SELECT 
    ses.id as session_id,
    ses.title,
    ses.course_id,
    ses.teacher_id,
    ses.start_time,
    ses.end_time,
    COUNT(sar.id) as total_attendees,
    ses.is_active
FROM public.attendance_sessions ses
LEFT JOIN public.session_attendance_records sar ON ses.id = sar.session_id
GROUP BY ses.id, ses.title, ses.course_id, ses.teacher_id, ses.start_time, ses.end_time, ses.is_active;

-- ===================================================================
-- 5. SEED SAMPLE DATA
-- ===================================================================

-- Insert sample students
INSERT INTO public.students (id, name, email) VALUES
('s1', 'Michael Johnson', 'michael.johnson@example.com'),
('s2', 'Emily Davis', 'emily.davis@example.com'),
('s3', 'Christopher Miller', 'christopher.miller@example.com'),
('s4', 'Jessica Wilson', 'jessica.wilson@example.com'),
('s5', 'David Martinez', 'david.martinez@example.com'),
('s6', 'Muneer Ahmed', 'muneer.ahmed@example.com'),
('s7', 'Sarah Thompson', 'sarah.thompson@example.com'),
('s8', 'James Brown', 'james.brown@example.com'),
('s9', 'Lisa Chen', 'lisa.chen@example.com'),
('s10', 'Robert Garcia', 'robert.garcia@example.com')
ON CONFLICT (id) DO NOTHING;

-- Insert sample courses
INSERT INTO public.courses (id, name, code, description, teacher_id) VALUES
('c1', 'Mathematics 101', 'MATH101', 'Introduction to Algebra and Geometry', 'teacher1'),
('c2', 'Computer Science Fundamentals', 'CS101', 'Basic programming and computer concepts', 'teacher2'),
('c3', 'English Literature', 'ENG101', 'Classic and modern literature analysis', 'teacher3'),
('c4', 'Physics Laboratory', 'PHY101', 'Hands-on physics experiments', 'teacher1'),
('c5', 'History of Science', 'HIST101', 'Evolution of scientific thought', 'teacher4')
ON CONFLICT (id) DO NOTHING;

-- Insert student course enrollments
INSERT INTO public.student_courses (student_id, course_id) VALUES
('s1', 'c1'), ('s1', 'c2'),
('s2', 'c1'), ('s2', 'c3'),
('s3', 'c2'), ('s3', 'c4'),
('s4', 'c1'), ('s4', 'c3'), ('s4', 'c5'),
('s5', 'c2'), ('s5', 'c4'),
('s6', 'c1'), ('s6', 'c2'), ('s6', 'c3'),
('s7', 'c3'), ('s7', 'c5'),
('s8', 'c1'), ('s8', 'c4'),
('s9', 'c2'), ('s9', 'c3'), ('s9', 'c4'),
('s10', 'c1'), ('s10', 'c5')
ON CONFLICT (student_id, course_id) DO NOTHING;

-- Insert sample attendance records (last 2 weeks)
INSERT INTO public.attendance (student_id, date, status, notes) VALUES
-- Week 1
('s1', '2024-01-15', 'Present', 'On time'),
('s1', '2024-01-16', 'Present', 'Participated actively'),
('s1', '2024-01-17', 'Absent', 'Sick leave'),
('s1', '2024-01-18', 'Present', 'Made up missed work'),
('s1', '2024-01-19', 'Late', 'Traffic delay'),

('s2', '2024-01-15', 'Present', 'Excellent participation'),
('s2', '2024-01-16', 'Present', 'Helped other students'),
('s2', '2024-01-17', 'Present', 'Submitted project early'),
('s2', '2024-01-18', 'Present', 'Asked good questions'),
('s2', '2024-01-19', 'Present', 'Perfect attendance'),

('s3', '2024-01-15', 'Late', 'Overslept'),
('s3', '2024-01-16', 'Absent', 'Family emergency'),
('s3', '2024-01-17', 'Absent', 'Still dealing with emergency'),
('s3', '2024-01-18', 'Present', 'Back to normal'),
('s3', '2024-01-19', 'Excused', 'Medical appointment'),

('s4', '2024-01-15', 'Present', 'Good focus'),
('s4', '2024-01-16', 'Present', 'Completed all exercises'),
('s4', '2024-01-17', 'Late', 'Bus delay'),
('s4', '2024-01-18', 'Late', 'Dentist appointment'),
('s4', '2024-01-19', 'Late', 'Consistent tardiness'),

('s5', '2024-01-15', 'Excused', 'School event'),
('s5', '2024-01-16', 'Present', 'Made up work'),
('s5', '2024-01-17', 'Present', 'Good performance'),
('s5', '2024-01-18', 'Present', 'Volunteer helper'),
('s5', '2024-01-19', 'Present', 'Strong finish'),

-- Week 2
('s1', '2024-01-22', 'Present', 'Well prepared'),
('s1', '2024-01-23', 'Present', 'Group leader'),
('s1', '2024-01-24', 'Present', 'Excellent presentation'),
('s1', '2024-01-25', 'Present', 'Helped struggling student'),
('s1', '2024-01-26', 'Present', 'Perfect week'),

('s2', '2024-01-22', 'Present', 'Consistent excellence'),
('s2', '2024-01-23', 'Present', 'Peer tutor'),
('s2', '2024-01-24', 'Present', 'Outstanding project'),
('s2', '2024-01-25', 'Present', 'Class discussion leader'),
('s2', '2024-01-26', 'Present', 'Model student'),

('s3', '2024-01-22', 'Present', 'Much improved'),
('s3', '2024-01-23', 'Present', 'Asking questions'),
('s3', '2024-01-24', 'Late', 'Still struggling with time'),
('s3', '2024-01-25', 'Present', 'Better organization'),
('s3', '2024-01-26', 'Present', 'Positive trend'),

('s4', '2024-01-22', 'Present', 'On time today'),
('s4', '2024-01-23', 'Late', 'Same issue'),
('s4', '2024-01-24', 'Late', 'Needs intervention'),
('s4', '2024-01-25', 'Present', 'Discussed punctuality'),
('s4', '2024-01-26', 'Present', 'Improvement noted'),

('s5', '2024-01-22', 'Present', 'Great attitude'),
('s5', '2024-01-23', 'Present', 'Leadership qualities'),
('s5', '2024-01-24', 'Present', 'Reliable student'),
('s5', '2024-01-25', 'Present', 'Strong academic performance'),
('s5', '2024-01-26', 'Present', 'Excellent week')
ON CONFLICT (student_id, date) DO NOTHING;

-- Insert sample attendance sessions
INSERT INTO public.attendance_sessions (id, course_id, teacher_id, title, description, start_time, end_time, is_active) VALUES
('sess1', 'c1', 'teacher1', 'Algebra Review Session', 'Review of quadratic equations', 
 '2024-01-29 09:00:00+00', '2024-01-29 10:30:00+00', false),
('sess2', 'c2', 'teacher2', 'Programming Lab', 'Introduction to Python', 
 '2024-01-29 14:00:00+00', '2024-01-29 16:00:00+00', false),
('sess3', 'c1', 'teacher1', 'Geometry Workshop', 'Hands-on geometry problems', 
 '2024-01-30 10:00:00+00', '2024-01-30 11:30:00+00', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample session attendance records
INSERT INTO public.session_attendance_records (id, session_id, student_id, timestamp, location) VALUES
('rec1', 'sess1', 's1', '2024-01-29 09:05:00+00', 'Room 101'),
('rec2', 'sess1', 's2', '2024-01-29 09:03:00+00', 'Room 101'),
('rec3', 'sess1', 's4', '2024-01-29 09:15:00+00', 'Room 101'),
('rec4', 'sess1', 's6', '2024-01-29 09:08:00+00', 'Room 101'),
('rec5', 'sess2', 's1', '2024-01-29 14:02:00+00', 'Computer Lab'),
('rec6', 'sess2', 's3', '2024-01-29 14:10:00+00', 'Computer Lab'),
('rec7', 'sess2', 's5', '2024-01-29 14:01:00+00', 'Computer Lab'),
('rec8', 'sess2', 's6', '2024-01-29 14:05:00+00', 'Computer Lab'),
('rec9', 'sess2', 's9', '2024-01-29 14:12:00+00', 'Computer Lab')
ON CONFLICT (id) DO NOTHING;

-- ===================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES (OPTIONAL)
-- ===================================================================

-- Enable RLS on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_courses ENABLE ROW LEVEL SECURITY;

-- Basic policies (you can modify these based on your authentication needs)

-- Students can view their own data
CREATE POLICY "Students can view own data" ON public.students
    FOR SELECT USING (auth.uid()::text = id);

-- Teachers and admins can view all students
CREATE POLICY "Teachers can view all students" ON public.students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.uid() = id 
            AND raw_user_meta_data->>'role' IN ('teacher', 'admin')
        )
    );

-- Students can view their own attendance
CREATE POLICY "Students can view own attendance" ON public.attendance
    FOR SELECT USING (auth.uid()::text = student_id);

-- Teachers can manage attendance for their courses
CREATE POLICY "Teachers can manage attendance" ON public.attendance
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.uid() = id 
            AND raw_user_meta_data->>'role' IN ('teacher', 'admin')
        )
    );

-- Session policies
CREATE POLICY "Teachers can manage sessions" ON public.attendance_sessions
    FOR ALL USING (
        auth.uid()::text = teacher_id OR
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.uid() = id 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Students can view active sessions
CREATE POLICY "Students can view active sessions" ON public.attendance_sessions
    FOR SELECT USING (is_active = true);

-- Students can record their own attendance
CREATE POLICY "Students can record own attendance" ON public.session_attendance_records
    FOR INSERT WITH CHECK (auth.uid()::text = student_id);

-- ===================================================================
-- 7. UTILITY FUNCTIONS
-- ===================================================================

-- Function to get attendance percentage for a student
CREATE OR REPLACE FUNCTION public.get_student_attendance_percentage(
    student_uuid TEXT,
    start_date DATE DEFAULT NULL,
    end_date DATE DEFAULT NULL
)
RETURNS DECIMAL AS $$
DECLARE
    total_days INTEGER;
    present_days INTEGER;
    percentage DECIMAL;
BEGIN
    -- Set default dates if not provided
    IF start_date IS NULL THEN
        start_date := CURRENT_DATE - INTERVAL '30 days';
    END IF;
    
    IF end_date IS NULL THEN
        end_date := CURRENT_DATE;
    END IF;
    
    -- Count total attendance records
    SELECT COUNT(*) INTO total_days
    FROM public.attendance
    WHERE student_id = student_uuid
    AND date BETWEEN start_date AND end_date;
    
    -- Count present days (including late but not absent)
    SELECT COUNT(*) INTO present_days
    FROM public.attendance
    WHERE student_id = student_uuid
    AND date BETWEEN start_date AND end_date
    AND status IN ('Present', 'Late');
    
    -- Calculate percentage
    IF total_days > 0 THEN
        percentage := (present_days::DECIMAL / total_days::DECIMAL) * 100;
    ELSE
        percentage := 0;
    END IF;
    
    RETURN ROUND(percentage, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old sessions
CREATE OR REPLACE FUNCTION public.cleanup_old_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete sessions older than 30 days
    DELETE FROM public.attendance_sessions
    WHERE end_time < NOW() - INTERVAL '30 days'
    AND is_active = false;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ===================================================================
-- SETUP COMPLETE!
-- ===================================================================

-- Verify the setup
DO $$
BEGIN
    RAISE NOTICE '✅ Database setup complete!';
    RAISE NOTICE '📊 Sample data inserted:';
    RAISE NOTICE '   - % students', (SELECT COUNT(*) FROM public.students);
    RAISE NOTICE '   - % courses', (SELECT COUNT(*) FROM public.courses);
    RAISE NOTICE '   - % attendance records', (SELECT COUNT(*) FROM public.attendance);
    RAISE NOTICE '   - % attendance sessions', (SELECT COUNT(*) FROM public.attendance_sessions);
    RAISE NOTICE '🔒 Row Level Security enabled';
    RAISE NOTICE '📈 Views and functions created';
    RAISE NOTICE '🚀 Ready to use!';
END $$;