import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <Logo className="mr-2 size-6" />
            <span className="font-bold">EduTrack</span>
          </div>
          <nav className="flex flex-1 items-center space-x-4">
            {/* You can add more nav links here */}
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Smart Attendance Tracking for Modern Classrooms
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Effortlessly manage student attendance, gain valuable insights with AI-powered summaries, and focus on what truly matters - teaching.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="bg-secondary py-20 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold md:text-4xl">Why EduTrack?</h2>
              <p className="mt-4 text-muted-foreground">
                Discover the features that make EduTrack the best choice for your school.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Easy Attendance Marking</h3>
                <p className="mt-2 text-muted-foreground">
                    A simple and intuitive interface for taking attendance in seconds. No more paper records.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">AI-Powered Summaries</h3>
                <p className="mt-2 text-muted-foreground">
                    Instantly generate insightful summaries of student attendance patterns to identify at-risk students.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Secure and Reliable</h3>
                <p className="mt-2 text-muted-foreground">
                    Built on a robust and secure platform, ensuring your data is always safe and accessible.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 md:py-32">
            <div className="container grid items-center gap-8 md:grid-cols-2">
                <div className="order-2 md:order-1">
                    <h2 className="text-3xl font-bold">Visualize Your Classroom Data</h2>
                    <p className="mt-4 text-muted-foreground">Our dashboard gives you a clear overview of attendance trends, helping you make informed decisions quickly. See who's present, absent, or late at a glance.</p>
                </div>
                <div className="order-1 md:order-2">
                    <Image src="https://picsum.photos/600/400" width={600} height={400} alt="Dashboard screenshot" className="rounded-lg shadow-lg" data-ai-hint="dashboard analytics" />
                </div>
            </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EduTrack. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
             {/* Add social links here if needed */}
          </div>
        </div>
      </footer>
    </div>
  );
}
