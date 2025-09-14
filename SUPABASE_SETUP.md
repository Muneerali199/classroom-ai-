# Supabase Setup Guide

This guide will help you set up Supabase for the classroom attendance management system.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js installed on your machine

## Step 1: Create a Supabase Project

1. Go to the [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter a project name (e.g., "classroom-attendance")
5. Enter a database password (save this securely)
6. Select a region close to your users
7. Click "Create new project"

Wait for the project to be created (this may take a few minutes).

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys") - optional but recommended

## Step 3: Configure Environment Variables

1. Copy the `.env` file to `.env.local`:
   ```bash
   cp .env .env.local
   ```

2. Edit `.env.local` and replace the placeholder values:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   
   # Optional: Service role key for admin operations
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Set Up the Database

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `migrations/001_create_tables.sql`
5. Click "Run" to execute the migration
6. Create another new query
7. Copy and paste the contents of `migrations/002_seed_data.sql`
8. Click "Run" to seed the database with sample data

### Option B: Using the Setup Script

Run the setup script to check your configuration and get migration instructions:

```bash
npm run setup:supabase
```

This script will:
- Verify your environment variables
- Test the database connection
- Display the migration SQL if tables don't exist
- Show existing data if the database is already set up

## Step 6: Verify the Setup

Run the database check command:

```bash
npm run db:check
```

If everything is set up correctly, you should see:
- ✅ Connection successful!
- ✅ Database is set up and contains data!
- A list of sample students

## Database Schema

The system uses the following tables:

### `students`
- `id` (TEXT, PRIMARY KEY) - Unique student identifier
- `name` (TEXT, NOT NULL) - Student's full name

### `attendance`
- `id` (SERIAL, PRIMARY KEY) - Auto-incrementing ID
- `student_id` (TEXT, FOREIGN KEY) - References students.id
- `date` (DATE, NOT NULL) - Attendance date
- `status` (TEXT, NOT NULL) - One of: 'Present', 'Absent', 'Late', 'Excused'
- Unique constraint on (student_id, date)

### `attendance_sessions`
- `id` (TEXT, PRIMARY KEY) - Unique session identifier
- `course_id` (TEXT, NOT NULL) - Course/class identifier
- `teacher_id` (TEXT, NOT NULL) - Teacher identifier
- `start_time` (TIMESTAMPTZ, NOT NULL) - Session start time
- `end_time` (TIMESTAMPTZ, NOT NULL) - Session end time
- `created_at` (TIMESTAMPTZ, DEFAULT NOW()) - Creation timestamp

### `session_attendance_records`
- `id` (TEXT, PRIMARY KEY) - Unique record identifier
- `session_id` (TEXT, FOREIGN KEY) - References attendance_sessions.id
- `student_id` (TEXT, FOREIGN KEY) - References students.id
- `timestamp` (TIMESTAMPTZ, DEFAULT NOW()) - When attendance was recorded
- Unique constraint on (session_id, student_id)

## Row Level Security (RLS)

For production use, consider enabling Row Level Security:

1. Go to **Authentication** > **Policies** in your Supabase dashboard
2. Enable RLS for each table
3. Create policies based on your authentication requirements

Example policies:
```sql
-- Allow read access to students table
CREATE POLICY "Allow read access to students" ON students
FOR SELECT USING (true);

-- Allow authenticated users to mark attendance
CREATE POLICY "Allow attendance marking" ON attendance
FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

## Troubleshooting

### Connection Issues
- Verify your `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check that your `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
- Ensure there are no extra spaces or quotes in your environment variables

### Migration Issues
- Make sure you're running the SQL in the correct order
- Check for any error messages in the Supabase SQL Editor
- Verify that your database user has the necessary permissions

### Permission Issues
- If using RLS, ensure your policies allow the operations you're trying to perform
- Check that you're using the correct API key for your use case

## Next Steps

Once Supabase is set up, you can:

1. Start the development server: `npm run dev`
2. Access the application at `http://localhost:9002`
3. Use the attendance management features
4. Customize the database schema as needed for your use case

## API Usage Examples

The project includes a comprehensive database service in `src/lib/database.ts` with the following services:

- `StudentService` - CRUD operations for students
- `AttendanceService` - Attendance tracking and statistics
- `AttendanceSessionService` - Session-based attendance management
- `DatabaseUtils` - Utility functions for testing and migrations

Example usage:
```typescript
import { StudentService, AttendanceService } from '@/lib/database'

// Get all students
const students = await StudentService.getAll()

// Mark attendance
await AttendanceService.markAttendance({
  student_id: 's1',
  date: '2024-01-15',
  status: 'Present'
})

// Get attendance stats
const stats = await AttendanceService.getAttendanceStats('s1')
```