'use client';

import ChatbotProvider from '@/components/chatbot-provider';
import { useAuth } from '@/hooks/use-auth';

export default function ChatbotMount() {
  const { user } = useAuth();

  if (!user) return null;

  // Normalize role type
  const role = (user.role || user.user_metadata?.role || 'teacher') as 'student' | 'teacher' | 'dean';
  const userId = (user.id || user.uid) as string;

  if (!userId) return null;

  return (
    <ChatbotProvider userId={userId} userRole={role}>
      {/* Provider only renders floating widget; no children needed here */}
    </ChatbotProvider>
  );
}
