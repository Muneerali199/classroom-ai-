-- Run this in Supabase SQL Editor to see your teachers table structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'teachers'
ORDER BY ordinal_position;
