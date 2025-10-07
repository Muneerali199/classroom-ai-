# 🚀 AI Engine Quick Start Guide

## Step 1: Get Your Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Copy the generated API key

## Step 2: Add API Key to Environment

1. Open `.env.local` file in your project root
2. Add this line (replace with your actual key):
   ```env
   GOOGLE_GEMINI_API_KEY=AIza...your-actual-key-here
   ```
3. Save the file
4. Restart your development server

## Step 3: Run Database Migration

### Option A: Supabase SQL Editor (Recommended)
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**
5. Copy the entire content from `migrations/020_create_ai_conversations_table.sql`
6. Paste into the SQL editor
7. Click **"Run"**
8. Verify success message appears

### Option B: Supabase CLI
```bash
# Make sure you're logged in
supabase login

# Link to your project (if not already linked)
supabase link --project-ref your-project-ref

# Apply the migration
supabase db push
```

## Step 4: Verify Setup

### Test Database Table
In Supabase SQL Editor, run:
```sql
SELECT * FROM ai_conversations LIMIT 1;
```
Should return empty result (table exists but no data yet).

### Test API Key
In your terminal:
```bash
npm run dev
```

Then open another terminal and test:
```bash
curl -X POST http://localhost:3000/api/ai-chat -H "Content-Type: application/json" -d "{\"message\":\"test\",\"userId\":\"test-id\",\"userRole\":\"student\"}"
```

If you see an error about API key not configured, check Step 2 again.

## Step 5: Start Using the AI

### From Your React Components
```typescript
const handleAIChat = async (message: string) => {
  try {
    const response = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        userId: user.id, // Get from your auth context
        userRole: user.role, // 'student' | 'teacher' | 'dean'
        requestType: 'chat', // or 'analyze' | 'study-plan' | 'motivation'
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('AI Response:', data.response.message);
      console.log('User Data:', data.userDataSummary);
    }
  } catch (error) {
    console.error('AI Error:', error);
  }
};
```

### Example Queries for Students
- "How am I doing in my classes?"
- "What assignments do I have pending?"
- "What's my attendance rate?"
- "Which subjects should I focus on?"
- "When is my next class?"
- "Do I have any late submissions?"

### Request Performance Analysis
```typescript
const analyzePerformance = async () => {
  const response = await fetch('/api/ai-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: '', // Message not needed for analysis
      userId: user.id,
      userRole: 'student',
      requestType: 'analyze',
    }),
  });

  const data = await response.json();
  // Returns comprehensive performance analysis
};
```

### Generate Study Plan
```typescript
const getStudyPlan = async () => {
  const response = await fetch('/api/ai-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: '', // Message not needed
      userId: user.id,
      userRole: 'student',
      requestType: 'study-plan',
    }),
  });

  const data = await response.json();
  // Returns personalized study plan
};
```

### Get Motivational Message
```typescript
const getMotivation = async () => {
  const response = await fetch('/api/ai-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: '', // Message not needed
      userId: user.id,
      userRole: 'student',
      requestType: 'motivation',
    }),
  });

  const data = await response.json();
  // Returns personalized motivational message
};
```

## Step 6: Fetch Conversation History

```typescript
const getHistory = async (limit = 50) => {
  const response = await fetch(
    `/api/ai-chat?userId=${user.id}&limit=${limit}`
  );
  
  const data = await response.json();
  
  if (data.success) {
    console.log('Conversations:', data.conversations);
    console.log('Total Count:', data.count);
  }
};
```

## Troubleshooting

### Issue: "API key not configured"
**Solution**: Make sure `GOOGLE_GEMINI_API_KEY` is in `.env.local` and restart dev server

### Issue: "Failed to fetch user data"
**Solution**: User needs to exist in database with proper auth setup

### Issue: Table does not exist
**Solution**: Run the database migration from Step 3

### Issue: Permission denied on ai_conversations
**Solution**: Check RLS policies are applied correctly in migration

### Issue: Slow responses
**Solution**: This is normal for first request. Subsequent requests will be faster due to Gemini's caching.

## Next Steps

1. ✅ API key configured
2. ✅ Database migration applied
3. ✅ AI responding to queries
4. 🎨 Build a frontend UI component (see `AI_ENGINE_UPDATE_SUMMARY.md`)
5. 📊 Monitor usage and performance
6. 🚀 Deploy to production

## Resources

- **Full Documentation**: `AI_ENGINE_UPDATE_SUMMARY.md`
- **Database Migration**: `migrations/020_create_ai_conversations_table.sql`
- **AI Engine Code**: `src/lib/ai-engine.ts`
- **Data Service Code**: `src/lib/ai-data-service.ts`
- **API Route**: `src/app/api/ai-chat/route.ts`

---

**Ready to use!** Your AI engine is now fully operational and knows everything about your users! 🎉
