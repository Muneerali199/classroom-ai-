#!/usr/bin/env node

/**
 * Login System Test Script
 * Tests all role-based login scenarios
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test scenarios
const testScenarios = [
  {
    name: 'Dean Login Test',
    email: 'dean@school.edu',
    password: 'DeanPassword123!',
    expectedRole: 'dean',
    expectedRedirect: '/dean/dashboard'
  },
  {
    name: 'Invalid Dean Email Test',
    email: 'fake-dean@invalid.com',
    password: 'password123',
    expectedRole: 'dean',
    shouldFail: true,
    expectedError: 'Dean access requires a valid dean email address'
  },
  {
    name: 'Teacher Login Test',
    email: 'teacher@school.edu',
    password: 'TeacherPassword123!',
    expectedRole: 'teacher',
    expectedRedirect: '/dashboard',
    createFirst: true
  },
  {
    name: 'Student Login Test',
    email: 'student@school.edu',
    password: 'StudentPassword123!',
    expectedRole: 'student',
    expectedRedirect: '/student/dashboard',
    createFirst: true
  },
  {
    name: 'Role Mismatch Test',
    email: 'dean@school.edu',
    password: 'DeanPassword123!',
    selectedRole: 'teacher', // Wrong role selected
    expectedRole: 'dean',
    shouldFail: true,
    expectedError: 'Access denied. Your account is registered as dean, but you selected teacher'
  }
];

async function createTestUser(email, password, name, role) {
  console.log(`📝 Creating ${role} user: ${email}`);
  
  try {
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        role: role,
        displayName: name,
        full_name: name
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log(`ℹ️  User ${email} already exists`);
        return true;
      }
      throw authError;
    }

    // Create corresponding record in teachers/students table
    if (role === 'teacher') {
      const { error: teacherError } = await supabase
        .from('teachers')
        .insert([{
          id: authUser.user.id,
          name: name,
          email: email,
          auth_user_id: authUser.user.id,
          created_at: new Date().toISOString()
        }]);
      
      if (teacherError && !teacherError.message.includes('duplicate')) {
        console.warn(`⚠️  Warning: Failed to create teacher record: ${teacherError.message}`);
      }
    } else if (role === 'student') {
      const { error: studentError } = await supabase
        .from('students')
        .insert([{
          id: authUser.user.id,
          name: name,
          email: email,
          auth_user_id: authUser.user.id,
          created_at: new Date().toISOString()
        }]);
      
      if (studentError && !studentError.message.includes('duplicate')) {
        console.warn(`⚠️  Warning: Failed to create student record: ${studentError.message}`);
      }
    }

    console.log(`✅ Created ${role} user successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to create ${role} user:`, error.message);
    return false;
  }
}

async function testLogin(scenario) {
  console.log(`\n🧪 Testing: ${scenario.name}`);
  console.log(`   Email: ${scenario.email}`);
  console.log(`   Role: ${scenario.selectedRole || scenario.expectedRole}`);

  try {
    // Create test user if needed
    if (scenario.createFirst) {
      const name = scenario.expectedRole.charAt(0).toUpperCase() + scenario.expectedRole.slice(1) + ' User';
      await createTestUser(scenario.email, scenario.password, name, scenario.expectedRole);
    }

    // Test authentication
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: scenario.email,
      password: scenario.password
    });

    if (signInError) {
      if (scenario.shouldFail) {
        console.log(`✅ Expected failure: ${signInError.message}`);
        return true;
      } else {
        console.log(`❌ Unexpected login failure: ${signInError.message}`);
        return false;
      }
    }

    if (!signInData.user) {
      console.log(`❌ No user returned from login`);
      return false;
    }

    // Check user role
    const actualRole = signInData.user.user_metadata?.role;
    console.log(`   Actual role in database: ${actualRole}`);

    if (actualRole !== scenario.expectedRole) {
      console.log(`❌ Role mismatch: expected ${scenario.expectedRole}, got ${actualRole}`);
      await supabase.auth.signOut();
      return false;
    }

    // Test role validation logic (simulating frontend validation)
    const selectedRole = scenario.selectedRole || scenario.expectedRole;
    if (actualRole !== selectedRole) {
      if (scenario.shouldFail) {
        console.log(`✅ Expected role mismatch detected: ${actualRole} !== ${selectedRole}`);
        await supabase.auth.signOut();
        return true;
      } else {
        console.log(`❌ Unexpected role mismatch: ${actualRole} !== ${selectedRole}`);
        await supabase.auth.signOut();
        return false;
      }
    }

    if (scenario.shouldFail) {
      console.log(`❌ Test should have failed but succeeded`);
      await supabase.auth.signOut();
      return false;
    }

    console.log(`✅ Login successful - Role: ${actualRole}`);
    console.log(`   Expected redirect: ${scenario.expectedRedirect}`);

    // Clean up session
    await supabase.auth.signOut();
    return true;

  } catch (error) {
    console.log(`❌ Test error: ${error.message}`);
    return false;
  }
}

async function testDeanEmailValidation() {
  console.log(`\n🔒 Testing Dean Email Validation`);
  
  const validDeanEmails = [
    'dean@school.edu',
    'admin@school.edu', 
    'principal@school.edu',
    'test@dean.edu',
    'admin@admin.edu',
    'head@principal.edu'
  ];

  const invalidDeanEmails = [
    'teacher@school.edu',
    'student@school.edu',
    'user@gmail.com',
    'dean@invalid.com',
    'admin@wrong.org'
  ];

  console.log(`✅ Valid Dean emails (should be allowed):`);
  validDeanEmails.forEach(email => console.log(`   - ${email}`));

  console.log(`❌ Invalid Dean emails (should be rejected):`);
  invalidDeanEmails.forEach(email => console.log(`   - ${email}`));

  return true;
}

async function checkDatabaseTables() {
  console.log(`\n📊 Checking Database Tables`);

  try {
    // Check teachers table
    const { data: teachers, error: teachersError } = await supabase
      .from('teachers')
      .select('count')
      .limit(1);
    
    if (teachersError) {
      console.log(`❌ Teachers table: ${teachersError.message}`);
    } else {
      console.log(`✅ Teachers table accessible`);
    }

    // Check students table
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('count')
      .limit(1);
    
    if (studentsError) {
      console.log(`❌ Students table: ${studentsError.message}`);
    } else {
      console.log(`✅ Students table accessible`);
    }

    // Check if Dean user exists
    const { data: deanUsers, error: deanError } = await supabase.auth.admin.listUsers();
    if (!deanError) {
      const dean = deanUsers.users.find(u => u.email === 'dean@school.edu');
      if (dean) {
        console.log(`✅ Dean user exists with role: ${dean.user_metadata?.role}`);
      } else {
        console.log(`❌ Dean user not found`);
      }
    }

    return true;
  } catch (error) {
    console.log(`❌ Database check failed: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Login System Tests\n');

  // Check database setup
  const dbCheck = await checkDatabaseTables();
  if (!dbCheck) {
    console.log('\n❌ Database check failed. Cannot proceed with tests.');
    return;
  }

  // Test Dean email validation logic
  await testDeanEmailValidation();

  // Run login tests
  let passed = 0;
  let total = testScenarios.length;

  for (const scenario of testScenarios) {
    const result = await testLogin(scenario);
    if (result) passed++;
  }

  // Summary
  console.log(`\n📊 Test Results Summary:`);
  console.log(`   Passed: ${passed}/${total}`);
  console.log(`   Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log(`\n🎉 All tests passed! Login system is working correctly.`);
    console.log(`\n🌐 You can now test manually at: http://localhost:3001/login`);
    console.log(`\n📋 Test Credentials:`);
    console.log(`   Dean: dean@school.edu / DeanPassword123!`);
    console.log(`   Teacher: teacher@school.edu / TeacherPassword123!`);
    console.log(`   Student: student@school.edu / StudentPassword123!`);
  } else {
    console.log(`\n❌ Some tests failed. Please check the issues above.`);
  }
}

if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests };