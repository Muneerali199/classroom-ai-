import ProfileForm from '@/components/profile-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { User, Settings, Shield, Bell } from 'lucide-react';

export default function ProfilePage() {
  const t = useTranslations('ProfilePage');

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #e3e3e3 0%, #d6d6d6 100%)'
    }}>
      {/* Floating neumorphic elements */}
      <div className="fixed top-20 right-10 w-16 h-16 rounded-full pointer-events-none z-0 neumorphic-floating opacity-60" />
      <div className="fixed bottom-40 left-16 w-12 h-12 rounded-full pointer-events-none z-0 neumorphic-floating opacity-40" style={{ animationDelay: '2s' }} />
      <div className="fixed top-1/2 right-1/4 w-8 h-8 rounded-full pointer-events-none z-0 neumorphic-floating opacity-30" style={{ animationDelay: '4s' }} />

      <div className="container-modern section-padding space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="neumorphic-card p-6 lg:p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 neumorphic-sm-inset rounded-2xl text-gray-600">
                  <User className="h-6 w-6" />
                </div>
                <h1 className="text-3xl font-bold font-headline tracking-tight text-gray-700">
                  {t('title')}
                </h1>
              </div>
              <p className="text-gray-600 text-responsive-sm max-w-2xl text-balance">
                {t('description')}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="neumorphic-badge px-4 py-2 rounded-xl text-sm font-medium">
                <Settings className="w-4 h-4 mr-2 inline" />
                Profile Settings
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="neumorphic-card p-2"
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 neumorphic-sm-inset rounded-xl text-gray-600">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-700">{t('cardTitle')}</h2>
                <p className="text-sm text-gray-600">{t('cardDescription')}</p>
              </div>
            </div>
            <ProfileForm />
          </div>
        </motion.div>

        {/* Additional Profile Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid gap-6 lg:grid-cols-2"
        >
          {/* Notification Preferences */}
          <div className="neumorphic-card p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 neumorphic-sm-inset rounded-xl text-gray-600">
                <Bell className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Notification Preferences</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Manage how you receive notifications about your account and activities.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 neumorphic-sm-inset rounded-xl">
                <span className="text-sm text-gray-600">Email Notifications</span>
                <div className="w-12 h-6 neumorphic-sm-inset rounded-full relative">
                  <div className="w-5 h-5 neumorphic-sm rounded-full absolute top-0.5 left-0.5 bg-green-500"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 neumorphic-sm-inset rounded-xl">
                <span className="text-sm text-gray-600">Push Notifications</span>
                <div className="w-12 h-6 neumorphic-sm-inset rounded-full relative">
                  <div className="w-5 h-5 neumorphic-sm rounded-full absolute top-0.5 right-0.5 bg-gray-400"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="neumorphic-card p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 neumorphic-sm-inset rounded-xl text-gray-600">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Account Security</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Keep your account secure with these recommended settings.
            </p>
            <div className="space-y-3">
              <div className="p-3 neumorphic-sm-inset rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Password Strength</span>
                  <span className="text-xs text-green-600 font-medium">Strong</span>
                </div>
                <div className="w-full h-2 neumorphic-sm-inset rounded-full">
                  <div className="w-4/5 h-full neumorphic-sm rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="p-3 neumorphic-sm-inset rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Two-Factor Authentication</span>
                  <span className="text-xs text-orange-600 font-medium">Not Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
