const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createInitialAdminUser() {
  console.log('🔑 Creating initial admin/dean user...');
  
  try {
    // Create dean user directly in auth.users table
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@edutrack.com',
      password: 'admin123',
      user_metadata: {
        role: 'dean',
        displayName: 'System Administrator',
        full_name: 'System Administrator'
      },
      email_confirm: true
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('✅ Admin user already exists');
        return;
      }
      throw authError;
    }

    if (authUser.user) {
      // Also create in teachers table for management purposes
      const { error: teacherError } = await supabase
        .from('teachers')
        .insert({
          id: authUser.user.id,
          name: 'System Administrator',
          email: 'admin@edutrack.com',
          teacher_id: 'ADMIN-2025-0001',
          department: 'Administration',
          subject: 'System Management',
          auth_user_id: authUser.user.id,
          employment_status: 'Full-time'
        });

      if (teacherError) {
        console.warn('Note: Could not create teacher record:', teacherError.message);
      }

      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@edutrack.com');
      console.log('🔐 Password: admin123');
    }

    // Create additional demo users
    await createDemoUser('teacher@edutrack.com', 'teacher123', 'teacher', 'Demo Teacher');
    await createDemoUser('student@edutrack.com', 'student123', 'student', 'Demo Student');

  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
  }
}

async function createDemoUser(email, password, role, displayName) {
  try {
    console.log(`🔑 Creating ${role} user: ${email}`);
    
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: {
        role: role,
        displayName: displayName,
        full_name: displayName
      },
      email_confirm: true
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log(`✅ ${role} user already exists`);
        return;
      }
      throw authError;
    }

    if (authUser.user) {
      if (role === 'teacher') {
        const { error } = await supabase
          .from('teachers')
          .insert({
            id: authUser.user.id,
            name: displayName,
            email: email,
            teacher_id: `TEA-2025-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
            department: 'Demo Department',
            subject: 'Demo Subject',
            auth_user_id: authUser.user.id,
            employment_status: 'Full-time'
          });

        if (error) console.warn('Could not create teacher record:', error.message);
      } else if (role === 'student') {
        const { error } = await supabase
          .from('students')
          .insert({
            id: authUser.user.id,
            name: displayName,
            email: email,
            student_id: `STU-2025-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
            grade_level: '10th Grade',
            auth_user_id: authUser.user.id,
            enrollment_date: new Date().toISOString().split('T')[0]
          });

        if (error) console.warn('Could not create student record:', error.message);
      }

      console.log(`✅ ${role} user created successfully!`);
    }
  } catch (error) {
    console.error(`❌ Failed to create ${role} user:`, error.message);
  }
}

createInitialAdminUser();