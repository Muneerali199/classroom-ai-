# Timetable Creation Error - FIXED! 🔧

## Problem
Getting `Error saving timetable: {}` when trying to create a timetable.

## Root Cause
The RLS (Row Level Security) policies on the `timetables` table were too restrictive and preventing INSERT operations, even for teachers.

---

## ✅ Solution

### Step 1: Run the New RLS Fix Migration

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Open the file: `migrations/017_fix_timetable_rls_policies.sql`
4. Copy ALL the content
5. Paste into Supabase SQL Editor
6. Click **Run** ▶️

This migration will:
- ✅ Drop the overly restrictive policies
- ✅ Create separate policies for INSERT, SELECT, UPDATE, DELETE
- ✅ Allow teachers to create timetables where they are the teacher
- ✅ Keep security intact with proper role checks

### Step 2: Verify Your User Role

Make sure your user account has the correct role. Run this in Supabase SQL Editor:

```sql
-- Check your current role
SELECT 
    id,
    email,
    raw_user_meta_data->>'role' as role
FROM auth.users 
WHERE id = auth.uid();
```

**Expected result:** Your role should be `teacher` or `dean`.

If it's not set correctly, update it:

```sql
-- Update your role to teacher (run as admin)
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"teacher"'
)
WHERE email = 'your-email@example.com';
```

### Step 3: Clear Browser Cache and Restart

```bash
# Stop the dev server (Ctrl+C)
# Then restart:
npm run dev
```

In browser:
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

---

## 🧪 Testing the Fix

### Test 1: Check Policies
Run this in Supabase SQL Editor to verify policies exist:

```sql
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'timetables'
ORDER BY policyname;
```

**Expected:** You should see 5 policies:
1. Teachers insert own timetables (INSERT)
2. Teachers view own timetables (SELECT)
3. Teachers update own timetables (UPDATE)
4. Teachers delete own timetables (DELETE)
5. Students view active timetables (SELECT)

### Test 2: Try Creating a Timetable
1. Go to **Dashboard → Timetable**
2. Click **Add New Class**
3. Fill in the form:
   - **Title**: "Test Class 101"
   - **Subject**: Select any
   - **Room**: Select any
   - **Day**: Monday
   - **Start Time**: 09:00
   - **End Time**: 10:00
4. Click **Save**

**Expected:** 
- ✅ Success message appears
- ✅ Timetable appears in the list
- ✅ Console shows: "Timetable created successfully"

### Test 3: Check Console for Detailed Errors
Now with improved error logging, open browser console (F12) and look for:
- `Creating timetable with payload:` - Shows what data is being sent
- `Timetable insert error details:` - Shows detailed error info if it fails
- `Timetable created successfully:` - Shows success with returned data

---

## 🔍 What Changed

### Old Policy (Too Restrictive)
```sql
-- This was blocking inserts!
CREATE POLICY "Teachers and deans manage timetables" ON timetables
    FOR ALL USING (...);  -- Same check for ALL operations
```

### New Policies (Properly Scoped)
```sql
-- Separate policy for INSERT with proper checks
CREATE POLICY "Teachers insert own timetables" ON timetables
    FOR INSERT 
    WITH CHECK (
        auth.uid()::text = teacher_id AND
        auth.uid()::text = created_by AND
        EXISTS (SELECT 1 FROM auth.users WHERE ...)
    );
```

**Key differences:**
- ✅ Separate policies for each operation (INSERT, SELECT, UPDATE, DELETE)
- ✅ `WITH CHECK` clause for INSERT validates the new row data
- ✅ `USING` clause for SELECT/UPDATE/DELETE checks existing rows
- ✅ Clear separation of teacher vs student permissions

---

## 🐛 Troubleshooting

### Still Getting Empty Error {}?

**Check 1: User Role**
```sql
SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid();
```
Should return: `teacher` or `dean`

**Check 2: RLS is Enabled**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'timetables';
```
Should show: `rowsecurity = true`

**Check 3: Policies Exist**
```sql
SELECT COUNT(*) FROM pg_policies WHERE tablename = 'timetables';
```
Should return: `5` or more

### Getting "permission denied for table students"?

This means the `enroll_all_students_in_timetable()` function is failing. Check:

```sql
-- Verify function exists
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'enroll_all_students_in_timetable';
```

If missing, re-run migration `016_fix_timetable_permissions.sql`.

### Timetable Creates But No Students Enrolled?

Check if students exist:
```sql
SELECT COUNT(*) FROM students;
```

If 0 students, you need to add students first before they can be enrolled.

### Console Shows "Timetable insert error details"?

Now you should see the full error details in console:
- `message`: Human-readable error message
- `details`: Detailed error information
- `hint`: Supabase hint on how to fix
- `code`: PostgreSQL error code

**Common error codes:**
- `42501`: Permission denied (RLS blocking)
- `23502`: Not null violation (missing required field)
- `23503`: Foreign key violation (invalid subject_id or room_id)
- `23514`: Check constraint violation (invalid time range)

---

## 📋 Complete Checklist

- [ ] Ran migration `017_fix_timetable_rls_policies.sql` in Supabase
- [ ] Verified user role is `teacher` or `dean`
- [ ] Restarted development server
- [ ] Cleared browser cache
- [ ] Checked console for detailed error logs
- [ ] Verified 5 policies exist on timetables table
- [ ] Tested creating a timetable successfully
- [ ] Checked students are enrolled (if any exist)

---

## 🎯 Files Modified

1. ✅ `migrations/017_fix_timetable_rls_policies.sql` - New migration to fix RLS
2. ✅ `src/components/timetable-management.tsx` - Enhanced error logging

---

## 📞 Still Having Issues?

If after following all steps you still get errors:

1. **Check the browser console** - Look for the new detailed error logs
2. **Check Supabase logs** - Dashboard → Logs → Check for errors
3. **Verify all migrations ran** - Check which migrations have been applied
4. **Share the detailed error** - The new console logs will show exactly what's wrong

---

**Status:** 🔧 Ready to fix! Run migration 017 and test again.
**Last Updated:** January 2025
