# 🎓 Complete Setup Guide - ClassroomAI

## 📋 Overview

This guide will help you set up the complete ClassroomAI system with:
- ✅ **Student Notifications** - Real-time notifications for assignments and timetable
- ✅ **Assignment Submissions** - Students can submit assignments with files
- ✅ **Timetable Management** - Teachers/Deans create schedules
- ✅ **Live Timetable View** - Students see real-time schedule updates
- ✅ **Auto Notifications** - 30-minute class reminders

---

## 🚀 Quick Setup (15 minutes)

### Step 1: Run Database Migrations (5 min)

Go to **Supabase Dashboard** → **SQL Editor** and run these two migrations:

#### 1.1 Assignments Migration
```sql
-- Copy entire content from: migrations/014_create_assignments_table.sql
-- This creates: assignments, assignment_submissions, student_notifications tables
```

#### 1.2 Timetable Migration
```sql
-- Copy entire content from: migrations/015_create_timetable_system.sql
-- This creates: timetables, timetable_students, timetable_notifications tables
```

### Step 2: Create Storage Bucket (2 min)

**Supabase Dashboard** → **Storage** → **New Bucket**
- Name: `assignments`
- Public: ❌ (Keep private)
- Click **Create Bucket**

### Step 3: Add Storage Policies (3 min)

In **SQL Editor**, run:

```sql
-- Teachers upload assignment files
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

-- Authenticated users view files
CREATE POLICY "Authenticated users view assignment files"
ON storage.objects FOR SELECT
USING (bucket_id = 'assignments' AND auth.role() = 'authenticated');

-- Students upload submission files
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

### Step 4: Set Up Automated Notifications (5 min)

#### 4.1 Enable pg_cron Extension
```sql
-- In Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

#### 4.2 Create Cron Job for Notifications
```sql
-- Send timetable notifications every 5 minutes
SELECT cron.schedule(
    'send-timetable-notifications',
    '*/5 * * * *', -- Every 5 minutes
    $$SELECT send_due_timetable_notifications()$$
);

-- Create class notifications daily at midnight
SELECT cron.schedule(
    'create-class-notifications',
    '0 0 * * *', -- Daily at midnight
    $$SELECT create_class_notifications()$$
);
```

---

## 📱 Component Integration

### For Student Dashboard

Add these components to your student dashboard:

```tsx
// src/app/[locale]/student/dashboard/page.tsx
import StudentNotifications from '@/components/student-notifications';
import StudentAssignments from '@/components/student-assignments';
import StudentTimetableView from '@/components/student-timetable-view';

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      {/* Add notifications */}
      <StudentNotifications variant="full" maxHeight="400px" />
      
      {/* Add assignments */}
      <StudentAssignments />
      
      {/* Add timetable */}
      <StudentTimetableView />
    </div>
  );
}
```

### For Teacher Dashboard

Add timetable management to teacher dashboard:

```tsx
// Create: src/app/[locale]/(dashboard)/dashboard/timetable/page.tsx
import TimetableManagement from '@/components/timetable-management';

export default function TimetablePage() {
  return <TimetableManagement />;
}
```

### For Dean Dashboard

Add timetable management to dean dashboard:

```tsx
// Create: src/app/[locale]/dean/timetable/page.tsx
import TimetableManagement from '@/components/timetable-management';

export default function DeanTimetablePage() {
  return <TimetableManagement />;
}
```

---

## 🎯 Features Overview

### 1. Student Notifications 🔔

**What it does:**
- Shows real-time notifications for new assignments
- Displays timetable updates and class reminders
- Auto-refresh with live subscriptions
- Toast notifications for new items
- Mark as read/unread functionality

**How it works:**
- Teacher creates assignment → Notification auto-created
- Timetable reminder due → Notification sent
- Student sees notification → Can mark as read
- Real-time updates via Supabase subscriptions

**Usage:**
```tsx
<StudentNotifications 
  variant="full"  // or "compact" for header
  maxHeight="400px" 
/>
```

### 2. Assignment Submissions 📝

**What it does:**
- View all assignments (pending/submitted)
- Submit text responses and file attachments
- Track submission status (submitted/graded/late)
- View grades and teacher feedback
- Download assignment files

**Features:**
- **Pending Tab**: Assignments not yet submitted
- **Submitted Tab**: All submissions with status
- **File Support**: Upload any file type
- **Real-time Updates**: Auto-refresh on changes

**Student Workflow:**
1. See new assignment notification
2. View assignment details and download files
3. Write response and/or attach file
4. Submit assignment
5. Check submission status later
6. View grade and feedback when graded

