import Link from 'next/link';
import LoginForm from '@/app/login/login-form';
import { Logo } from '@/components/icons';
import { Shield, Users, BookOpen } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen text-white" style={{
      background: 'linear-gradient(180deg, #08090B 0%, #0E1317 100%)'
    }}>

      <div className="flex min-h-screen">
        {/* Left side - Branding and Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-16 h-16 bg-gray-900/50 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Logo className="size-10 text-cyan-400" />
              </div>
              <span className="text-4xl font-bold text-white">
                ClassroomAI
              </span>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 leading-tight text-white">
              AI-Powered Education
              <span className="block text-slate-300">Management System</span>
            </h1>
            
            <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-6 mb-8 backdrop-blur-sm">
              <p className="text-xl text-slate-300 leading-relaxed">
                Transform your educational institution with intelligent attendance tracking, 
                automated grading, and comprehensive analytics powered by artificial intelligence.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-900/30 border border-white/10 rounded-2xl backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300">
                <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-400/30 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI-Powered Security</h3>
                  <p className="text-sm text-slate-400">Advanced AI algorithms protect your educational data</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-900/30 border border-white/10 rounded-2xl backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300">
                <div className="w-10 h-10 bg-blue-500/20 border border-blue-400/30 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Smart Role Management</h3>
                  <p className="text-sm text-slate-400">AI-enhanced access control for all user types</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-900/30 border border-white/10 rounded-2xl backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300">
                <div className="w-10 h-10 bg-purple-500/20 border border-purple-400/30 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Intelligent Analytics</h3>
                  <p className="text-sm text-slate-400">AI-driven insights and predictive analytics</p>
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
                <div className="w-12 h-12 bg-gray-900/50 border border-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Logo className="size-7 text-cyan-400" />
                </div>
                <span className="text-3xl font-bold text-white">
                  ClassroomAI
                </span>
              </div>
            </div>
            
            <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-slate-400">
                  Sign in to access your AI-powered dashboard
                </p>
              </div>
              
              <LoginForm />
              
              <div className="mt-8 text-center space-y-4">
                <p className="text-sm text-slate-400">
                  Need an account? Contact your dean or teacher.
                </p>
                
                <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
                  <Link href="/privacy-policy" className="hover:text-cyan-400 transition-colors">
                    Privacy Policy
                  </Link>
                  <span>•</span>
                  <Link href="/terms-and-conditions" className="hover:text-cyan-400 transition-colors">
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
