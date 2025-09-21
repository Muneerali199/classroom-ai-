import ProfileForm from '@/components/profile-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { User, Settings, Shield, Bell } from 'lucide-react';

export default function ProfilePage() {
  const t = useTranslations('ProfilePage');

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #e3e3e3 0%, #d6d6d6 100%)'
      }}
    >
      {/* Subtle floating elements with neumorphic style */}
      <div className="fixed top-20 left-10 w-16 h-16 rounded-full pointer-events-none z-0 animate-pulse"
        style={{
          background: 'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
          boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff'
        }}
      />
      <div className="fixed top-60 right-16 w-12 h-12 rounded-full pointer-events-none z-0 animate-pulse"
        style={{
          background: 'linear-gradient(145deg, #ebebeb, #d5d5d5)',
          boxShadow: '6px 6px 12px #c4c4c4, -6px -6px 12px #ffffff'
        }}
      />
      <div className="fixed bottom-32 left-24 w-20 h-20 rounded-full pointer-events-none z-0 animate-pulse"
        style={{
          background: 'linear-gradient(145deg, #ededed, #d7d7d7)',
          boxShadow: '10px 10px 20px #c0c0c0, -10px -10px 20px #ffffff'
        }}
      />

      <div className="container-modern section-padding space-y-8">
        {/* Modern Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="neumorphic-card p-6 lg:p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-responsive-xl font-bold font-headline tracking-tight neumorphic-text">
                {t('title')}
              </h1>
              <p className="text-gray-600 text-responsive-sm max-w-2xl text-balance">
                {t('description')}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="neumorphic-sm px-4 py-2 rounded-xl text-sm font-medium neumorphic-text">
                <User className="w-4 h-4 mr-2 inline" />
                Profile Settings
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div className="neumorphic-card p-6 group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 neumorphic-sm-inset rounded-2xl text-gray-600 group-hover:neumorphic-sm transition-all duration-300">
                <User className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold neumorphic-text">Personal</div>
                <div className="text-xs text-gray-500 font-medium">Information</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Manage your personal details and contact information
            </p>
          </div>
          
          <div className="neumorphic-card p-6 group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 neumorphic-sm-inset rounded-2xl text-gray-600 group-hover:neumorphic-sm transition-all duration-300">
                <Settings className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold neumorphic-text">Preferences</div>
                <div className="text-xs text-gray-500 font-medium">Settings</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Customize your language and timezone preferences
            </p>
          </div>
          
          <div className="neumorphic-card p-6 group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 neumorphic-sm-inset rounded-2xl text-gray-600 group-hover:neumorphic-sm transition-all duration-300">
                <Bell className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold neumorphic-text">Notifications</div>
                <div className="text-xs text-gray-500 font-medium">Alerts</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Control how and when you receive notifications
            </p>
          </div>
        </motion.div>

        {/* Main Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="neumorphic-card p-2"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 neumorphic-sm-inset rounded-xl text-gray-600">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold neumorphic-text">{t('cardTitle')}</h2>
                <p className="text-sm text-gray-600">{t('cardDescription')}</p>
              </div>
            </div>
            <ProfileForm />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