### 3. Timetable Management 📅

**What it does:**
- Create weekly class schedule
- Assign subjects and rooms
- Set recurring classes
- Auto-enroll students
- Send reminders to students

**Features:**
- **Visual Grid**: See schedule by day
- **Time Slots**: Set start/end times
- **Resources**: Link subjects and rooms
- **Notifications**: Auto-create 30-min reminders
- **Real-time Sync**: Updates reflect immediately

**Teacher Workflow:**
1. Click "Add Class"
2. Fill in details (title, subject, room, time)
3. Select day of week
4. Save → Students auto-enrolled
5. Notifications created automatically

### 4. Student Timetable View 📱

**What it does:**
- View complete weekly schedule
- See today's classes highlighted
- Live indicator for current class
- "Soon" badge for upcoming classes
- Real-time updates from teachers

**Features:**
- **Today Card**: Shows current day schedule
- **Weekly Grid**: All days at a glance
- **Live Updates**: Changes reflect instantly
- **Current Class**: Green highlight when class is live
- **Upcoming**: Orange badge 60 min before
- **Auto-Refresh**: Updates every minute

**Student Experience:**
- Opens dashboard → Sees today's schedule
- Current class highlighted in green
- Gets notification 30 min before class
- Teacher updates timetable → Sees toast notification
- Always has latest schedule

---

## 🔧 Advanced Configuration

### Notification Timing

Modify notification timing in SQL:

```sql
-- Change to 15 minutes before class
CREATE OR REPLACE FUNCTION create_class_notifications()
RETURNS void AS $$
BEGIN
    -- Change '30 minutes' to '15 minutes'
    notification_time := class_datetime - '15 minutes'::INTERVAL;
    -- Rest of function...
END;
$$ LANGUAGE plpgsql;
```

### Auto-Enrollment

By default, all students are enrolled in new timetable entries. To change:

```tsx
// In timetable-management.tsx, comment out auto-enrollment:
/*
const { data: students } = await (supabase as any)
  .from('students')
  .select('id');
// ... enrollment logic
*/
```

### Notification Frequency

Change cron job frequency:

```sql
-- Every minute (more frequent)
SELECT cron.schedule('send-timetable-notifications', '* * * * *', ...);

-- Every 15 minutes (less frequent)
SELECT cron.schedule('send-timetable-notifications', '*/15 * * * *', ...);
```

---

## 📊 Database Schema Reference

### student_notifications
```sql
- id: SERIAL PRIMARY KEY
- student_id: TEXT (references students)
- assignment_id: TEXT (references assignments, nullable)
- title: TEXT
- message: TEXT
- type: TEXT (assignment, grade, attendance, announcement, timetable)
- is_read: BOOLEAN
- created_at: TIMESTAMPTZ
```

### assignments
```sql
- id: TEXT PRIMARY KEY
- title: TEXT
- description: TEXT
- due_date: TIMESTAMPTZ
- subject_id: TEXT
- created_by: TEXT
- file_url, file_type, file_path: TEXT
- status: TEXT (active, archived, draft)
- max_score: INTEGER (default 100)
- created_at, updated_at: TIMESTAMPTZ
```

### assignment_submissions
```sql
- id: TEXT PRIMARY KEY
- assignment_id: TEXT (references assignments)
- student_id: TEXT (references students)
- submission_text: TEXT
- file_url, file_type, file_path: TEXT
- status: TEXT (submitted, graded, late, missing)
- score: INTEGER
- feedback: TEXT
- submitted_at, graded_at: TIMESTAMPTZ
```

### timetables
```sql
- id: TEXT PRIMARY KEY
- title: TEXT
- subject_id, room_id, teacher_id: Foreign keys
- day_of_week: INTEGER (0-6, Sunday-Saturday)
- start_time, end_time: TIME
- description: TEXT
- is_active: BOOLEAN
- academic_year, semester: TEXT
- created_by: TEXT
- created_at, updated_at: TIMESTAMPTZ
```

### timetable_students
```sql
- id: SERIAL PRIMARY KEY
- timetable_id: TEXT (references timetables)
- student_id: TEXT (references students)
- enrolled_at: TIMESTAMPTZ
- UNIQUE(timetable_id, student_id)
```

### timetable_notifications
```sql
- id: SERIAL PRIMARY KEY
- timetable_id: TEXT (references timetables)
- student_id: TEXT (references students)
- notification_time: TIMESTAMPTZ (when to send)
- title, message: TEXT
- is_sent: BOOLEAN
- sent_at: TIMESTAMPTZ
- created_at: TIMESTAMPTZ
```

