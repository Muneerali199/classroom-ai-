# Database Migration Guide - Add Teacher Name to QR Sessions

## Overview
This migration adds a `teacher_name` column to the `attendance_sessions` table to support the new QR code attendance feature that shows teacher information to students.

## What This Migration Does
- Adds a `teacher_name` TEXT column to the `attendance_sessions` table
- Updates existing records with a default value "Unknown Teacher"
- Makes the column NOT NULL for future records

## How to Apply the Migration

### Option 1: Supabase Dashboard (Recommended)
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New query**
5. Copy and paste the following SQL:

```sql
-- Migration: Add teacher_name column to attendance_sessions table

-- Add teacher_name column to attendance_sessions
ALTER TABLE attendance_sessions 
ADD COLUMN teacher_name TEXT;

-- Update existing records with a default value if needed
UPDATE attendance_sessions 
SET teacher_name = 'Unknown Teacher' 
WHERE teacher_name IS NULL;

-- Make the column NOT NULL for future records
ALTER TABLE attendance_sessions 
ALTER COLUMN teacher_name SET NOT NULL;
```

6. Click **Run** to execute the migration

### Option 2: Using the Setup Script
Run the setup script to get the migration details:
```bash
node scripts/setup-supabase.js
```

## Verification
After applying the migration, you can verify it worked by:

1. Running the setup script again:
   ```bash
   node scripts/setup-supabase.js
   ```
   You should see "✅ Database is set up and contains data!" instead of the migration warning.

2. Testing QR code creation in the application - it should now work without errors.

## Rollback (if needed)
If you need to rollback this migration for any reason:

```sql
-- Remove the teacher_name column
ALTER TABLE attendance_sessions 
DROP COLUMN teacher_name;
```

## What Happens If Migration Is Not Applied
- The QR code attendance feature includes a fallback mechanism
- Sessions will be created without the teacher_name in the database
- A warning will be logged: "teacher_name column not found, inserting without it"
- The QR codes will still include teacher information for student popups
- However, teacher names won't be persisted in the database

## After Migration
Once the migration is applied:
- QR code sessions will properly store teacher names in the database
- The teacher information popup for students will work as designed
- No code changes are needed - the fallback mechanism will automatically use the new column

## Related Files
- `migrations/003_add_teacher_name_to_sessions.sql` - The migration file
- `src/lib/database.types.ts` - Updated TypeScript types
- `src/app/actions.ts` - Contains fallback logic for compatibility
- `src/components/qr-session-manager.tsx` - Teacher-only QR generation
- `src/components/qr-scanner-client.tsx` - Student QR scanning with teacher popup