"use client";

import AIAssistantChat from '@/components/ai-assistant-chat';

export default function DeanAssistantPage() {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-2">
            Dean AI Assistant
          </h1>
          <p className="text-white/60">
            Get school-wide analytics, administrative insights, and strategic recommendations powered by Gemini 2.0 Flash
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl">
          <AIAssistantChat userRole="dean" />
        </div>
      </div>
    </div>
  );
}
