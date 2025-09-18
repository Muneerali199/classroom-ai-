#!/usr/bin/env node

/**
 * Setup Dean Account Script
 * Creates a Dean user account with proper credentials for testing and production use
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupDeanAccount() {
  console.log('🚀 Setting up Dean account...');

  try {
    // Dean credentials
    const deanEmail = 'dean@school.edu';
    const deanPassword = 'DeanPassword123!'; // Change this in production
    const deanName = 'School Dean';

    console.log('📧 Creating Dean auth user...');

    // Create the Dean user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: deanEmail,
      password: deanPassword,
      email_confirm: true,
      user_metadata: {
        role: 'dean',
        displayName: deanName,
        full_name: deanName
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('ℹ️  Dean user already exists, updating...');
        
        // Get existing user
        const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;
        
        const existingUser = existingUsers.users.find(u => u.email === deanEmail);
        if (existingUser) {
          // Update user metadata
          const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
            user_metadata: {
              role: 'dean',
              displayName: deanName,
              full_name: deanName
            }
          });
          
          if (updateError) throw updateError;
          console.log('✅ Dean user updated successfully');
        }
      } else {
        throw authError;
      }
    } else {
      console.log('✅ Dean auth user created successfully');
    }

    // Test the setup
    console.log('🧪 Testing Dean login...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: deanEmail,
      password: deanPassword
    });

    if (signInError) {
      throw signInError;
    }

    console.log('✅ Dean login test successful');

    // Sign out the test session
    await supabase.auth.signOut();

    console.log('\n🎉 Dean account setup complete!');
    console.log('\n📋 Dean Login Credentials:');
    console.log(`   Email: ${deanEmail}`);
    console.log(`   Password: ${deanPassword}`);
    console.log(`   Role: dean`);
    console.log('\n⚠️  IMPORTANT: Change the default password in production!');
    console.log('\n🌐 You can now login at: http://localhost:3000/login');
    console.log('   Select "Dean" role and use the credentials above');

  } catch (error) {
    console.error('❌ Error setting up Dean account:', error.message);
    process.exit(1);
  }
}

// Additional setup for development
async function setupAdditionalDeanEmails() {
  console.log('\n📝 Setting up additional Dean email patterns...');
  
  const additionalDeanEmails = [
    'admin@school.edu',
    'principal@school.edu'
  ];
  
  console.log('ℹ️  The following email patterns are configured for Dean access:');
  console.log('   - dean@school.edu (primary)');
  additionalDeanEmails.forEach(email => {
    console.log(`   - ${email}`);
  });
  console.log('   - Any email ending with @dean.edu, @admin.edu, @principal.edu');
  console.log('\n💡 You can modify these patterns in src/app/login/login-form.tsx');
}

async function main() {
  try {
    await setupDeanAccount();
    await setupAdditionalDeanEmails();
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { setupDeanAccount };