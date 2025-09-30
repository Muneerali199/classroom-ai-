import Link from 'next/link';
import LoginForm from '@/app/login/login-form';
import { Sparkles, Zap, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Branding and Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-8 xl:p-16">
          <div className="max-w-xl">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 animate-spin-slow" />
                <span className="text-white font-black text-xl relative z-10">CA</span>
              </div>
              <span className="text-3xl font-bold text-white">
                ClassroomAI
              </span>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl xl:text-5xl font-black mb-6 leading-[1.1]">
              <span className="text-white">Transform your </span>
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                classroom
              </span>
              <br />
              <span className="text-white">with AI</span>
            </h1>
            
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Automate attendance, grade assignments with AI, and unlock powerful insights—all in one beautiful platform.
            </p>
            
            {/* Features */}
            <div className="space-y-3">
              {[
                { icon: Sparkles, title: '10x Faster', desc: 'Save 10+ hours per week' },
                { icon: Zap, title: 'AI-Powered', desc: 'Intelligent automation' },
                { icon: TrendingUp, title: 'Data-Driven', desc: 'Real-time insights' }
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl hover:border-cyan-500/50 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm text-gray-400">{feature.desc}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden mb-6 sm:mb-8 flex justify-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 animate-spin-slow" />
                  <span className="text-white font-black text-lg sm:text-xl relative z-10">CA</span>
                </div>
                <span className="text-2xl sm:text-3xl font-bold text-white">
                  ClassroomAI
                </span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
                  Welcome Back
                </h1>
                <p className="text-sm sm:text-base text-gray-400">
                  Sign in to access your dashboard
                </p>
              </div>
              
              <LoginForm />
              
              <div className="mt-6 sm:mt-8 text-center space-y-3 sm:space-y-4">
                <p className="text-xs sm:text-sm text-gray-400">
                  Need an account? Contact your dean or teacher.
                </p>
                
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-gray-500">
                  <Link href="/privacy-policy" className="hover:text-cyan-400 transition-colors">
                    Privacy
                  </Link>
                  <span className="hidden sm:inline">•</span>
                  <Link href="/terms-and-conditions" className="hover:text-cyan-400 transition-colors">
                    Terms
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
