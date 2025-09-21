import ProfileForm from '@/components/profile-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from 'next-intl';
import { User, Settings, Shield, Bell } from 'lucide-react';

export default function ProfilePage() {
  const t = useTranslations('ProfilePage');

  return (
    <div 
      className="min-h-screen p-6"
      style={{
        background: 'linear-gradient(135deg, #e3e3e3 0%, #d6d6d6 100%)'
      }}
    >
      {/* Floating neumorphic elements */}
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

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="neumorphic-card p-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 neumorphic-sm-inset rounded-2xl">
                <User className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight text-gray-700">
                  {t('title')}
                </h1>
                <p className="text-gray-600 mt-2">
                  {t('description')}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 ml-auto">
              <div className="neumorphic-badge px-4 py-2 text-sm font-medium text-gray-700">
                <Settings className="w-4 h-4 mr-2 inline" />
                Account Settings
              </div>
              <div className="neumorphic-badge px-4 py-2 text-sm font-medium text-gray-700">
                <Shield className="w-4 h-4 mr-2 inline" />
                Privacy & Security
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form Section */}
        <div className="neumorphic-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 neumorphic-sm-inset rounded-xl text-gray-600">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">{t('cardTitle')}</h2>
              <p className="text-sm text-gray-600">{t('cardDescription')}</p>
            </div>
          </div>
          <ProfileForm />
        </div>

        {/* Additional Settings Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="neumorphic-card p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 neumorphic-sm-inset rounded-xl text-gray-600">
                <Bell className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Notifications</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Manage your notification preferences and communication settings.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email Notifications</span>
                <div className="neumorphic-toggle w-12 h-6 rounded-full relative cursor-pointer">
                  <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Push Notifications</span>
                <div className="neumorphic-toggle w-12 h-6 rounded-full relative cursor-pointer">
                  <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="neumorphic-card p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 neumorphic-sm-inset rounded-xl text-gray-600">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Security</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Keep your account secure with these security options.
            </p>
            <div className="space-y-3">
              <button className="w-full neumorphic-button px-4 py-2 text-sm font-medium text-gray-700 text-left">
                Change Password
              </button>
              <button className="w-full neumorphic-button px-4 py-2 text-sm font-medium text-gray-700 text-left">
                Two-Factor Authentication
              </button>
              <button className="w-full neumorphic-button px-4 py-2 text-sm font-medium text-gray-700 text-left">
                Login Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
