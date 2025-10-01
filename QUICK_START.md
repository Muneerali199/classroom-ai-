# 🚀 Quick Start Guide - AI Assistant & Assignments

## ⚡ 3-Step Setup

### Step 1: Database Migration (2 minutes)
```sql
-- Go to: Supabase Dashboard → SQL Editor
-- Copy and run: migrations/014_create_assignments_table.sql
-- Wait for: "✅ Assignments table migration complete!"
```

### Step 2: Create Storage Bucket (1 minute)
1. **Supabase Dashboard** → **Storage** → **New Bucket**
2. Name: `assignments`
3. Public: **Unchecked** ❌
4. Click **Create**

### Step 3: Add Storage Policies (2 minutes)
Copy and run these three policies in **SQL Editor**:

```sql
-- Policy 1: Teachers upload
CREATE POLICY "Teachers upload assignment files"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'assignments' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.uid() = id
        AND (raw_user_meta_data->>'role' = 'teacher' OR raw_user_meta_data->>'role' = 'dean')
    )
);

-- Policy 2: Everyone views
CREATE POLICY "Authenticated users view assignment files"
ON storage.objects FOR SELECT
USING (bucket_id = 'assignments' AND auth.role() = 'authenticated');

-- Policy 3: Students upload submissions
CREATE POLICY "Students upload submission files"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'assignments' AND
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.uid() = id
        AND raw_user_meta_data->>'role' = 'student'
    )
);
```

## ✅ You're Done!

Test your setup:
1. Login as **Teacher**
2. Go to **Dashboard → Assignments**
3. Create a test assignment
4. See "Students notified" ✅

## 🎯 What You Get

### AI Assistant (All Dashboards)
- ✅ Voice commands in 12+ languages
- ✅ Real-time dashboard context
- ✅ Performance analytics
- ✅ Smart, data-driven responses

### Assignment System
- ✅ Create/publish assignments
- ✅ File attachments
- ✅ Student notifications
- ✅ Subject organization
- ✅ Due date tracking

### Enhanced UI
- ✅ Modern gradient design
- ✅ Smooth animations
- ✅ Professional message bubbles
- ✅ Responsive on all devices

## 🎤 Voice Commands Examples

**Teacher**:
- "Show me today's attendance"
- "How many assignments are pending?"
- "What's the class average?"

**Student**:
- "What's my attendance percentage?"
- "Show my recent grades"
- "Do I have any overdue assignments?"

**Dean**:
- "Show faculty performance"
- "What's the overall attendance rate?"
- "How many students are enrolled?"

## 🔗 Quick Links

- **Full Documentation**: `AI_ASSISTANT_UPDATE_SUMMARY.md`
- **Migration Guide**: `MIGRATION_INSTRUCTIONS.md`
- **Teacher AI**: `/dashboard/assistant`
- **Student AI**: `/student/assistant`
- **Dean AI**: `/dean/assistant`

## 💡 Pro Tips

1. **Select your language** in the voice interface (top right)
2. **Toggle performance view** to see live analytics
3. **Ask specific questions** for better AI responses
4. **Use voice commands** for hands-free operation
5. **Check notifications** after creating assignments

## ⚠️ Common Issues

**"Table does not exist"** → Run Step 1 migration
**"Bucket not found"** → Complete Step 2
**"Permission denied"** → Add policies from Step 3
**Voice not working** → Use Chrome/Edge, allow microphone

---

**Need Help?** Check the full documentation files or browser console for detailed error messages.
