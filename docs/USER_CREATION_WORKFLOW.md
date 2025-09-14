# User Creation Workflow Guide

## Quick Start for Administrators

### 🎯 **Dean Setup (First Time)**

1. **Initial Dean Account Creation**
   ```sql
   -- Run this SQL to create the first dean account
   INSERT INTO auth.users (
     id, email, encrypted_password, email_confirmed_at,
     raw_user_meta_data, created_at, updated_at
   ) VALUES (
     gen_random_uuid(),
     'dean@yourschool.edu',
     crypt('YourSecurePassword123!', gen_salt('bf')),
     NOW(),
     '{"role": "dean", "displayName": "Dean Name", "full_name": "Dean Name"}'::jsonb,
     NOW(),
     NOW()
   );
   ```

2. **Login as Dean**
   - Navigate to `/login`
   - Use dean credentials
   - Redirected to `/dean/dashboard`

3. **Create Teacher Accounts**
   - Use "User Management" card
   - Click "Create New User"
   - Select role: "Teacher"
   - Provide credentials to teachers

### 👨‍🏫 **Teacher Workflow**

1. **Login with Dean-provided Credentials**
   - Navigate to `/login`
   - Use provided email/password
   - Redirected to `/dashboard` (teacher dashboard)

2. **Create Student Accounts**
   - Use "User Management" section
   - Click "Create New User"
   - Role automatically set to "Student"
   - Provide credentials to students

### 👨‍🎓 **Student Workflow**

1. **Login with Teacher-provided Credentials**
   - Navigate to `/login`
   - Use provided email/password
   - Redirected to `/student/dashboard`

2. **Attend Classes**
   - Use PIN attendance feature
   - View attendance history
   - Update profile information

## Step-by-Step Guides

### Creating Teacher Accounts (Dean)

1. **Access Dean Dashboard**
   ```
   URL: /dean/dashboard
   Required: Dean role authentication
   ```

2. **Open User Management**
   - Locate "User Management" card
   - Click "Create New User" button

3. **Fill Teacher Information**
   ```
   Full Name: [Teacher's Full Name]
   Email: [teacher@yourschool.edu]
   Role: Select "Teacher"
   Password: [Strong password meeting requirements]
   Confirm Password: [Same password]
   ```

4. **Submit and Share Credentials**
   - Click "Create User"
   - Wait for success confirmation
   - Securely share credentials with teacher

### Creating Student Accounts (Teacher)

1. **Access Teacher Dashboard**
   ```
   URL: /dashboard
   Required: Teacher role authentication
   ```

2. **Open User Management**
   - Scroll to "User Management" section
   - Click "Create New User" button

3. **Fill Student Information**
   ```
   Full Name: [Student's Full Name]
   Email: [student@yourschool.edu]
   Role: Automatically set to "Student"
   Password: [Strong password or generated]
   Confirm Password: [Same password]
   ```

4. **Submit and Share Credentials**
   - Click "Create User"
   - Wait for success confirmation
   - Share credentials with student securely

## Password Requirements

All user accounts must have passwords meeting these criteria:

- ✅ **Minimum 6 characters**
- ✅ **At least one uppercase letter** (A-Z)
- ✅ **At least one lowercase letter** (a-z)
- ✅ **At least one number** (0-9)
- ✅ **At least one special character** (!@#$%^&*)

### Example Strong Passwords
- `EduTrack2024!`
- `School@123`
- `Student#Pass1`

## Role Permissions Matrix

| Action | Dean | Teacher | Student |
|--------|------|---------|---------|
| Create Dean | ✅ | ❌ | ❌ |
| Create Teacher | ✅ | ❌ | ❌ |
| Create Student | ✅ | ✅ | ❌ |
| Delete Users | ✅ | ❌ | ❌ |
| View All Users | ✅ | ❌ | ❌ |
| Manage Sessions | ✅ | ✅ | ❌ |
| Take Attendance | ❌ | ❌ | ✅ |

## Best Practices

### 🔐 **Security**
- Generate strong passwords for all accounts
- Use institutional email addresses
- Regularly rotate dean passwords
- Monitor failed login attempts

### 📋 **Organization**
- Follow consistent naming conventions
- Use department-based email prefixes
- Document all created accounts
- Regular audit of active users

### 🚀 **Onboarding**
- Provide credentials securely (not via email)
- Include login instructions
- Demonstrate dashboard features
- Set up attendance sessions immediately

## Common Workflows

### 🏫 **New Semester Setup**

1. **Dean creates teacher accounts** for new faculty
2. **Teachers create student accounts** for enrolled students
3. **Teachers set up attendance sessions** for their courses
4. **Students receive credentials** and login instructions

### 📚 **Mid-Semester Student Addition**

1. **Teacher identifies new student** enrollment
2. **Teacher creates student account** via dashboard
3. **Teacher adds student to existing sessions**
4. **Student receives credentials** and catches up on attendance

### 🔄 **Role Changes**

1. **Dean promotes teacher to dean**:
   - Create new dean account
   - Deactivate old teacher account
   - Transfer ownership of sessions

2. **Student becomes teacher** (rare):
   - Dean creates new teacher account
   - Student account remains for historical data

## Troubleshooting Common Issues

### ❌ **"Teachers can only create student accounts"**
**Cause:** Teacher trying to create teacher/dean account
**Solution:** Only deans can create teacher/dean accounts

### ❌ **"Invalid email address"**
**Cause:** Email format validation failed
**Solution:** Use proper email format (user@domain.com)

### ❌ **"Password doesn't match"**
**Cause:** Password and confirm password fields differ
**Solution:** Ensure both password fields are identical

### ❌ **"Must be logged in to create users"**
**Cause:** Session expired or not authenticated
**Solution:** Login again and retry

### ❌ **"Failed to create user account"**
**Cause:** Database connection or permission issue
**Solution:** Check system status, contact technical support

## Support Contacts

- **Technical Issues**: IT Department
- **Account Access**: Dean's Office  
- **Training Requests**: Academic Affairs
- **System Status**: Check `/dean/dashboard` system overview