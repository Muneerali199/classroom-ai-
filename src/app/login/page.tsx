import Link from 'next/link';
import LoginForm from './login-form';
import { Logo } from '@/components/icons';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <div className="w-full max-w-md rounded-lg border bg-background p-8 shadow-sm">
        <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-2">
                <Logo className="size-8 text-primary" />
                <span className="text-2xl font-bold">EduTrack</span>
            </div>
        </div>
        <div className="text-center">
            <h1 className="mb-1 text-2xl font-bold">Welcome back</h1>
            <p className="mb-6 text-muted-foreground">
            Enter your email and password to sign in.
            </p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
