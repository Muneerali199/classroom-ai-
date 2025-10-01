# 🚀 Integration Checklist - Quick Reference

## ⚡ 3-Step Integration

### Step 1: Run Database Setup (5 min)

**Supabase Dashboard → SQL Editor:**

```sql
-- 1. Run timetable migration
-- Copy and paste: migrations/015_create_timetable_system.sql

-- 2. Enable cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 3. Schedule notifications
SELECT cron.schedule(
    'send-timetable-notifications', '*/5 * * * *',
    $$SELECT send_due_timetable_notifications()$$
);

SELECT cron.schedule(
    'create-class-notifications', '0 0 * * *',
    $$SELECT create_class_notifications()$$
);
```

### Step 2: Add to Student Dashboard (2 min)

**Edit:** `src/app/[locale]/student/dashboard/page.tsx`

```tsx
import StudentNotifications from '@/components/student-notifications';
import StudentAssignments from '@/components/student-assignments';
import StudentTimetableView from '@/components/student-timetable-view';

export default function StudentDashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Notifications at top */}
      <StudentNotifications variant="full" maxHeight="400px" />
      
      {/* Assignments section */}
      <StudentAssignments />
      
      {/* Timetable section */}
      <StudentTimetableView />
    </div>
  );
}
```

### Step 3: Add Timetable Management (2 min)

**Create:** `src/app/[locale]/(dashboard)/dashboard/timetable/page.tsx`

```tsx
import TimetableManagement from '@/components/timetable-management';

export default function TimetablePage() {
  return <TimetableManagement />;
}
```

**Create:** `src/app/[locale]/dean/timetable/page.tsx`

```tsx
import TimetableManagement from '@/components/timetable-management';

export default function DeanTimetablePage() {
  return <TimetableManagement />;
}
```

---

## ✅ Verification Tests

### Test 1: Notifications
1. Login as **Teacher**
2. Create assignment
3. Login as **Student**
4. See notification appear ✓
5. Click to mark as read ✓

### Test 2: Assignments
1. Login as **Student**
2. Go to assignments page
3. See assignment in "Pending" ✓
4. Submit with text/file ✓
5. Check "Submitted" tab ✓

### Test 3: Timetable
1. Login as **Teacher**
2. Go to `/dashboard/timetable`
3. Create class for today ✓
4. Login as **Student**
5. See class in timetable ✓
6. Verify "Today" badge ✓

---

## 📁 File Locations

### Components Created:
```
src/components/
├── student-notifications.tsx      ✅ Real-time notifications
├── student-assignments.tsx        ✅ Assignment submissions
├── student-timetable-view.tsx     ✅ Live timetable view
└── timetable-management.tsx       ✅ Teacher/Dean scheduler
```

### Migrations:
```
migrations/
├── 014_create_assignments_table.sql   ✅ Already run
└── 015_create_timetable_system.sql    🔥 RUN THIS NOW
```

### Documentation:
```
├── COMPLETE_SETUP_GUIDE.md           📖 Detailed guide
├── FINAL_FEATURES_SUMMARY.md         📖 Features overview
├── QUICK_START.md                    📖 Fast setup
└── INTEGRATION_CHECKLIST.md          📖 This file
```

---

## 🎯 Component Props Reference

### StudentNotifications
```tsx
<StudentNotifications 
  variant="full"        // or "compact" for header icon
  maxHeight="400px"     // scroll height
/>
```

### StudentAssignments
```tsx
<StudentAssignments />  // No props needed
```

### StudentTimetableView
```tsx
<StudentTimetableView />  // No props needed
```

### TimetableManagement
```tsx
<TimetableManagement />  // No props needed
```

---

## 🔧 Troubleshooting

### "Table does not exist"
```sql
-- Verify tables exist:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('timetables', 'timetable_students', 'timetable_notifications');
```

### "No notifications showing"
```sql
-- Check if notifications were created:
SELECT * FROM student_notifications ORDER BY created_at DESC LIMIT 10;
```

### "Cron not running"
```sql
-- Verify cron jobs:
SELECT * FROM cron.job;

-- Test manually:
SELECT send_due_timetable_notifications();
SELECT create_class_notifications();
```

---

## 📊 Database Tables Overview

```
student_notifications          ← New notifications display here
├── type: 'assignment'         ← From teacher creating assignment
├── type: 'timetable'          ← From class reminders
└── type: 'grade', 'attendance', 'announcement'

timetables                     ← Teacher creates schedule
├── Auto-enrolls students
└── Auto-creates notifications

timetable_students             ← Who's in which class
└── Linked to student dashboard

timetable_notifications        ← Pending reminders
├── Created 30 min before class
└── Sent via cron job
```

---

## 🎨 UI Features

### Notifications:
- 🔴 Red badge for unread count
- 🔵 Blue/cyan gradients
- ✅ Mark as read
- 🗑️ Delete individual
- 📊 Categorized by type
- 🔄 Real-time updates

### Assignments:
- 📋 Two-tab interface (Pending/Submitted)
- 📎 File upload support
- ⏰ Due date warnings
- ✅ Status badges
- ⭐ Grade display
- 💬 Teacher feedback

### Timetable:
- 📅 Weekly grid view
- 🟢 "Live" for current class
- 🟠 "Soon" for upcoming (60 min)
- 🔵 "Today" badge
- 📍 Room and subject info
- 🔄 Auto-refresh every minute

---

## 🚦 Status Colors

```
Green (Live)       = Class happening now
Orange (Soon)      = Class in next 60 min
Blue (Today)       = Today's classes
Red (Overdue)      = Past due assignments
Gray (Inactive)    = No classes scheduled
```

---

## ⚙️ Customization

### Change notification timing:
```sql
-- In migration file, change '30 minutes' to '15 minutes':
notification_time := class_datetime - '15 minutes'::INTERVAL;
```

### Change cron frequency:
```sql
-- More frequent (every minute):
SELECT cron.schedule('...', '* * * * *', ...);

-- Less frequent (every hour):
SELECT cron.schedule('...', '0 * * * *', ...);
```

### Modify colors:
```tsx
// Change from blue-cyan to purple-pink:
className="bg-gradient-to-r from-purple-500 to-pink-500"
```

---

## 📈 Next Steps

After integration:

1. ✅ Test all three features
2. ✅ Verify real-time updates
3. ✅ Check notifications arrive
4. ✅ Test on mobile devices
5. ✅ Review cron job logs
6. 🎉 Launch to users!

---

## 🆘 Quick Links

- **Full Setup:** `COMPLETE_SETUP_GUIDE.md`
- **Features:** `FINAL_FEATURES_SUMMARY.md`
- **Database:** `migrations/015_create_timetable_system.sql`
- **Components:** `src/components/student-*.tsx`

---

**Total Integration Time: ~10 minutes** ⚡

Everything is ready to go! Just follow the 3 steps above and you're done! 🚀
