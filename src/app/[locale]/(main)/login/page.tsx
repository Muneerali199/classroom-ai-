import Link from 'next/link';
import LoginForm from '@/app/login/login-form';
import { Logo } from '@/components/icons';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/20 p-8 shadow-2xl backdrop-blur-lg">
        <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Logo className="size-7 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    EduTrack
                </span>
            </div>
        </div>
        <div className="text-center">
            <h1 className="mb-1 text-2xl font-bold">Welcome Back</h1>
            <p className="mb-6 text-gray-300">
            Enter your credentials to access your dashboard.
            </p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-gray-400">
          Need an account? Contact your dean or teacher.
        </p>
      </div>
    </div>
  );
}
