# Authentication System Documentation

## Overview

EduTrack uses a controlled authentication system where account creation is restricted to authorized personnel only. This ensures data security and proper access control within educational institutions.

## User Roles

### 🎓 **Dean**
- **Highest privilege level**
- Can create: Teachers, Students, and other Deans
- Access: Dean Dashboard with full system management
- Dashboard: `/dean/dashboard`

### 👨‍🏫 **Teacher** 
- **Medium privilege level**
- Can create: Students only
- Access: Teacher Dashboard with class management
- Dashboard: `/dashboard`

### 👨‍🎓 **Student**
- **Basic privilege level**  
- Cannot create accounts
- Access: Student Dashboard with attendance tracking
- Dashboard: `/student/dashboard`

## Account Creation Process

### For Deans
1. Login to Dean Dashboard
2. Navigate to "User Management" section
3. Click "Create New User"
4. Fill in user details:
   - Full Name
   - Email Address
   - Role (Teacher/Student/Dean)
   - Password (with complexity requirements)
5. Submit to create account
6. Provide credentials to new user

### For Teachers
1. Login to Teacher Dashboard
2. Navigate to "User Management" section
3. Click "Create New User" 
4. Fill in student details:
   - Full Name
   - Email Address
   - Role (Student only)
   - Password
5. Submit to create student account
6. Provide credentials to student

## Security Features

### Password Requirements
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter  
- At least one number
- At least one special character

### Role-Based Access Control
- Database-level permissions prevent unauthorized account creation
- Frontend validation ensures proper role restrictions
- Server-side function validates creator permissions

### Database Security
- Uses Supabase Row Level Security (RLS)
- Custom database function `create_user_account()` with permission checks
- Audit trail of account creation activities

## API Functions

### `AuthService.createUser(data: CreateUserData)`

Creates a new user account with role-based validation.

**Parameters:**
```typescript
interface CreateUserData {
  email: string
  password: string
  displayName: string
  role: 'teacher' | 'dean' | 'student'
}
```

**Returns:**
```typescript
interface AuthResponse {
  success: boolean
  error?: string
  user?: User
}
```

**Usage:**
```typescript
const result = await AuthService.createUser({
  email: 'student@example.com',
  password: 'SecurePass123!',
  displayName: 'John Doe',
  role: 'student'
});

if (result.success) {
  console.log('User created successfully');
} else {
  console.error('Error:', result.error);
}
```

## Database Function

### `create_user_account()`

Server-side PostgreSQL function that handles user creation with permission validation.

**Parameters:**
- `user_email`: Email address for new user
- `user_password`: Password (will be hashed)  
- `user_display_name`: Full name
- `user_role`: Role (teacher/student/dean)
- `creator_id`: UUID of user creating the account

**Permission Logic:**
- **Dean**: Can create any role
- **Teacher**: Can create students only
- **Others**: Cannot create accounts

## Testing

### Access Control Tests

A testing component is available in development mode to verify role-based permissions:

1. Login as different user types
2. Navigate to Dean Dashboard  
3. Use "User Management Access Control Tests"
4. Verify expected behavior:
   - Dean can create all roles
   - Teacher can create students only
   - Proper error messages for unauthorized attempts

### Test Scenarios

| Creator Role | Target Role | Expected Result |
|--------------|-------------|-----------------|
| Dean | Teacher | ✅ Success |
| Dean | Student | ✅ Success |  
| Dean | Dean | ✅ Success |
| Teacher | Student | ✅ Success |
| Teacher | Teacher | ❌ Blocked |
| Teacher | Dean | ❌ Blocked |
| Student | Any | ❌ Blocked |

## Migration Guide

If upgrading from the previous signup system:

1. Run database migration: `migrations/005_update_auth_system.sql`
2. Existing admin users will be automatically converted to dean role
3. Remove any old signup links from custom components
4. Update role references in custom code

## Troubleshooting

### Common Issues

**"Must be logged in to create users"**
- Ensure user is authenticated before calling createUser()
- Check session validity

**"Teachers can only create student accounts"**  
- Verify teacher is not trying to create teacher/dean accounts
- Expected behavior for role restriction

**"Invalid role specified"**
- Check role parameter is one of: 'teacher', 'student', 'dean'
- Verify role matches allowed permissions

**"Failed to create user account"**
- Check database connection
- Verify migration has been run
- Check Supabase service role permissions

### Environment Variables

Ensure these are properly configured:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key  
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Best Practices

1. **Always provide clear credentials** to new users after account creation
2. **Use strong passwords** that meet complexity requirements  
3. **Regularly audit user accounts** and remove unused ones
4. **Test role permissions** in development before deploying
5. **Monitor failed creation attempts** for security issues