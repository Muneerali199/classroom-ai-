-- Migration: Create comprehensive timetable system
-- This migration creates tables for timetable management with real-time notifications

-- Create timetables table for main timetable entries
CREATE TABLE IF NOT EXISTS public.timetables (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    subject_id INTEGER REFERENCES public.subjects(id) ON DELETE SET NULL,
    room_id INTEGER REFERENCES public.rooms(id) ON DELETE SET NULL,
    teacher_id TEXT NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday, 6 = Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    academic_year TEXT,
    semester TEXT,
    created_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Create timetable_students table for class attendance
CREATE TABLE IF NOT EXISTS public.timetable_students (
    id SERIAL PRIMARY KEY,
    timetable_id TEXT NOT NULL REFERENCES public.timetables(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(timetable_id, student_id)
);

-- Create timetable_notifications table for class reminders
CREATE TABLE IF NOT EXISTS public.timetable_notifications (
    id SERIAL PRIMARY KEY,
    timetable_id TEXT NOT NULL REFERENCES public.timetables(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    notification_time TIMESTAMPTZ NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_timetables_teacher ON public.timetables(teacher_id);
CREATE INDEX IF NOT EXISTS idx_timetables_subject ON public.timetables(subject_id);
CREATE INDEX IF NOT EXISTS idx_timetables_room ON public.timetables(room_id);
CREATE INDEX IF NOT EXISTS idx_timetables_day ON public.timetables(day_of_week);
CREATE INDEX IF NOT EXISTS idx_timetables_active ON public.timetables(is_active);
CREATE INDEX IF NOT EXISTS idx_timetables_times ON public.timetables(start_time, end_time);

CREATE INDEX IF NOT EXISTS idx_timetable_students_timetable ON public.timetable_students(timetable_id);
CREATE INDEX IF NOT EXISTS idx_timetable_students_student ON public.timetable_students(student_id);

CREATE INDEX IF NOT EXISTS idx_timetable_notif_timetable ON public.timetable_notifications(timetable_id);
CREATE INDEX IF NOT EXISTS idx_timetable_notif_student ON public.timetable_notifications(student_id);
CREATE INDEX IF NOT EXISTS idx_timetable_notif_time ON public.timetable_notifications(notification_time);
CREATE INDEX IF NOT EXISTS idx_timetable_notif_sent ON public.timetable_notifications(is_sent);

-- Create trigger for updated_at
CREATE TRIGGER update_timetables_updated_at 
    BEFORE UPDATE ON public.timetables 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on timetable tables
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for timetables
-- Teachers and deans can manage timetables
CREATE POLICY "Teachers and deans manage timetables" ON public.timetables
    FOR ALL USING (
        auth.uid()::text = teacher_id OR
        auth.uid()::text = created_by OR
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.uid() = id 
            AND (raw_user_meta_data->>'role' = 'teacher' OR raw_user_meta_data->>'role' = 'dean')
        )
    );

-- Students can view all active timetables
CREATE POLICY "Students view active timetables" ON public.timetables
    FOR SELECT USING (
        is_active = true AND
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.uid() = id 
            AND raw_user_meta_data->>'role' = 'student'
        )
    );

-- RLS Policies for timetable_students
-- Teachers can manage enrollments
CREATE POLICY "Teachers manage student enrollments" ON public.timetable_students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.uid() = id 
            AND (raw_user_meta_data->>'role' = 'teacher' OR raw_user_meta_data->>'role' = 'dean')
        )
    );

-- Students can view their own enrollments
CREATE POLICY "Students view own enrollments" ON public.timetable_students
    FOR SELECT USING (
        auth.uid()::text = student_id OR
        EXISTS (
            SELECT 1 FROM students 
            WHERE auth_user_id = auth.uid() 
            AND id = student_id
        )
    );

-- RLS Policies for timetable_notifications
-- Students can view their own notifications
CREATE POLICY "Students view own timetable notifications" ON public.timetable_notifications
    FOR SELECT USING (
        auth.uid()::text = student_id OR
        EXISTS (
            SELECT 1 FROM students 
            WHERE auth_user_id = auth.uid() 
            AND id = student_id
        )
    );

-- Teachers can create notifications
CREATE POLICY "Teachers create timetable notifications" ON public.timetable_notifications
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.uid() = id 
            AND (raw_user_meta_data->>'role' = 'teacher' OR raw_user_meta_data->>'role' = 'dean')
        )
    );

-- Create view for student timetable with full details
CREATE OR REPLACE VIEW public.student_timetable_view AS
SELECT 
    t.id,
    t.title,
    t.day_of_week,
    t.start_time,
    t.end_time,
    t.description,
    t.academic_year,
    t.semester,
    s.name as subject_name,
    r.room_number,
    r.building as room_building,
    r.capacity as room_capacity,
    ts.student_id,
    ts.enrolled_at,
    CASE t.day_of_week
        WHEN 0 THEN 'Sunday'
        WHEN 1 THEN 'Monday'
        WHEN 2 THEN 'Tuesday'
        WHEN 3 THEN 'Wednesday'
        WHEN 4 THEN 'Thursday'
        WHEN 5 THEN 'Friday'
        WHEN 6 THEN 'Saturday'
    END as day_name
FROM public.timetables t
LEFT JOIN public.subjects s ON t.subject_id = s.id
LEFT JOIN public.rooms r ON t.room_id = r.id
INNER JOIN public.timetable_students ts ON t.id = ts.timetable_id
WHERE t.is_active = true
ORDER BY t.day_of_week, t.start_time;

