
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Logo className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                EduTrack
            </span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Login
          </Link>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                Revolutionize Your Classroom Management
            </h1>
            <p className="text-lg text-gray-300">
                EduTrack provides smart tools for curriculum planning, activity tracking, and automated attendance.
                Focus on what matters most: teaching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                    <Link href="/signup">Get Started for Free</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-white/20 hover:bg-white/10">
                    Learn More
                </Button>
            </div>
        </div>
      </main>
      <footer className="flex items-center justify-center p-6 text-sm text-gray-400">
        © {new Date().getFullYear()} EduTrack. All rights reserved.
      </footer>
    </div>
  );
}
