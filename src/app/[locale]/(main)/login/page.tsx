import Link from 'next/link';
import LoginForm from '@/app/login/login-form';
import { Logo } from '@/components/icons';
import { Shield, Users, BookOpen } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      {/* Left side - Branding and Features */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 text-white">
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Logo className="size-10 text-white" />
            </div>
            <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              EduTrack
            </span>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Smart Attendance
            <span className="block text-blue-400">Management</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Revolutionize your educational institution with AI-powered attendance tracking, 
            real-time analytics, and seamless user management.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold">Secure & Reliable</h3>
                <p className="text-sm text-gray-400">Enterprise-grade security for your data</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold">Multi-Role Support</h3>
                <p className="text-sm text-gray-400">Students, teachers, and administrators</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold">Real-time Analytics</h3>
                <p className="text-sm text-gray-400">Instant insights and comprehensive reports</p>
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Logo className="size-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                EduTrack
              </span>
            </div>
          </div>
          
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-gray-300">
                Sign in to access your personalized dashboard
              </p>
            </div>
            
            <LoginForm />
            
            <div className="mt-8 text-center space-y-4">
              <p className="text-sm text-gray-400">
                Need an account? Contact your dean or teacher.
              </p>
              
              <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                <Link href="/privacy-policy" className="hover:text-gray-300 transition-colors">
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link href="/terms-and-conditions" className="hover:text-gray-300 transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
