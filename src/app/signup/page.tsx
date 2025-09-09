import Link from 'next/link';
import SignUpForm from './signup-form';
import { Logo } from '@/components/icons';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <div className="w-full max-w-md rounded-lg border bg-background p-8 shadow-sm">
        <div className="mb-8 flex justify-center">
             <div className="flex items-center gap-2">
                <Logo className="size-8 text-primary" />
                <span className="text-2xl font-bold">EduTrack</span>
            </div>
        </div>
        <h1 className="mb-1 text-2xl font-bold">Create an account</h1>
        <p className="mb-6 text-muted-foreground">
          Enter your details below to start using EduTrack.
        </p>
        <SignUpForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
