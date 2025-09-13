#!/usr/bin/env node

/**
 * Supabase Setup Script
 * 
 * This script helps set up your Supabase database by:
 * 1. Testing the connection
 * 2. Running migrations
 * 3. Seeding initial data
 * 
 * Usage: node scripts/setup-supabase.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

async function main() {
  console.log('🚀 Starting Supabase setup...\n');

  // Check environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease update your .env file with your Supabase project credentials.');
    console.error('You can find these in your Supabase dashboard under Settings > API\n');
    process.exit(1);
  }

  try {
    // Import Supabase client
    const { createClient } = require('@supabase/supabase-js');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Test connection
    console.log('🔍 Testing Supabase connection...');
    const { data, error } = await supabase.from('students').select('count').limit(1);
    
    if (error && error.code === '42P01') {
      console.log('📋 Database tables not found. You need to run migrations.\\n');
      console.log('To set up your database:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Navigate to the SQL Editor');
      console.log('3. Run the following migration files in order:');
      console.log('   - migrations/001_create_tables.sql');
      console.log('   - migrations/002_seed_data.sql');
      console.log('   - migrations/003_add_teacher_name_to_sessions.sql\\n');
      
      // Display migration content
      const migration1 = fs.readFileSync(path.join(__dirname, '../migrations/001_create_tables.sql'), 'utf8');
      const migration2 = fs.readFileSync(path.join(__dirname, '../migrations/002_seed_data.sql'), 'utf8');
      const migration3 = fs.readFileSync(path.join(__dirname, '../migrations/003_add_teacher_name_to_sessions.sql'), 'utf8');
      
      console.log('📄 Migration 1 - Create Tables:');
      console.log('```sql');
      console.log(migration1);
      console.log('```\n');
      
      console.log('📄 Migration 2 - Seed Data:');
      console.log('```sql');
      console.log(migration2);
      console.log('```\n');
      
      console.log('📄 Migration 3 - Add Teacher Name:');
      console.log('```sql');
      console.log(migration3);
      console.log('```\\n');
      
    } else if (error) {
      console.error('❌ Connection failed:', error.message);
      process.exit(1);
    } else {
      console.log('✅ Connection successful!');
      
      // Check if teacher_name column exists in attendance_sessions
      const { data: sessionData, error: sessionError } = await supabase
        .from('attendance_sessions')
        .select('teacher_name')
        .limit(1);
      
      if (sessionError && sessionError.code === '42703') {
        console.log('⚠️  Database needs to be updated with teacher_name column.');
        console.log('Please run this migration in your Supabase SQL Editor:\\n');
        
        const migration3 = fs.readFileSync(path.join(__dirname, '../migrations/003_add_teacher_name_to_sessions.sql'), 'utf8');
        console.log('📄 Migration 3 - Add Teacher Name:');
        console.log('```sql');
        console.log(migration3);
        console.log('```\\n');
        
        console.log('After running this migration, the QR code attendance feature will work properly.');
      } else {
        // Test if data exists
        const { data: students } = await supabase.from('students').select('*').limit(5);
        
        if (students && students.length > 0) {
          console.log('✅ Database is set up and contains data!');
          console.log(`📊 Found ${students.length} students in the database\\n`);
          
          students.forEach(student => {
            console.log(`   - ${student.name} (ID: ${student.id})`);
          });
        } else {
          console.log('⚠️  Database tables exist but no data found.');
          console.log('You may want to run the seed data migration (002_seed_data.sql)');
        }
      }
    }

    console.log('\n🎉 Supabase setup check complete!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();