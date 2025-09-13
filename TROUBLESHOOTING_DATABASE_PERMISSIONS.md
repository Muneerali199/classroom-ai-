# Database Permissions Troubleshooting Guide

## Common Permission Issues in Supabase Applications

This guide helps diagnose and fix database permission issues, particularly those related to Row Level Security (RLS) policies.

## 🚨 Common Error Messages

### "permission denied for table [table_name]"
- **Cause**: RLS policies blocking access with current authentication level
- **Solution**: Use admin client for server-side operations, anon client for client-side

### "Failed to fetch [data]"
- **Cause**: Insufficient permissions to read from database tables
- **Solution**: Check RLS policies and client configuration

### "Insert/Update/Delete failed"
- **Cause**: RLS policies preventing write operations
- **Solution**: Ensure proper authentication or use admin client for server operations

## 🔧 Diagnosis Steps

### 1. Identify the Context
```typescript
// ❌ Problem: Using anon client for server operations
const supabase = getSupabase(); // Uses anon key

// ✅ Solution: Use admin client for server operations  
const supabase = supabaseAdmin || getSupabase(); // Uses service role key
```

### 2. Check Your Environment Variables
```bash
# Required for basic operations
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Required for admin operations (server-side only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Test Database Connection
```bash
npm run setup:supabase
```

## 🛠️ Common Fixes

### Fix 1: Update Data Fetching Functions
```typescript
// Before (❌)
export async function getStudents() {
  const supabase = getSupabase(); // Uses anon key
  // ... database operations
}

// After (✅)
export async function getStudents() {
  const supabase = supabaseAdmin || getSupabase(); // Uses admin key for server
  // ... database operations
}
```

### Fix 2: Update Database Service Classes
```typescript
// Before (❌)
export class StudentService {
  static async getAll() {
    const supabase = getSupabase(); // Restricted permissions
    // ...
  }
}

// After (✅)
export class StudentService {
  static async getAll() {
    const supabase = supabaseAdmin || getSupabase(); // Full permissions
    // ...
  }
}
```

### Fix 3: Update Server Actions
```typescript
// Before (❌)
export async function createSession() {
  const supabase = getSupabase(); // May hit RLS restrictions
  // ...
}

// After (✅)
export async function createSession() {
  const supabase = supabaseAdmin || getSupabase(); // Bypasses RLS
  // ...
}
```

## 🔒 Security Best Practices

### 1. Client Types and Usage
- **Anonymous Client** (`getSupabase()`): Client-side operations, RLS protected
- **Admin Client** (`supabaseAdmin`): Server-side operations, bypasses RLS
- **Never expose** service role key to client-side code

### 2. When to Use Each Client
```typescript
// ✅ Client-side: Use anon client (RLS protection)
const supabase = getSupabase();
await supabase.auth.signIn(credentials);

// ✅ Server-side: Use admin client (full access)
const supabase = supabaseAdmin || getSupabase();
await supabase.from('students').select('*');
```

### 3. Import Pattern
```typescript
import { getSupabase, supabaseAdmin } from '@/lib/supabase';

// Use this pattern for server-side operations
const supabase = supabaseAdmin || getSupabase();
```

## 🔍 Files to Check for Permission Issues

### 1. Data Layer (`src/lib/data.ts`)
- `getStudents()`
- `getAttendanceSessions()`  
- `getSessionAttendanceRecords()`
- `getTeachers()`

### 2. Database Services (`src/lib/database.ts`)
- `StudentService` methods
- `AttendanceService` methods
- `AttendanceSessionService` methods

### 3. Server Actions (`src/app/actions.ts`)
- QR session creation
- Attendance recording
- Any database mutations

### 4. Authentication (`src/lib/auth.ts`)
- Usually works with auth API, but check for table operations

## 🧪 Testing Permission Fixes

### 1. Test Page Loading
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en/dashboard
# Should return: 200
```

### 2. Check Server Logs
```bash
npm run dev
# Look for permission denied errors in console
```

### 3. Test Database Operations
```typescript
// Test in browser console or create test script
import { StudentService } from '@/lib/database';

try {
  const students = await StudentService.getAll();
  console.log('✅ Students loaded:', students.length);
} catch (error) {
  console.error('❌ Permission error:', error.message);
}
```

## 📋 Quick Fix Checklist

- [ ] Environment variables are set correctly
- [ ] Admin client is imported: `import { supabaseAdmin } from '@/lib/supabase'`
- [ ] Server-side functions use: `supabaseAdmin || getSupabase()`
- [ ] Client-side operations use: `getSupabase()`
- [ ] No service role key exposed to client-side
- [ ] Database connection test passes
- [ ] All pages load without permission errors

## 🆘 Advanced Troubleshooting

### Check RLS Policies in Supabase Dashboard
1. Go to Authentication > Policies
2. Check if RLS is enabled on tables
3. Review policy conditions
4. Temporarily disable RLS to test (not for production)

### Enable Query Logging
```sql
-- In Supabase SQL Editor
ALTER SYSTEM SET log_statement = 'all';
SELECT pg_reload_conf();
```

### Common RLS Policy Examples
```sql
-- Allow read access to authenticated users
CREATE POLICY "Allow read access" ON students
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow all operations for service role
CREATE POLICY "Allow service role" ON students
FOR ALL USING (auth.jwt()->>'role' = 'service_role');
```

## 📞 When to Get Help

Contact the development team if:
- Multiple fixes don't resolve the issue
- RLS policies need to be modified
- New tables need permission configuration
- Production environment has different behavior

---

**Last Updated**: January 2025  
**Related Files**: `src/lib/supabase.ts`, `src/lib/data.ts`, `src/lib/database.ts`, `src/app/actions.ts`