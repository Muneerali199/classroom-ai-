-- Migration 004: Add PIN column to attendance_sessions table
-- This enables PIN-based attendance as an alternative to QR codes

-- Add PIN column to attendance_sessions table (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'attendance_sessions' 
        AND column_name = 'pin'
    ) THEN
        ALTER TABLE attendance_sessions ADD COLUMN pin VARCHAR(8);
    END IF;
END $$;

-- Add index on PIN for faster lookups (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_attendance_sessions_pin ON attendance_sessions(pin);

-- Add comment explaining the PIN column (safe to run multiple times)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'attendance_sessions' 
        AND column_name = 'pin'
    ) THEN
        EXECUTE 'COMMENT ON COLUMN attendance_sessions.pin IS ''Numeric PIN for attendance session (alternative to QR code)''';
    END IF;
END $$;