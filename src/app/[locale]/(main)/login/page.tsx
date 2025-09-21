import Link from 'next/link';
import LoginForm from '@/app/login/login-form';
import { Logo } from '@/components/icons';
import { Shield, Users, BookOpen } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen text-gray-700" style={{
      background: 'linear-gradient(135deg, #e3e3e3 0%, #d6d6d6 100%)'
    }}>
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

      <div className="flex min-h-screen">
        {/* Left side - Branding and Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-16 h-16 neumorphic rounded-2xl flex items-center justify-center">
                <Logo className="size-10 text-gray-600" />
              </div>
              <span className="text-4xl font-bold text-gray-700">
                EduTrack
              </span>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 leading-tight text-gray-700">
              Smart Attendance
              <span className="block text-gray-600">Management</span>
            </h1>
            
            <div className="neumorphic-inset rounded-3xl p-6 mb-8">
              <p className="text-xl text-gray-600 leading-relaxed">
                Revolutionize your educational institution with AI-powered attendance tracking, 
                real-time analytics, and seamless user management.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 neumorphic-sm rounded-2xl">
                <div className="w-10 h-10 neumorphic-sm-inset rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Secure & Reliable</h3>
                  <p className="text-sm text-gray-500">Enterprise-grade security for your data</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 neumorphic-sm rounded-2xl">
                <div className="w-10 h-10 neumorphic-sm-inset rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Multi-Role Support</h3>
                  <p className="text-sm text-gray-500">Students, teachers, and administrators</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 neumorphic-sm rounded-2xl">
                <div className="w-10 h-10 neumorphic-sm-inset rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Real-time Analytics</h3>
                  <p className="text-sm text-gray-500">Instant insights and comprehensive reports</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden mb-8 flex justify-center">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 neumorphic rounded-xl flex items-center justify-center">
                  <Logo className="size-7 text-gray-600" />
                </div>
                <span className="text-3xl font-bold text-gray-700">
                  EduTrack
                </span>
              </div>
            </div>
            
            <div className="neumorphic-card rounded-3xl p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-700 mb-2">Welcome Back</h1>
                <p className="text-gray-600">
                  Sign in to access your personalized dashboard
                </p>
              </div>
              
              <LoginForm />
              
              <div className="mt-8 text-center space-y-4">
                <p className="text-sm text-gray-500">
                  Need an account? Contact your dean or teacher.
                </p>
                
                <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                  <Link href="/privacy-policy" className="hover:text-gray-700 transition-colors">
                    Privacy Policy
                  </Link>
                  <span>•</span>
                  <Link href="/terms-and-conditions" className="hover:text-gray-700 transition-colors">
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
