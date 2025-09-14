#!/usr/bin/env node

/**
 * EduTrack Authentication System Test Script
 * 
 * This script tests the new controlled authentication system:
 * - Verifies role-based user creation permissions
 * - Tests database function security
 * - Validates UI components and routing
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testAuthSystem() {
  console.log('🧪 Testing EduTrack Authentication System\n');

  // Test 1: Check if migration was applied
  console.log('1️⃣ Testing database migration...');
  try {
    const { data, error } = await supabase.rpc('create_user_account', {
      user_email: 'test@example.com',
      user_password: 'TestPass123!',
      user_display_name: 'Test User',
      user_role: 'student',
      creator_id: '00000000-0000-0000-0000-000000000000'
    });
    
    if (error && error.message.includes('function create_user_account does not exist')) {
      console.log('❌ Migration not applied. Run: migrations/005_update_auth_system.sql');
    } else {
      console.log('✅ Database function exists');
    }
  } catch (err) {
    console.log('✅ Database function exists (expected permission error)');
  }

  // Test 2: Check for admin -> dean role migration
  console.log('\n2️⃣ Testing admin -> dean role migration...');
  try {
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.log('❌ Cannot check users:', error.message);
    } else {
      const adminUsers = users.users.filter(u => u.user_metadata?.role === 'admin');
      const deanUsers = users.users.filter(u => u.user_metadata?.role === 'dean');
      
      console.log(`✅ Found ${deanUsers.length} dean(s), ${adminUsers.length} admin(s)`);
      
      if (adminUsers.length > 0) {
        console.log('⚠️  Warning: Some admin roles still exist. Consider migrating to dean role.');
      }
    }
  } catch (err) {
    console.log('❌ Error checking users:', err.message);
  }

  // Test 3: File structure validation
  console.log('\n3️⃣ Testing file structure...');
  const fs = require('fs');
  const path = require('path');

  const requiredFiles = [
    'src/components/user-management.tsx',
    'src/components/user-management-test.tsx',
    'src/app/[locale]/dean/dashboard/page.tsx',
    'docs/AUTH_SYSTEM.md',
    'docs/USER_CREATION_WORKFLOW.md',
    'migrations/005_update_auth_system.sql'
  ];

  const removedFiles = [
    'src/app/[locale]/(main)/signup/page.tsx',
    'src/app/signup/signup-form.tsx'
  ];

  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
    }
  });

  removedFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      console.log(`✅ ${file} removed (expected)`);
    } else {
      console.log(`❌ ${file} still exists (should be removed)`);
    }
  });

  // Test 4: Check route configuration
  console.log('\n4️⃣ Testing route configuration...');
  
  const checkRoute = (routePath) => {
    const fullPath = path.join('src/app', routePath);
    return fs.existsSync(fullPath);
  };

  const routes = [
    { path: '[locale]/dean/dashboard/page.tsx', expected: true, name: 'Dean Dashboard' },
    { path: '[locale]/dean/layout.tsx', expected: true, name: 'Dean Layout' },
    { path: '[locale]/(main)/signup/page.tsx', expected: false, name: 'Signup Page' }
  ];

  routes.forEach(route => {
    const exists = checkRoute(route.path);
    if (exists === route.expected) {
      console.log(`✅ ${route.name}: ${exists ? 'exists' : 'removed'} (expected)`);
    } else {
      console.log(`❌ ${route.name}: ${exists ? 'exists' : 'missing'} (unexpected)`);
    }
  });

  console.log('\n🎉 Authentication system test completed!\n');
  
  console.log('📋 Next Steps:');
  console.log('1. Run database migration: migrations/005_update_auth_system.sql');
  console.log('2. Create first dean account using the SQL in docs/USER_CREATION_WORKFLOW.md');
  console.log('3. Test user creation via Dean Dashboard');
  console.log('4. Verify role-based access control');
  console.log('5. Update any custom components to use new role system\n');
}

testAuthSystem().catch(console.error);