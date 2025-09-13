# QR Code Attendance - End-to-End Test Plan

## Test Environment Setup

### 1. Prerequisites
- [x] Database migration applied (teacher_name column)
- [x] Permission errors fixed
- [x] Application builds successfully
- [ ] Test user accounts created

### 2. Test User Accounts Needed
Create these test accounts in your Supabase Auth:

**Teacher Account:**
- Email: `teacher@test.com`
- Password: `TestPassword123!`
- Role: `teacher` (in user_metadata)
- Display Name: `Dr. Test Teacher`

**Student Account:**
- Email: `student@test.com` 
- Password: `TestPassword123!`
- Role: `student` (in user_metadata)
- Display Name: `Test Student`

## End-to-End Test Scenarios

### Test 1: Teacher QR Session Creation
**Objective:** Verify teachers can create QR attendance sessions

**Steps:**
1. Login as teacher account
2. Navigate to Dashboard
3. Click "QR Code" tab
4. Set session duration (e.g., 10 minutes)
5. Click "Create New Session"

**Expected Results:**
- ✅ No permission denied errors
- ✅ QR code generates successfully
- ✅ Session shows as active
- ✅ Live attendance panel appears
- ✅ Session end time displays correctly

**Failure Indicators:**
- ❌ Permission denied error
- ❌ QR code fails to generate
- ❌ Console errors in browser

### Test 2: Non-Teacher Restriction
**Objective:** Verify non-teachers cannot create QR sessions

**Steps:**
1. Login as student account
2. Navigate to Dashboard (should redirect to student dashboard)
3. Try to access teacher dashboard at `/dashboard`

**Expected Results:**
- ✅ Student redirected to `/student/dashboard`
- ✅ No access to QR creation interface
- ✅ Proper role-based navigation

### Test 3: Student QR Scanning with Teacher Popup
**Objective:** Verify student scanning shows teacher information

**Steps:**
1. Create QR session as teacher (from Test 1)
2. Copy/save the QR code image
3. Login as student account
4. Navigate to Student → Scan QR
5. Click "Start Scanning"
6. Present QR code to camera/upload image

**Expected Results:**
- ✅ QR scanner opens successfully
- ✅ QR code is recognized
- ✅ Teacher information popup appears showing:
  - Teacher name: "Dr. Test Teacher"
  - Course: "CMPT-101"
  - Session end time
- ✅ "Mark Attendance" and "Cancel" buttons work
- ✅ After confirming, attendance is marked
- ✅ Success message displays

### Test 4: Live Attendance Tracking
**Objective:** Verify real-time attendance updates

**Steps:**
1. Keep teacher dashboard open (from Test 1)
2. Complete student scanning (from Test 3)
3. Check Live Attendance panel on teacher dashboard

**Expected Results:**
- ✅ Student appears in attendance list
- ✅ Timestamp shows correctly
- ✅ Student count updates (1/X students present)
- ✅ Updates happen in real-time (within 5 seconds)

### Test 5: Session Expiration
**Objective:** Verify expired sessions are handled properly

**Steps:**
1. Create QR session with 1-minute duration
2. Wait for session to expire
3. Try to scan QR code as student

**Expected Results:**
- ✅ Error message: "This attendance session has expired"
- ✅ Attendance not marked for expired session
- ✅ Teacher dashboard shows session as ended

### Test 6: Duplicate Attendance Prevention
**Objective:** Verify students can't mark attendance twice

**Steps:**
1. Complete successful attendance marking (Test 3)
2. Try to scan the same QR code again

**Expected Results:**
- ✅ Error message: "You've already marked your attendance for this session"
- ✅ No duplicate records created

### Test 7: Invalid QR Code Handling
**Objective:** Verify proper error handling for invalid QR codes

**Steps:**
1. Create fake QR code with invalid data
2. Try to scan it as student

**Expected Results:**
- ✅ Error message: "Invalid QR code format"
- ✅ No attendance marked
- ✅ Clear error display to user

## Performance Tests

### Test 8: Multiple Students Scanning
**Objective:** Test concurrent attendance marking

**Steps:**
1. Create QR session as teacher
2. Simulate multiple students scanning (if possible with multiple devices/accounts)

**Expected Results:**
- ✅ All students can mark attendance
- ✅ Live attendance updates for all
- ✅ No duplicate or missing records
- ✅ System remains responsive

## Database Verification

### Test 9: Data Persistence
**Objective:** Verify data is properly saved to database

**Steps:**
1. Complete full attendance flow
2. Check Supabase database tables:
   - `attendance_sessions` - session record exists
   - `session_attendance_records` - attendance record exists

**Expected Results:**
- ✅ Session saved with teacher_name field
- ✅ Attendance record linked to session
- ✅ Timestamps are accurate
- ✅ All required fields populated

## Error Recovery Tests

### Test 10: Database Connection Issues
**Objective:** Test graceful handling of database issues

**Steps:**
1. Temporarily disconnect from internet
2. Try to create QR session
3. Try to mark attendance

**Expected Results:**
- ✅ Helpful error messages displayed
- ✅ No application crashes
- ✅ Retry mechanisms work when connection restored

---

## Test Execution Checklist

Run through each test and mark results:

- [ ] Test 1: Teacher QR Session Creation
- [ ] Test 2: Non-Teacher Restriction  
- [ ] Test 3: Student QR Scanning with Teacher Popup
- [ ] Test 4: Live Attendance Tracking
- [ ] Test 5: Session Expiration
- [ ] Test 6: Duplicate Attendance Prevention
- [ ] Test 7: Invalid QR Code Handling
- [ ] Test 8: Multiple Students Scanning
- [ ] Test 9: Data Persistence
- [ ] Test 10: Error Recovery

## Reporting Issues

For any failed tests, note:
1. Which test failed
2. Actual vs expected behavior
3. Console errors (if any)
4. Steps to reproduce
5. Browser and device used

---

## Quick Test Commands

```bash
# Start development server
npm run dev

# Check database connection
node scripts/setup-supabase.js

# Build and verify no errors
npm run build
```