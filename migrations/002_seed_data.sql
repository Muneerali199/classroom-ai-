-- Seed data migration: Insert sample students and attendance records

-- Insert students
INSERT INTO students (id, name) VALUES
('s1', 'Michael Johnson'),
('s2', 'Emily Davis'),
('s3', 'Christopher Miller'),
('s4', 'Jessica Wilson'),
('s5', 'David Martinez'),
('s6', 'Muneer')
ON CONFLICT (id) DO NOTHING;

-- Insert attendance records for s1
INSERT INTO attendance (student_id, date, status) VALUES
('s1', '2024-05-01', 'Present'),
('s1', '2024-05-02', 'Present'),
('s1', '2024-05-03', 'Absent'),
('s1', '2024-05-06', 'Present'),
('s1', '2024-05-07', 'Late')
ON CONFLICT (student_id, date) DO NOTHING;

-- Insert attendance records for s2
INSERT INTO attendance (student_id, date, status) VALUES
('s2', '2024-05-01', 'Present'),
('s2', '2024-05-02', 'Present'),
('s2', '2024-05-03', 'Present'),
('s2', '2024-05-06', 'Present'),
('s2', '2024-05-07', 'Present')
ON CONFLICT (student_id, date) DO NOTHING;

-- Insert attendance records for s3
INSERT INTO attendance (student_id, date, status) VALUES
('s3', '2024-05-01', 'Late'),
('s3', '2024-05-02', 'Absent'),
('s3', '2024-05-03', 'Absent'),
('s3', '2024-05-06', 'Present'),
('s3', '2024-05-07', 'Excused')
ON CONFLICT (student_id, date) DO NOTHING;

-- Insert attendance records for s4
INSERT INTO attendance (student_id, date, status) VALUES
('s4', '2024-05-01', 'Present'),
('s4', '2024-05-02', 'Present'),
('s4', '2024-05-03', 'Late'),
('s4', '2024-05-06', 'Late'),
('s4', '2024-05-07', 'Late')
ON CONFLICT (student_id, date) DO NOTHING;

-- Insert attendance records for s5
INSERT INTO attendance (student_id, date, status) VALUES
('s5', '2024-05-01', 'Excused'),
('s5', '2024-05-02', 'Present'),
('s5', '2024-05-03', 'Present'),
('s5', '2024-05-06', 'Present'),
('s5', '2024-05-07', 'Present')
ON CONFLICT (student_id, date) DO NOTHING;

-- Insert attendance records for s6
INSERT INTO attendance (student_id, date, status) VALUES
('s6', '2024-05-01', 'Present'),
('s6', '2024-05-02', 'Present'),
('s6', '2024-05-03', 'Present'),
('s6', '2024-05-06', 'Present'),
('s6', '2024-05-07', 'Present')
ON CONFLICT (student_id, date) DO NOTHING;