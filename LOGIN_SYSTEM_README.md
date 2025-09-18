# 🔐 EduTrack Login System with Role-Based Access Control

## Overview

This comprehensive login system provides secure authentication with role-based access control for educational institutions. It features a dropdown role selection, Dean email validation, and complete teacher management capabilities.

## 🌟 Features

### Authentication System
- **Role-based login** with dropdown selection (Student, Teacher, Dean)
- **Dean email validation** - requires specific Dean email addresses
- **Secure password handling** with visibility toggle
- **Form validation** with real-time feedback
- **Password reset functionality**
- **Session management** with automatic redirects

### Dean Management Dashboard
- **Comprehensive teacher management** (Create, Read, Update, Delete)
- **Teacher profile management** with full details
- **Password reset capabilities** for teacher accounts
- **Employment status tracking** (Full-time, Part-time, Contract, Substitute)
- **Department and subject management**
- **Real-time statistics and analytics**
- **Search and filter functionality**

### Security Features
- **Role validation** - users must select their actual role
- **Dean email restrictions** - only specific emails can access Dean role
- **Database-level security** with RLS policies
- **Session validation** and automatic logout on role mismatch
- **Secure password storage** using Supabase Auth

## 🚀 Quick Start

### 1. Setup Database
```bash
# Run database migrations
npm run setup:supabase

# Setup Dean account
npm run setup:dean
```

### 2. Environment Variables
Ensure your `.env` file contains:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Default Dean Credentials
After running `npm run setup:dean`:
- **Email:** `dean@school.edu`
- **Password:** `DeanPassword123!`
- **Role:** Dean

⚠️ **Change the default password in production!**

## 📝 Role Configuration

### Dean Email Validation
Dean access is restricted to specific email patterns configured in `src/app/login/login-form.tsx`:

```typescript
// Specific Dean emails
const DEAN_EMAILS = ['dean@school.edu', 'admin@school.edu', 'principal@school.edu'];

// Dean email domains
const DEAN_EMAIL_DOMAINS = ['dean.edu', 'admin.edu', 'principal.edu'];
```

### Role Redirects
After successful login, users are redirected based on their role:
- **Dean:** `/dean/dashboard`
- **Teacher:** `/dashboard`
- **Student:** `/student/dashboard`

## 🏗️ Architecture

### Components Structure
```
src/
├── app/login/login-form.tsx          # Enhanced login form with role selection
├── components/
│   ├── dean-teacher-management.tsx   # Complete teacher CRUD interface
│   ├── enhanced-dean-dashboard.tsx   # Comprehensive Dean dashboard
│   └── role-redirect.tsx            # Role-based navigation
├── lib/
│   ├── enhanced-teacher-service.ts   # Teacher management service
│   └── auth.ts                      # Authentication service
└── migrations/
    ├── 008_create_teachers_table.sql # Teacher database schema
    └── 013_dean_management_functions.sql # Dean management functions
```

### Database Schema
```sql
-- Teachers table with comprehensive profile
CREATE TABLE teachers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    teacher_id TEXT UNIQUE,
    department TEXT,
    subject TEXT,
    phone_number TEXT,
    address TEXT,
    date_of_birth DATE,
    hire_date DATE,
    employment_status TEXT CHECK (employment_status IN ('Full-time', 'Part-time', 'Contract', 'Substitute')),
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    qualifications TEXT,
    notes TEXT,
    photo_url TEXT,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
```

## 🎯 Usage Guide

### For Deans

#### Accessing the Dashboard
1. Go to the login page
2. Select "Dean" from the role dropdown
3. Enter your Dean email and password
4. Click "Sign In to Dashboard"

#### Managing Teachers
1. Navigate to the "Teachers" tab
2. **Create Teacher:**
   - Click "Add Teacher"
   - Fill in teacher details including login credentials
   - Set employment status and department
   - Click "Create Teacher"

3. **Edit Teacher:**
   - Click the edit icon next to any teacher
   - Update their information
   - Click "Update Teacher"

4. **Reset Password:**
   - Click the key icon next to any teacher
   - Enter new password
   - Click "Reset Password"

5. **Delete Teacher:**
   - Click the delete icon next to any teacher
   - Confirm deletion in the dialog

#### Viewing Analytics
- View teacher statistics on the Overview tab
- See employment status distribution
- Monitor department breakdown
- Track recent activity

### For Teachers and Students
1. Select your role from the dropdown
2. Enter your email and password
3. Click "Sign In to Dashboard"

Note: Role selection must match your actual account role.

## 🔧 Customization

### Adding New Dean Emails
Edit `src/app/login/login-form.tsx`:
```typescript
const DEAN_EMAILS = [
  'dean@school.edu',
  'admin@school.edu',
  'principal@school.edu',
  'your-new-dean@school.edu'  // Add here
];
```

### Modifying Teacher Fields
Update the form in `src/components/dean-teacher-management.tsx` and the database schema in the migration files.

### Changing Role Redirects
Edit the switch statement in `src/app/login/login-form.tsx`:
```typescript
switch (actualRole) {
  case 'dean':
    redirectPath = '/your-custom-dean-path';
    break;
  // ... other cases
}
```

## 🛡️ Security Considerations

### Production Deployment
1. **Change default Dean password**
2. **Use environment-specific Dean emails**
3. **Enable RLS policies** on all tables
4. **Use HTTPS** for all connections
5. **Regular security audits** of user accounts

### Database Security
- All teacher management functions require Dean role validation
- Cascade deletes ensure data integrity
- Encrypted password storage via Supabase Auth
- Session-based authentication with automatic expiry

## 🐛 Troubleshooting

### Common Issues

#### "Dean access requires a valid dean email address"
- Ensure you're using an email from the approved Dean list
- Check the email domains configuration

#### "Access denied. Your account is registered as..."
- The selected role doesn't match your account role
- Contact an administrator to verify your account role

#### Teacher creation fails
- Ensure you're logged in as Dean
- Check that the email isn't already in use
- Verify all required fields are filled

### Debug Mode
Enable debug logging by setting:
```env
NEXT_PUBLIC_DEBUG=true
```

## 📱 Responsive Design

The login system and Dean dashboard are fully responsive:
- **Mobile-first design** with touch-friendly interfaces
- **Adaptive layouts** for tablet and desktop
- **Accessible components** with proper ARIA labels
- **Dark mode support** throughout the interface

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Manual Testing Checklist
- [ ] Dean login with valid email
- [ ] Dean login with invalid email (should fail)
- [ ] Role mismatch detection
- [ ] Teacher creation, editing, deletion
- [ ] Password reset functionality
- [ ] Search and filter features
- [ ] Responsive design on mobile

## 📊 Analytics and Monitoring

The Dean dashboard provides:
- **Real-time teacher statistics**
- **Employment status distribution**
- **Department breakdown**
- **Activity logging** (future feature)

## 🔄 Migration Guide

### From Basic Auth to Role-Based Auth
1. Run new migrations: `npm run setup:supabase`
2. Setup Dean account: `npm run setup:dean`
3. Update existing user roles in the database
4. Test login with different roles

## 📞 Support

For issues or questions:
1. Check this README
2. Review the troubleshooting section
3. Check database logs
4. Verify environment variables

---

## 🎉 Success!

You now have a fully functional login system with:
- ✅ Role-based access control
- ✅ Dean authentication with email validation
- ✅ Comprehensive teacher management
- ✅ Real database integration
- ✅ Security best practices
- ✅ Responsive design

The system is ready for production use with proper configuration!