---

## 🧪 Testing Guide

### Test 1: Assignment Flow
1. **Teacher**: Create assignment with file
2. **Verify**: Check terminal for "Students notified"
3. **Student**: Login → See notification
4. **Student**: Go to assignments → See pending assignment
5. **Student**: Submit with text and file
6. **Verify**: Submission appears in "Submitted" tab

### Test 2: Timetable Flow
1. **Teacher**: Create timetable entry for today
2. **Verify**: Check notifications were created (SQL query)
3. **Student**: Login → See timetable on dashboard
4. **Verify**: Today's classes highlighted
5. **Wait**: For class time → See "Live" badge

### Test 3: Real-time Updates
1. **Student**: Open dashboard
2. **Teacher**: Create new assignment
3. **Student**: Should see toast notification
4. **Student**: Notification appears without refresh

### Test 4: Notification System
1. **Teacher**: Create class for tomorrow at 10 AM
2. **Run**: `SELECT send_due_timetable_notifications();`
3. **Student**: Check notifications at 9:30 AM tomorrow
4. **Verify**: Receives 30-minute reminder

---

## 🐛 Troubleshooting

### Notifications Not Showing
**Problem**: Student doesn't see notifications

**Solutions**:
1. Check student record exists:
```sql
SELECT * FROM students WHERE auth_user_id = 'USER_AUTH_ID';
```

2. Check notifications were created:
```sql
SELECT * FROM student_notifications 
WHERE student_id = 'STUDENT_ID'
ORDER BY created_at DESC;
```

3. Check real-time subscription in browser console

### Assignment Submission Fails
**Problem**: Error when submitting assignment

**Solutions**:
1. Verify storage bucket exists and policies are set
2. Check file size (default limit: 50MB)
3. Check browser console for detailed error
4. Verify student_id in submissions table matches students table

### Timetable Not Updating
**Problem**: Changes don't appear for students

**Solutions**:
1. Check `is_active` flag on timetable entry
2. Verify student enrollment:
```sql
SELECT * FROM timetable_students 
WHERE student_id = 'STUDENT_ID';
```

3. Check real-time subscription is active
4. Hard refresh browser (Ctrl+Shift+R)

### Cron Jobs Not Running
**Problem**: Notifications not sent automatically

**Solutions**:
1. Verify pg_cron extension installed:
```sql
SELECT * FROM pg_extension WHERE extname = 'pg_cron';
```

2. Check cron jobs:
```sql
SELECT * FROM cron.job;
```

3. Manually test functions:
```sql
SELECT create_class_notifications();
SELECT send_due_timetable_notifications();
```

---

## 📈 Performance Tips

1. **Index Optimization**: Already created in migrations
2. **Query Limits**: Set appropriate limits on data fetching
3. **Real-time Channels**: Close subscriptions on unmount
4. **File Sizes**: Limit attachment sizes in UI
5. **Caching**: Use React Query for data caching (optional)

---

## 🎨 UI Customization

### Change Gradient Colors
```tsx
// Current: from-blue-500 to-cyan-500
// Change to your brand colors:
className="bg-gradient-to-r from-purple-500 to-pink-500"
```

### Modify Notification Display Time
```tsx
// In student-notifications.tsx
toast({
  duration: 5000, // Change to 3000 for 3 seconds
});
```

### Adjust Timetable Grid
```tsx
// In student-timetable-view.tsx
// Current: 3 columns on xl screens
className="grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
// Change to 4 columns:
className="grid-cols-1 lg:grid-cols-2 xl:grid-cols-4"
```

---

## ✅ Success Checklist

- [ ] Ran both database migrations
- [ ] Created assignments storage bucket
- [ ] Added storage policies
- [ ] Set up pg_cron extension
- [ ] Created cron jobs for notifications
- [ ] Added StudentNotifications component
- [ ] Added StudentAssignments component
- [ ] Added StudentTimetableView component
- [ ] Added TimetableManagement for teacher/dean
- [ ] Tested assignment creation and submission
- [ ] Tested timetable creation and viewing
- [ ] Verified real-time updates working
- [ ] Tested notification system

---

## 🆘 Support

If you encounter issues:
1. Check browser console for errors
2. Check Supabase logs in dashboard
3. Verify all migrations ran successfully
4. Test database functions manually
5. Review troubleshooting section above

---

**Congratulations! 🎉** Your ClassroomAI now has complete assignment submission, timetable management, and notification systems!