-- Create view for teacher timetable
CREATE OR REPLACE VIEW public.teacher_timetable_view AS
SELECT 
    t.id,
    t.title,
    t.day_of_week,
    t.start_time,
    t.end_time,
    t.description,
    t.academic_year,
    t.semester,
    t.is_active,
    s.name as subject_name,
    r.room_number,
    r.building as room_building,
    t.teacher_id,
    COUNT(DISTINCT ts.student_id) as enrolled_students,
    CASE t.day_of_week
        WHEN 0 THEN 'Sunday'
        WHEN 1 THEN 'Monday'
        WHEN 2 THEN 'Tuesday'
        WHEN 3 THEN 'Wednesday'
        WHEN 4 THEN 'Thursday'
        WHEN 5 THEN 'Friday'
        WHEN 6 THEN 'Saturday'
    END as day_name
FROM public.timetables t
LEFT JOIN public.subjects s ON t.subject_id = s.id
LEFT JOIN public.rooms r ON t.room_id = r.id
LEFT JOIN public.timetable_students ts ON t.id = ts.timetable_id
GROUP BY t.id, s.name, r.room_number, r.building
ORDER BY t.day_of_week, t.start_time;

-- Function to auto-create notifications for upcoming classes
CREATE OR REPLACE FUNCTION create_class_notifications()
RETURNS void AS $$
DECLARE
    timetable_record RECORD;
    student_record RECORD;
    notification_time TIMESTAMPTZ;
    class_datetime TIMESTAMPTZ;
BEGIN
    -- Loop through active timetables for the next 7 days
    FOR timetable_record IN 
        SELECT * FROM timetables WHERE is_active = true
    LOOP
        -- Calculate next occurrence of this class
        class_datetime := date_trunc('week', CURRENT_TIMESTAMP) + 
                         (timetable_record.day_of_week || ' days')::INTERVAL + 
                         timetable_record.start_time::TIME;
        
        IF class_datetime < CURRENT_TIMESTAMP THEN
            class_datetime := class_datetime + '7 days'::INTERVAL;
        END IF;
        
        -- Set notification time to 30 minutes before class
        notification_time := class_datetime - '30 minutes'::INTERVAL;
        
        -- Create notifications for all enrolled students
        FOR student_record IN 
            SELECT student_id FROM timetable_students 
            WHERE timetable_id = timetable_record.id
        LOOP
            -- Only create if notification doesn't exist and is in future
            IF notification_time > CURRENT_TIMESTAMP AND NOT EXISTS (
                SELECT 1 FROM timetable_notifications 
                WHERE timetable_id = timetable_record.id 
                AND student_id = student_record.student_id
                AND notification_time = notification_time
            ) THEN
                INSERT INTO timetable_notifications (
                    timetable_id,
                    student_id,
                    notification_time,
                    title,
                    message
                ) VALUES (
                    timetable_record.id,
                    student_record.student_id,
                    notification_time,
                    'Upcoming Class: ' || timetable_record.title,
                    'Your class starts in 30 minutes at ' || timetable_record.start_time::TEXT
                );
            END IF;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to send due notifications (call this periodically via cron or scheduled function)
CREATE OR REPLACE FUNCTION send_due_timetable_notifications()
RETURNS INTEGER AS $$
DECLARE
    notification_record RECORD;
    sent_count INTEGER := 0;
BEGIN
    FOR notification_record IN 
        SELECT tn.*, t.title, s.name as student_name
        FROM timetable_notifications tn
        JOIN timetables t ON tn.timetable_id = t.id
        JOIN students s ON tn.student_id = s.id
        WHERE tn.is_sent = false 
        AND tn.notification_time <= CURRENT_TIMESTAMP
    LOOP
        -- Insert into student_notifications table
        INSERT INTO student_notifications (
            student_id,
            title,
            message,
            type
        ) VALUES (
            notification_record.student_id,
            notification_record.title,
            notification_record.message,
            'timetable'
        );
        
        -- Mark as sent
        UPDATE timetable_notifications
        SET is_sent = true, sent_at = CURRENT_TIMESTAMP
        WHERE id = notification_record.id;
        
        sent_count := sent_count + 1;
    END LOOP;
    
    RETURN sent_count;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT SELECT ON public.student_timetable_view TO authenticated;
GRANT SELECT ON public.teacher_timetable_view TO authenticated;

-- Add comments
COMMENT ON TABLE public.timetables IS 'Main timetable entries for classes';
COMMENT ON TABLE public.timetable_students IS 'Student enrollments in timetable classes';
COMMENT ON TABLE public.timetable_notifications IS 'Automated notifications for upcoming classes';
COMMENT ON VIEW public.student_timetable_view IS 'Student view of timetable with all details';
COMMENT ON VIEW public.teacher_timetable_view IS 'Teacher view of timetable with enrollment counts';
COMMENT ON FUNCTION create_class_notifications IS 'Auto-creates notifications for upcoming classes';
COMMENT ON FUNCTION send_due_timetable_notifications IS 'Sends due notifications to students';

-- Verification
DO $$
BEGIN
    RAISE NOTICE '✅ Timetable system migration complete!';
    RAISE NOTICE '📅 Tables created: timetables, timetable_students, timetable_notifications';
    RAISE NOTICE '🔒 Row Level Security enabled';
    RAISE NOTICE '📊 Views created: student_timetable_view, teacher_timetable_view';
    RAISE NOTICE '⚡ Functions created: create_class_notifications, send_due_timetable_notifications';
    RAISE NOTICE '🔔 Set up a cron job to call send_due_timetable_notifications() periodically';
END $$;
