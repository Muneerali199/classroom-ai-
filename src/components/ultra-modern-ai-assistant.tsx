'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Sparkles, Zap, Lightbulb, BookOpen, MessageSquare } from 'lucide-react';
import { THEME_COLORS, THEME_STYLES } from '@/lib/theme-config';

export default function UltraModernAIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your ClassroomAI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const quickActions = [
    { icon: Lightbulb, label: 'Generate Quiz', color: THEME_COLORS.primary },
    { icon: BookOpen, label: 'Lesson Plan', color: THEME_COLORS.secondary },
    { icon: Zap, label: 'Grade Papers', color: THEME_COLORS.success },
    { icon: MessageSquare, label: 'Feedback', color: THEME_COLORS.warning },
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I understand your request. Let me help you with that!' 
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3">
          <div className={`${THEME_STYLES.iconContainerLg} bg-gradient-to-br ${THEME_COLORS.primary}`}>
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white">
              AI Assistant
            </h1>
            <p className="text-gray-400">Your intelligent teaching companion</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        {quickActions.map((action, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${THEME_STYLES.card} p-4 text-center group`}
          >
            <div className={`${THEME_STYLES.iconContainer} bg-gradient-to-br ${action.color} mx-auto mb-2 group-hover:scale-110 transition-transform`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-white">{action.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Chat Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1 flex flex-col"
      >
        <div className={`${THEME_STYLES.cardElevated} flex-1 flex flex-col max-h-[calc(100vh-400px)]`}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? `bg-gradient-to-br ${THEME_COLORS.primary} text-white`
                    : 'bg-white/5 border border-white/10 text-white'
                }`}>
                  <div className="flex items-start gap-2">
                    {message.role === 'assistant' && (
                      <Bot className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className={`${THEME_STYLES.input} flex-1`}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              className={`${THEME_STYLES.iconContainerLg} bg-gradient-to-br ${THEME_COLORS.primarySolid} hover:shadow-lg hover:shadow-cyan-500/50 transition-all`}
            >
              <Send className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          { icon: Sparkles, title: 'Smart Suggestions', desc: 'Get intelligent recommendations' },
          { icon: Zap, title: 'Instant Responses', desc: 'Lightning-fast AI answers' },
          { icon: BookOpen, title: 'Context Aware', desc: 'Understands your teaching context' }
        ].map((feature, i) => (
          <div key={i} className={`${THEME_STYLES.card} p-4`}>
            <div className="flex items-center gap-3">
              <div className={`${THEME_STYLES.iconContainer} bg-gradient-to-br ${THEME_COLORS.primary}`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
                <p className="text-gray-400 text-xs">{feature.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
