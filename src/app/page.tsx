import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { CheckCircle2, BotMessageSquare, BarChart3, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 flex items-center">
            <Logo className="mr-2 size-6" />
            <span className="font-bold">EduTrack</span>
          </div>
          <div className="flex flex-1 items-center space-x-2 justify-end">
            <ThemeToggle />
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
        <section className="py-24 md:py-32 lg:py-40">
          <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
            <div className="flex flex-col items-start gap-6">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                The Future of Classroom Management is Here
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                EduTrack streamlines attendance, provides AI-driven insights, and empowers educators to create a more engaging learning environment.
              </p>
              <div className="flex items-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Get Started Free <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="rounded-xl bg-muted p-4 shadow-lg ring-1 ring-border/20">
                 <Image
                    src="https://picsum.photos/800/600"
                    width={800}
                    height={600}
                    alt="EduTrack Dashboard"
                    className="aspect-video w-full overflow-hidden rounded-lg object-cover"
                    data-ai-hint="dashboard analytics"
                />
            </div>
          </div>
        </section>

        <section id="features" className="bg-muted py-24 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold md:text-4xl">Why EduTrack?</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to manage your classroom effectively.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-8 text-center shadow-sm">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <CheckCircle2 className="size-6" />
                </div>
                <h3 className="text-xl font-bold">Effortless Attendance</h3>
                <p className="text-muted-foreground">
                  Mark attendance in seconds with our intuitive interface. Ditch the paper and save valuable time.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-8 text-center shadow-sm">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <BotMessageSquare className="size-6" />
                </div>
                <h3 className="text-xl font-bold">AI-Powered Insights</h3>
                <p className="text-muted-foreground">
                  Automatically generate attendance summaries to identify trends and support students who need it most.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-8 text-center shadow-sm">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <BarChart3 className="size-6" />
                </div>
                <h3 className="text-xl font-bold">Data-Driven Decisions</h3>
                <p className="text-muted-foreground">
                  Visualize classroom data with clear, concise dashboards. Make informed decisions to improve student outcomes.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-24 md:py-32">
            <div className="container text-center">
                 <h2 className="text-3xl font-bold md:text-4xl">Ready to Transform Your Classroom?</h2>
                 <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                    Join hundreds of educators who are already using EduTrack to create a more efficient and supportive learning environment.
                 </p>
                 <div className="mt-8">
                     <Button size="lg" asChild>
                         <Link href="/signup">Start Your Free Trial Today</Link>
                     </Button>
                 </div>
            </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EduTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
