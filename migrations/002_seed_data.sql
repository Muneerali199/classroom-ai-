-- Seed data migration: Insert sample students and attendance records

-- Insert students
INSERT INTO students (id, name) VALUES
('s1', 'Aarav Sharma'),
('s2', 'Diya Patel'),
('s3', 'Reyansh Kumar'),
('s4', 'Anika Singh'),
('s5', 'Vivaan Gupta'),
('s6', 'Ishaan Ali')
ON CONFLICT (id) DO NOTHING;

-- Insert attendance records for s1
INSERT INTO attendance (student_id, date, status) VALUES
('s1', '2025-05-01', 'Present'),
('s1', '2025-05-02', 'Present'),
('s1', '2025-05-03', 'Absent'),
('s1', '2025-05-06', 'Present'),
('s1', '2025-05-07', 'Late')
ON CONFLICT (student_id, date) DO NOTHING;

-- Insert attendance records for s2
INSERT INTO attendance (student_id, date, status) VALUES
('s2', '2025-05-01', 'Present'),
('s2', '2025-05-02', 'Present'),
('s2', '2025-05-03', 'Present'),
('s2', '2025-05-06', 'Present'),
('s2', '2025-05-07', 'Present')
ON CONFLICT (student_id, date) DO NOTHING;

-- Insert attendance records for s3
INSERT INTO attendance (student_id, date, status) VALUES
('s3', '2025-05-01', 'Late'),
('s3', '2025-05-02', 'Absent'),
('s3', '2025-05-03', 'Absent'),
('s3', '2025-05-06', 'Present'),
('s3', '2025-05-07', 'Excused')
ON CONFLICT (student_id, date) DO NOTHING;

-- Insert attendance records for s4
INSERT INTO attendance (student_id, date, status) VALUES
('s4', '2025-05-01', 'Present'),
('s4', '2025-05-02', 'Present'),
('s4', '2025-05-03', 'Late'),
('s4', '2025-05-06', 'Late'),
('s4', '2025-05-07', 'Late')
ON CONFLICT (student_id, date) DO NOTHING;

-- Insert attendance records for s5
INSERT INTO attendance (student_id, date, status) VALUES
('s5', '2025-05-01', 'Excused'),
('s5', '2025-05-02', 'Present'),
('s5', '2025-05-03', 'Present'),
('s5', '2025-05-06', 'Present'),
('s5', '2025-05-07', 'Present')
ON CONFLICT (student_id, date) DO NOTHING;

-- Insert attendance records for s6
INSERT INTO attendance (student_id, date, status) VALUES
('s6', '2025-05-01', 'Present'),
('s6', '2025-05-02', 'Present'),
('s6', '2025-05-03', 'Present'),
('s6', '2025-05-06', 'Present'),
('s6', '2025-05-07', 'Present')
ON CONFLICT (student_id, date) DO NOTHING;