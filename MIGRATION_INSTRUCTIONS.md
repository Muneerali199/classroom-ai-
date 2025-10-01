# Database Migration Instructions

## ✅ Assignments Table Setup

### Step 1: Run the Database Migration

Navigate to your Supabase Dashboard and execute the migration script:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Open the migration file: `migrations/014_create_assignments_table.sql`
3. Copy the entire content and paste it into the SQL Editor
4. Click **Run** to execute the migration

This will create:
- ✅ `assignments` table
- ✅ `assignment_submissions` table  
- ✅ `student_notifications` table
- ✅ All necessary indexes and triggers
- ✅ Row Level Security (RLS) policies
- ✅ Views for assignment statistics

### Step 2: Create Storage Bucket

Create the storage bucket for assignment files:

1. Go to **Supabase Dashboard** → **Storage**
2. Click **New Bucket**
3. Enter the following details:
   - **Name**: `assignments`
   - **Public**: Uncheck (keep it private)
   - Click **Create Bucket**

### Step 3: Set Up Storage Policies

After creating the bucket, set up access policies:

1. Click on the `assignments` bucket
2. Go to **Policies** tab
3. Add the following policies:

#### Policy 1: Teachers Upload Files
```sql
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
```

#### Policy 2: Authenticated Users View Files
```sql
CREATE POLICY "Authenticated users view assignment files"
ON storage.objects FOR SELECT
USING (bucket_id = 'assignments' AND auth.role() = 'authenticated');
```

#### Policy 3: Students Upload Submission Files
```sql
CREATE POLICY "Students upload submission files"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'assignments' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.uid() = id
        AND raw_user_meta_data->>'role' = 'student'
    )
);
```

### Step 4: Verify the Setup

Run this query to verify all tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('assignments', 'assignment_submissions', 'student_notifications');
```

Expected output: 3 rows

### Step 5: Test the Assignment Creation

1. Log in to your application as a **Teacher**
2. Navigate to **Dashboard** → **Assignments**
3. Try creating a test assignment with:
   - Title
   - Description
   - Due Date
   - Subject (optional)
   - File attachment (optional)
4. Click **Publish Assignment**

If successful, you should see:
- ✅ Assignment created successfully
- ✅ Students notified (toast message)
- ✅ Assignment appears in the list

### Troubleshooting

#### Error: "relation 'public.assignments' does not exist"
**Solution**: Run the migration script in Step 1

#### Error: "Bucket not found"
**Solution**: Create the storage bucket in Step 2

#### Error: "Failed to fetch students" or "Failed to create notifications"
**Solution**: 
1. Ensure the `students` table exists
2. Check if you have any students in your database
3. Verify RLS policies allow the operation

#### Error: "Permission denied for table assignments"
**Solution**: Check RLS policies and ensure your user role is correctly set

### Database Schema Overview

#### `assignments` Table
- `id`: Primary key (UUID)
- `title`: Assignment title
- `description`: Assignment description
- `due_date`: Deadline for submission
- `subject_id`: Related subject (optional)
- `created_by`: Teacher who created it
- `file_url`: Signed URL for file access
- `file_type`: MIME type of uploaded file
- `file_path`: Storage path for file
- `status`: active, archived, or draft
- `max_score`: Maximum points (default: 100)
- `created_at`, `updated_at`: Timestamps

#### `assignment_submissions` Table
- `id`: Primary key (UUID)
- `assignment_id`: References assignments
- `student_id`: References students
- `submission_text`: Text content
- `file_url`, `file_type`, `file_path`: Submission file details
- `status`: submitted, graded, late, missing
- `score`: Grade received
- `feedback`: Teacher feedback
- `submitted_at`, `graded_at`: Timestamps

#### `student_notifications` Table
- `id`: Serial primary key
- `student_id`: References students
- `assignment_id`: Related assignment (optional)
- `title`: Notification title
- `message`: Notification content
- `type`: assignment, grade, attendance, announcement
- `is_read`: Boolean flag
- `created_at`: Timestamp

## 🎯 Features Implemented

### AI Assistant Improvements

All dashboards now have full AI assistant functionality:

✅ **Teacher Dashboard** (`/dashboard/assistant`)
- Full ChatFullPage component with voice integration
- Access to all dashboard data
- Performance analytics
- Multi-language voice support

✅ **Student Dashboard** (`/student/assistant`)
- Already using ChatFullPage
- Enhanced UI with modern gradients
- Voice interface with 12+ languages
- Real-time dashboard context

✅ **Dean Dashboard** (`/dean/assistant`)
- New AI assistant page created
- Same full functionality as other dashboards
- Administrative context and insights

### UI Enhancements

✅ **Modern Chat Interface**
- Beautiful gradient headers (blue to cyan)
- Improved message bubbles with shadows
- Better spacing and typography
- Smooth animations on message appearance
- Enhanced loading states with pulse effects

✅ **Voice Integration**
- Multi-language voice support (12+ languages)
- Live transcript overlay
- Subtitle-style display
- Language persistence

✅ **Performance Tracking**
- Toggleable performance view
- Real-time analytics
- Context-aware insights

## 🚀 Next Steps

1. **Run the migration** as described in Step 1-3
2. **Test assignment creation** from teacher dashboard
3. **Verify notifications** are created for students
4. **Test AI assistant** on all three dashboards
5. **Test voice features** in different languages

## 📝 Notes

- The AI assistant uses the `/api/ai-chat` endpoint which provides intelligent, context-aware responses
- All data is pulled from real dashboard context (attendance, assignments, grades)
- Voice features work best in Chrome/Edge browsers
- Storage files are automatically signed with 1-hour expiry for security

## 🆘 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify all migration steps were completed
3. Ensure your user has the correct role (teacher/student/dean)
4. Check Supabase logs for database errors
