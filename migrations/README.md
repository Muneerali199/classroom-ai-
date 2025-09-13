# Supabase Migration Instructions

This directory contains SQL scripts to migrate the static data from `src/lib/data.ts` to Supabase.

## Tables Created

1. **students**
   - `id` (TEXT, PRIMARY KEY): Student ID
   - `name` (TEXT, NOT NULL): Student name

2. **attendance**
   - `id` (SERIAL, PRIMARY KEY): Auto-incrementing ID
   - `student_id` (TEXT, FOREIGN KEY): References students.id
   - `date` (DATE, NOT NULL): Attendance date
   - `status` (TEXT, NOT NULL): Attendance status ('Present', 'Absent', 'Late', 'Excused')
   - UNIQUE constraint on (student_id, date)

3. **attendance_sessions**
   - `id` (TEXT, PRIMARY KEY): Session ID
   - `course_id` (TEXT, NOT NULL): Course ID
   - `teacher_id` (TEXT, NOT NULL): Teacher ID
   - `start_time` (TIMESTAMPTZ, NOT NULL): Session start time
   - `end_time` (TIMESTAMPTZ, NOT NULL): Session end time
   - `created_at` (TIMESTAMPTZ, NOT NULL): Creation timestamp

4. **session_attendance_records**
   - `id` (TEXT, PRIMARY KEY): Record ID
   - `session_id` (TEXT, FOREIGN KEY): References attendance_sessions.id
   - `student_id` (TEXT, FOREIGN KEY): References students.id
   - `timestamp` (TIMESTAMPTZ, NOT NULL): Attendance timestamp
   - UNIQUE constraint on (session_id, student_id)

## Running the Migrations

1. Log in to your Supabase dashboard at https://supabase.com/dashboard

2. Select your project

3. Go to the SQL Editor section

4. Copy and paste the contents of `001_create_tables.sql` into the SQL editor

5. Click "Run" to create the tables

6. Copy and paste the contents of `002_seed_data.sql` into the SQL editor

7. Click "Run" to insert the sample data

## Data Migrated

- **6 students** with their basic information
- **30 attendance records** across the 6 students for dates 2024-05-01 to 2024-05-07
- No session data was migrated as the arrays were empty in the source

## Notes

- The scripts use `IF NOT EXISTS` and `ON CONFLICT DO NOTHING` to prevent errors if run multiple times
- All foreign key constraints are set up with CASCADE delete
- The attendance table has a unique constraint to prevent duplicate entries for the same student and date
- Timestamps use TIMESTAMPTZ for timezone awareness