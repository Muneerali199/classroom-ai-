-- ⚡ Run this AFTER the main timetable migration
-- This sets up automated notifications with cron jobs

-- Step 1: Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Step 2: Schedule notification sender (runs every 5 minutes)
SELECT cron.schedule(
    'send-timetable-notifications',
    '*/5 * * * *',
    $$SELECT send_due_timetable_notifications()$$
);

-- Step 3: Schedule daily notification creation (runs at midnight)
SELECT cron.schedule(
    'create-class-notifications',
    '0 0 * * *',
    $$SELECT create_class_notifications()$$
);

-- Step 4: Verify cron jobs were created
SELECT * FROM cron.job;

-- ✅ Done! Your automated notification system is now active!
