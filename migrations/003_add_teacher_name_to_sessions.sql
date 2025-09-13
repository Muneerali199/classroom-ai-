-- Migration: Add teacher_name column to attendance_sessions table

-- Add teacher_name column to attendance_sessions
ALTER TABLE attendance_sessions 
ADD COLUMN teacher_name TEXT;

-- Update existing records with a default value if needed
UPDATE attendance_sessions 
SET teacher_name = 'Unknown Teacher' 
WHERE teacher_name IS NULL;

-- Make the column NOT NULL for future records
ALTER TABLE attendance_sessions 
ALTER COLUMN teacher_name SET NOT NULL;