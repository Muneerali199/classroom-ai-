-- Fix Missing User Profiles
-- Run this in Supabase SQL Editor to create profile records for auth users that don't have them

-- ============================================
-- CREATE MISSING TEACHER RECORDS
-- ============================================

INSERT INTO teachers (
  id,
  auth_user_id,
  name,
  email,
  created_at,
  updated_at
)
SELECT 
  u.id::text as id,
  u.id as auth_user_id,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'displayName',
    SPLIT_PART(u.email, '@', 1)
  ) as name,
  u.email,
  u.created_at as created_at,
  NOW() as updated_at
FROM auth.users u
WHERE (
  u.raw_user_meta_data->>'role' = 'teacher' 
  OR u.raw_user_meta_data->>'role' = 'dean'
)
AND NOT EXISTS (
  SELECT 1 FROM teachers t WHERE t.auth_user_id = u.id
);

-- ============================================
-- CREATE MISSING STUDENT RECORDS
-- ============================================

INSERT INTO students (
  id,
  auth_user_id,
  name,
  email,
  created_at,
  updated_at
)
SELECT 
  u.id::text as id,
  u.id as auth_user_id,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'displayName',
    SPLIT_PART(u.email, '@', 1)
  ) as name,
  u.email,
  u.created_at as created_at,
  NOW() as updated_at
FROM auth.users u
WHERE u.raw_user_meta_data->>'role' = 'student'
AND NOT EXISTS (
  SELECT 1 FROM students s WHERE s.auth_user_id = u.id
);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check how many auth users don't have corresponding profiles
SELECT 
  u.raw_user_meta_data->>'role' as role,
  COUNT(*) as missing_profiles
FROM auth.users u
WHERE (
  (u.raw_user_meta_data->>'role' = 'student' AND NOT EXISTS (SELECT 1 FROM students WHERE auth_user_id = u.id))
  OR
  ((u.raw_user_meta_data->>'role' = 'teacher' OR u.raw_user_meta_data->>'role' = 'dean') 
   AND NOT EXISTS (SELECT 1 FROM teachers WHERE auth_user_id = u.id))
)
GROUP BY u.raw_user_meta_data->>'role';

-- List all auth users with their profile status
SELECT 
  u.id as auth_user_id,
  u.email,
  u.raw_user_meta_data->>'role' as role,
  u.raw_user_meta_data->>'full_name' as full_name,
  CASE 
    WHEN u.raw_user_meta_data->>'role' = 'student' 
      THEN EXISTS (SELECT 1 FROM students WHERE auth_user_id = u.id)
    WHEN u.raw_user_meta_data->>'role' IN ('teacher', 'dean')
      THEN EXISTS (SELECT 1 FROM teachers WHERE auth_user_id = u.id)
    ELSE NULL
  END as has_profile,
  u.created_at
FROM auth.users u
ORDER BY u.created_at DESC;

-- View summary of users and profiles
SELECT 
  'Total Auth Users' as metric,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Students with profiles',
  COUNT(*)
FROM students
WHERE auth_user_id IS NOT NULL
UNION ALL
SELECT 
  'Teachers with profiles',
  COUNT(*)
FROM teachers
WHERE auth_user_id IS NOT NULL
UNION ALL
SELECT 
  'Auth users without profiles',
  COUNT(*)
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM students WHERE auth_user_id = u.id
  UNION
  SELECT 1 FROM teachers WHERE auth_user_id = u.id
);

-- ============================================
-- MANUAL FIX FOR SPECIFIC USER (OPTIONAL)
-- ============================================

-- If you want to create a profile for a specific user, uncomment and modify this:

/*
-- For a teacher:
INSERT INTO teachers (
  id,
  auth_user_id,
  name,
  email,
  created_at
)
VALUES (
  '561e5eda-ec59-4267-84d7-16c084b50965', -- Replace with your auth_user_id
  '561e5eda-ec59-4267-84d7-16c084b50965'::uuid, -- Replace with your auth_user_id
  'Your Name',                              -- Replace with your name
  'your.email@example.com',                 -- Replace with your email
  NOW()
);

-- For a student:
INSERT INTO students (
  id,
  auth_user_id,
  name,
  email,
  created_at
)
VALUES (
  '561e5eda-ec59-4267-84d7-16c084b50965', -- Replace with your auth_user_id
  '561e5eda-ec59-4267-84d7-16c084b50965'::uuid, -- Replace with your auth_user_id
  'Your Name',                              -- Replace with your name
  'your.email@example.com',                 -- Replace with your email
  NOW()
);
*/
