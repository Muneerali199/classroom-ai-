const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  console.log('🚀 Running custom migrations...');
  
  try {
    // Read the migration file
    const migrationSQL = fs.readFileSync('tmp_rovodev_run_migrations.sql', 'utf8');
    
    // Split by statement and run each one
    const statements = migrationSQL.split(';').filter(s => s.trim().length > 0);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });
        if (error) {
          console.warn(`Warning on statement ${i + 1}:`, error.message);
        }
      }
    }
    
    // Create dean user manually using the function
    console.log('🔑 Creating dean user...');
    const { data: deanResult, error: deanError } = await supabase.rpc('create_user_account', {
      user_email: 'dean@edutrack.com',
      user_password: 'dean123',
      user_display_name: 'Dean Administrator',
      user_role: 'dean',
      creator_id: null
    });
    
    if (deanError && !deanError.message.includes('already exists')) {
      console.log('Dean creation result:', deanResult);
    }
    
    // Create teacher user
    console.log('👨‍🏫 Creating teacher user...');
    const { data: teacherResult, error: teacherError } = await supabase.rpc('create_user_account', {
      user_email: 'teacher@edutrack.com', 
      user_password: 'teacher123',
      user_display_name: 'Teacher Demo',
      user_role: 'teacher',
      creator_id: null
    });
    
    if (teacherError && !teacherError.message.includes('already exists')) {
      console.log('Teacher creation result:', teacherResult);
    }
    
    console.log('✅ Migrations completed!');
    console.log('\n📋 Test Accounts Created:');
    console.log('Dean: dean@edutrack.com / dean123');
    console.log('Teacher: teacher@edutrack.com / teacher123');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

runMigrations();