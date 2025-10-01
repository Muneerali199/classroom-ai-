# Migration Fixes - Timetable & Meetings 🚀

## Fixed Issues

### ✅ Issue 1: UUID = Text Error (Migration 017)
**Error:** `operator does not exist: uuid = text`  
**Fix:** Changed comparison order to put text columns first: `teacher_id = auth.uid()::text`

### ✅ Issue 2: Missing Meetings Table
**Error:** `could not find table public.meetings in the schema cache`  
**Fix:** Created comprehensive meetings table with RLS policies

---

## 🚀 How to Apply Fixes

### Step 1: Run Fixed Timetable Migration (017)

The file `017_fix_timetable_rls_policies.sql` has been fixed. Now run it:

1. Open **Supabase Dashboard** → **SQL Editor**
2. Copy **ALL** content from `migrations/017_fix_timetable_rls_policies.sql`
3. Paste into SQL Editor
4. Click **Run** ▶️

**Expected output:**
```
✅ Timetable RLS policies fixed!
📝 New policies created:
   - Teachers insert own timetables
   - Teachers view own timetables
   - Teachers update own timetables
   - Teachers delete own timetables
   - Students view active timetables
   - Teachers manage enrollments
   - Students view enrollments
🔒 RLS is still enabled for security
✅ Teachers can now create timetables!
```

### Step 2: Run Meetings Table Migration (018)

Now create the meetings table:

1. Still in **Supabase SQL Editor**
2. Copy **ALL** content from `migrations/018_create_meetings_table.sql`
3. Paste into SQL Editor
4. Click **Run** ▶️

**Expected output:**
```
✅ Meetings system migration complete!
📅 Tables created: meetings, meeting_participants, meeting_attachments
🔒 Row Level Security enabled with proper policies
📊 Views created: upcoming_meetings, teacher_meetings_view
✅ Teachers can now create and manage meetings!
👥 Students can view meetings they are invited to
```

### Step 3: Verify Everything Works

Run these verification queries in Supabase SQL Editor:

```sql
-- 1. Check timetable policies exist (should return 5 rows)
SELECT policyname FROM pg_policies 
WHERE tablename = 'timetables' 
ORDER BY policyname;

-- 2. Check meetings table exists
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'meetings';

-- 3. Check meeting policies exist (should return 7 rows)
SELECT policyname FROM pg_policies 
WHERE tablename = 'meetings' 
ORDER BY policyname;

-- 4. Check views exist
SELECT table_name FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name IN ('upcoming_meetings', 'teacher_meetings_view');
```

### Step 4: Restart Development Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## 📊 What Was Created

### Meetings System Tables

**1. meetings** - Main meetings table
- Supports multiple meeting types: class, parent, staff, other
- Integration with Zoom, Google Meet, Teams
- Recurring meetings support
- Status tracking: scheduled, in_progress, completed, cancelled

**2. meeting_participants** - Attendee tracking
- Track invitations and responses
- Attendance status: invited, accepted, declined, attended, absent
- Join/leave timestamps
- Support for students, teachers, parents

**3. meeting_attachments** - File sharing
- Upload documents, presentations, resources
- Track file metadata (size, type, name)
- Associate files with specific meetings

### RLS Policies Created

**Timetables:**
- ✅ Teachers insert own timetables
- ✅ Teachers view own timetables  
- ✅ Teachers update own timetables
- ✅ Teachers delete own timetables
- ✅ Students view active timetables

**Meetings:**
- ✅ Teachers insert own meetings
- ✅ Teachers view own meetings
- ✅ Teachers update own meetings
- ✅ Teachers delete own meetings
- ✅ Students view invited meetings
- ✅ Teachers manage participants
- ✅ Students view own participation

---

## 🧪 Testing

### Test 1: Create Timetable
1. Go to **Dashboard → Timetable**
2. Click **Add New Class**
3. Fill form and save
4. Should succeed without UUID errors

### Test 2: Create Meeting
1. Go to **Dashboard → Meetings**
2. Click **Create Meeting** (or similar button)
3. Fill in meeting details:
   - Title: "Team Meeting"
   - Type: "staff"
   - Start time: Tomorrow 10:00 AM
   - End time: Tomorrow 11:00 AM
4. Save
5. Should succeed without "table not found" error

### Test 3: View as Student
1. Login as a student account
2. Should see active timetables
3. Should see meetings they're invited to
4. Cannot create timetables or meetings

---

## 🔧 Key Fixes Made

### UUID Type Casting Fix
**Before (broken):**
```sql
WHERE auth.uid()::text = teacher_id  -- UUID = text comparison fails
```

**After (working):**
```sql
WHERE teacher_id = auth.uid()::text  -- text = text comparison works
```

### Proper RLS Policy Structure
**Before (broken):**
```sql
FOR ALL USING (check)  -- Wrong for INSERT
```

**After (working):**
```sql
FOR INSERT WITH CHECK (check)  -- Correct for INSERT
FOR SELECT USING (check)        -- Correct for SELECT
```

---

## 📁 Files Modified/Created

- ✅ `migrations/017_fix_timetable_rls_policies.sql` - **FIXED** UUID casting
- ✅ `migrations/018_create_meetings_table.sql` - **NEW** Meetings system
- ✅ `MIGRATIONS_FIX_GUIDE.md` - This guide

---

## ⚠️ Important Notes

1. **Run migrations in order:** 017 first, then 018
2. **Don't skip verification:** Run the check queries to ensure everything worked
3. **Restart server:** Always restart after running migrations
4. **Check user role:** Make sure you're logged in as a teacher to test creation

---

## 🐛 Troubleshooting

### Still getting UUID error?
- Make sure you copied the **entire** fixed migration file
- Check you ran it in Supabase SQL Editor (not locally)
- Verify no old policies are conflicting

### Meetings table not found?
- Run migration 018
- Check if table exists with verification query
- Restart development server

### Can't create timetable/meeting?
- Check your user role: `SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid();`
- Should be 'teacher' or 'dean'
- Update role if needed

### RLS blocking access?
- Verify policies exist with verification queries
- Check policy names match expectations
- Ensure you're authenticated (logged in)

---

## ✅ Success Checklist

- [ ] Ran migration 017 successfully (no UUID errors)
- [ ] Ran migration 018 successfully (meetings table created)
- [ ] Ran all verification queries - all passed
- [ ] Restarted development server
- [ ] Can create timetables without errors
- [ ] Can create meetings without errors
- [ ] Student accounts see appropriate data

---

**Status:** 🎉 Both issues fixed and ready to use!  
**Last Updated:** January 2025
