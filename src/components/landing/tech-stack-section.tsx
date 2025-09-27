'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Code, 
  Wind, 
  Bot, 
  Server, 
  Smartphone, 
  Shield, 
  Zap,
  Globe,
  Settings,
  BarChart3,
  Layers
} from 'lucide-react';

type TechCategory = 'frontend' | 'backend' | 'ai' | 'tools';

interface Technology {
  name: string;
  icon: React.ReactElement;
  description: string;
}

interface CategoryData {
  title: string;
  color: string;
  technologies: Technology[];
}

export default function TechStackSection() {
  const [selectedCategory, setSelectedCategory] = useState<TechCategory>('frontend');

  const getGradientColors = (colorString: string): string => {
    switch (colorString) {
      case 'from-blue-500 to-cyan-500':
        return '#3b82f6, #06b6d4';
      case 'from-green-500 to-emerald-500':
        return '#10b981, #059669';
      case 'from-purple-500 to-pink-500':
        return '#8b5cf6, #ec4899';
      case 'from-orange-500 to-red-500':
        return '#f97316, #ef4444';
      default:
        return '#3b82f6, #06b6d4';
    }
  };

  const techCategories: Record<TechCategory, CategoryData> = {
    frontend: {
      title: 'Frontend & UI',
      color: 'from-blue-500 to-cyan-500',
      technologies: [
        { name: 'Next.js 15.3', icon: <Code className="w-8 h-8" />, description: 'React framework with SSR' },
        { name: 'TypeScript', icon: <Code className="w-8 h-8" />, description: 'Type safety & IntelliSense' },
        { name: 'Tailwind CSS', icon: <Wind className="w-8 h-8" />, description: 'Utility-first CSS framework' },
        { name: 'ShadcnUI', icon: <Layers className="w-8 h-8" />, description: 'Modern UI components' },
        { name: 'React Hook Form', icon: <Settings className="w-8 h-8" />, description: 'Performant forms with validation' },
        { name: 'Framer Motion', icon: <Zap className="w-8 h-8" />, description: 'Production-ready animations' }
      ]
    },
    backend: {
      title: 'Backend & Database',
      color: 'from-green-500 to-emerald-500',
      technologies: [
        { name: 'Supabase', icon: <Server className="w-8 h-8" />, description: 'Backend-as-a-Service platform' },
        { name: 'PostgreSQL', icon: <Database className="w-8 h-8" />, description: 'Powerful relational database' },
        { name: 'Row Level Security', icon: <Shield className="w-8 h-8" />, description: 'Database-level permissions' },
        { name: 'Real-time Subscriptions', icon: <Zap className="w-8 h-8" />, description: 'Live data synchronization' },
        { name: 'Edge Functions', icon: <Globe className="w-8 h-8" />, description: 'Serverless API endpoints' }
      ]
    },
    ai: {
      title: 'AI & Analytics',
      color: 'from-purple-500 to-pink-500',
      technologies: [
        { name: 'Genkit AI', icon: <Bot className="w-8 h-8" />, description: 'AI development framework' },
        { name: 'Recharts', icon: <BarChart3 className="w-8 h-8" />, description: 'Data visualization library' },
        { name: 'AI Summaries', icon: <Bot className="w-8 h-8" />, description: 'Automated attendance analysis' },
        { name: 'Predictive Analytics', icon: <BarChart3 className="w-8 h-8" />, description: 'Trend forecasting & insights' }
      ]
    },
    tools: {
      title: 'Development Tools',
      color: 'from-orange-500 to-red-500',
      technologies: [
        { name: 'ESLint', icon: <Settings className="w-8 h-8" />, description: 'Code quality & consistency' },
        { name: 'Turbopack', icon: <Zap className="w-8 h-8" />, description: 'Fast build system' },
        { name: 'Vercel', icon: <Globe className="w-8 h-8" />, description: 'Deployment & hosting' },
        { name: 'Git & GitHub', icon: <Code className="w-8 h-8" />, description: 'Version control & collaboration' },
        { name: 'PWA Support', icon: <Smartphone className="w-8 h-8" />, description: 'Progressive Web App features' }
      ]
    }
  };

  return (
    <motion.section
      id="tech-stack"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Built with Modern Technology
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            ClassroomAI leverages cutting-edge technologies to deliver a robust, scalable, 
            and intelligent attendance management platform.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {Object.entries(techCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as TechCategory)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === key
                  ? 'text-white shadow-lg scale-105'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              style={{
                background: selectedCategory === key 
                  ? `linear-gradient(135deg, ${getGradientColors(category.color)})` 
                  : undefined
              }}
            >
              {category.title}
            </button>
          ))}
        </motion.div>

        {/* Technology Grid */}
        <motion.div
          key={selectedCategory}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {techCategories[selectedCategory].technologies.map((tech: Technology, index: number) => (
            <motion.div
              key={tech.name}
              className="group relative overflow-hidden rounded-2xl p-6 cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-all duration-300 bg-gray-100 dark:bg-gray-700">
                  {tech.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-100 transition-colors">
                    {tech.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {tech.description}
                  </p>
                </div>
              </div>

              {/* Gradient overlay on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"
                style={{
                  background: techCategories[selectedCategory].color.includes('blue') 
                    ? 'linear-gradient(135deg, #3b82f6, #06b6d4)'
                    : techCategories[selectedCategory].color.includes('green')
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : techCategories[selectedCategory].color.includes('purple')
                    ? 'linear-gradient(135deg, #8b5cf6, #ec4899)'
                    : 'linear-gradient(135deg, #f97316, #ef4444)'
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Key Features Section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Technical Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">&lt; 1.5s page load times with Turbopack</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Enterprise Security</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Row-level security & role-based access</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">AI-Powered</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Intelligent insights & automated analysis</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
