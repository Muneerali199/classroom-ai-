-- Migration: Create subjects and rooms tables for teacher management
-- This will allow teachers to manage subjects and rooms for their classes

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    code TEXT UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    room_number TEXT NOT NULL UNIQUE,
    capacity INTEGER,
    building TEXT,
    floor INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create teacher_subjects table to link teachers to subjects
CREATE TABLE IF NOT EXISTS teacher_subjects (
    id SERIAL PRIMARY KEY,
    teacher_id TEXT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(teacher_id, subject_id)
);

-- Create teacher_rooms table to link teachers to rooms
CREATE TABLE IF NOT EXISTS teacher_rooms (
    id SERIAL PRIMARY KEY,
    teacher_id TEXT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(teacher_id, room_id)
);

-- Create subject_students table to link students to subjects
CREATE TABLE IF NOT EXISTS subject_students (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(subject_id, student_id)
);

-- Create room_students table to link students to rooms
CREATE TABLE IF NOT EXISTS room_students (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(room_id, student_id)
);

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_subjects_name ON subjects(name);
CREATE INDEX IF NOT EXISTS idx_rooms_room_number ON rooms(room_number);
CREATE INDEX IF NOT EXISTS idx_teacher_subjects_teacher_id ON teacher_subjects(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_subjects_subject_id ON teacher_subjects(subject_id);
CREATE INDEX IF NOT EXISTS idx_teacher_rooms_teacher_id ON teacher_rooms(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_rooms_room_id ON teacher_rooms(room_id);
CREATE INDEX IF NOT EXISTS idx_subject_students_subject_id ON subject_students(subject_id);
CREATE INDEX IF NOT EXISTS idx_subject_students_student_id ON subject_students(student_id);
CREATE INDEX IF NOT EXISTS idx_room_students_room_id ON room_students(room_id);
CREATE INDEX IF NOT EXISTS idx_room_students_student_id ON room_students(student_id);

-- Create trigger to update updated_at timestamp for subjects
CREATE OR REPLACE FUNCTION update_subjects_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subjects_updated_at 
    BEFORE UPDATE ON subjects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_subjects_updated_at_column();

-- Create trigger to update updated_at timestamp for rooms
CREATE OR REPLACE FUNCTION update_rooms_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rooms_updated_at 
    BEFORE UPDATE ON rooms 
    FOR EACH ROW 
    EXECUTE FUNCTION update_rooms_updated_at_column();