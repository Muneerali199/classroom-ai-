
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { CheckCircle2, BotMessageSquare, BarChart3, ArrowRight, Github, Twitter, Linkedin, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const teamMembers = [
  {
    name: 'Muneer Ali',
    role: 'Lead Developer',
    avatar: 'https://picsum.photos/200/200?random=1',
    socials: {
      twitter: '#',
      linkedin: 'https://www.linkedin.com/in/muneer-ali/',
      github: 'https://github.com/Muneerali199/',
    },
    dataAiHint: 'person portrait',
  },
  {
    name: 'Samantha Lee',
    role: 'UX/UI Designer',
    avatar: 'https://picsum.photos/200/200?random=2',
    socials: {
      twitter: '#',
      linkedin: '#',
      github: '#',
    },
    dataAiHint: 'person portrait',
  },
  {
    name: 'Michael Chen',
    role: 'AI Specialist',
    avatar: 'https://picsum.photos/200/200?random=3',
    socials: {
      twitter: '#',
      linkedin: '#',
      github: '#',
    },
    dataAiHint: 'person portrait',
  },
];

const techStack = [
  { name: 'Next.js', description: 'React Framework' },
  { name: 'React', description: 'UI Library' },
  { name: 'Tailwind CSS', description: 'CSS Framework' },
  { name: 'ShadCN UI', description: 'Component Library' },
  { name: 'Firebase', description: 'Backend Platform' },
  { name: 'Genkit', description: 'AI Framework' },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-7xl items-center">
          <Link href="/" className="mr-6 flex items-center">
            <Logo className="mr-2 size-6" />
            <span className="font-bold">EduTrack</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href="#features" className="text-muted-foreground transition-colors hover:text-foreground">Features</Link>
            <Link href="#about" className="text-muted-foreground transition-colors hover:text-foreground">About</Link>
            <Link href="#team" className="text-muted-foreground transition-colors hover:text-foreground">Team</Link>
            <Link href="#tech-stack" className="text-muted-foreground transition-colors hover:text-foreground">Tech Stack</Link>
          </nav>
          <div className="flex flex-1 items-center justify-end gap-2">
            <ThemeToggle />
            <div className="hidden items-center gap-2 md:flex">
                <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                </Button>
            </div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <div className="grid gap-6 p-6">
                         <Link href="/" className="flex items-center">
                            <Logo className="mr-2 size-6" />
                            <span className="font-bold">EduTrack</span>
                        </Link>
                        <nav className="grid gap-4">
                            <Link href="#features" className="py-2 text-muted-foreground transition-colors hover:text-foreground">Features</Link>
                            <Link href="#about" className="py-2 text-muted-foreground transition-colors hover:text-foreground">About</Link>
                            <Link href="#team" className="py-2 text-muted-foreground transition-colors hover:text-foreground">Team</Link>
                            <Link href="#tech-stack" className="py-2 text-muted-foreground transition-colors hover:text-foreground">Tech Stack</Link>
                        </nav>
                        <div className="flex flex-col gap-2">
                            <Button variant="ghost" asChild><Link href="/login">Login</Link></Button>
                            <Button asChild><Link href="/signup">Sign Up</Link></Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32 lg:py-40">
          <div className="container grid max-w-7xl items-center gap-12 px-4 text-center md:px-6 lg:grid-cols-2 lg:gap-24 lg:text-left">
            <div className="flex flex-col items-center gap-6 lg:items-start">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                The Future of Classroom Management
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                EduTrack streamlines attendance, provides AI-driven insights, and empowers educators to create a more engaging learning environment.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Get Started Free <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                    <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-full min-h-[300px] w-full lg:min-h-[400px]">
                <Image
                    src="https://picsum.photos/1200/800"
                    fill
                    alt="EduTrack Dashboard"
                    className="rounded-xl object-cover shadow-2xl"
                    data-ai-hint="dashboard analytics"
                />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-muted py-24 md:py-32">
          <div className="container max-w-7xl px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
                <p className="text-lg font-semibold text-primary">Features</p>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why EduTrack?</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Everything you need to manage your classroom effectively.
                </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-8 text-center shadow-sm transition-transform hover:scale-105 hover:shadow-lg">
                <div className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <CheckCircle2 className="size-7" />
                </div>
                <h3 className="text-xl font-bold">Effortless Attendance</h3>
                <p className="text-muted-foreground">
                  Mark attendance in seconds with our intuitive interface. Ditch the paper and save valuable time.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-8 text-center shadow-sm transition-transform hover:scale-105 hover:shadow-lg">
                <div className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <BotMessageSquare className="size-7" />
                </div>
                <h3 className="text-xl font-bold">AI-Powered Insights</h3>
                <p className="text-muted-foreground">
                  Automatically generate attendance summaries to identify trends and support students who need it most.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-8 text-center shadow-sm transition-transform hover:scale-105 hover:shadow-lg">
                <div className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <BarChart3 className="size-7" />
                </div>
                <h3 className="text-xl font-bold">Data-Driven Decisions</h3>
                <p className="text-muted-foreground">
                  Visualize classroom data with clear, concise dashboards. Make informed decisions to improve student outcomes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 md:py-32">
            <div className="container grid max-w-7xl items-center gap-12 px-4 md:px-6 lg:grid-cols-2 lg:gap-24">
                <div className="relative h-full min-h-[300px] w-full lg:min-h-[400px]">
                    <Image
                        src="https://picsum.photos/1200/800?random=4"
                        fill
                        alt="Collaborative classroom"
                        className="rounded-xl object-cover shadow-lg"
                        data-ai-hint="classroom collaboration"
                    />
                </div>
                <div className="flex flex-col gap-6">
                    <p className="text-lg font-semibold text-primary">About Us</p>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Empowering Educators Through Technology</h2>
                    <p className="text-lg text-muted-foreground">
                        EduTrack was born from a simple idea: to give teachers more time to teach. We believe that by simplifying administrative tasks and providing powerful, easy-to-understand insights, we can help educators focus on what truly matters—student success. Our mission is to build intuitive tools that create a more efficient, engaging, and supportive learning environment for everyone.
                    </p>
                </div>
            </div>
        </section>

        {/* Team Section */}
        <section id="team" className="bg-muted py-24 md:py-32">
            <div className="container max-w-7xl px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-lg font-semibold text-primary">Our Team</p>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">The Minds Behind EduTrack</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        We're a passionate group of developers, designers, and educators dedicated to improving the world of education.
                    </p>
                </div>
                <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {teamMembers.map((member) => (
                        <div key={member.name} className="flex flex-col items-center text-center">
                            <Image
                                src={member.avatar}
                                width={128}
                                height={128}
                                alt={member.name}
                                className="size-32 rounded-full object-cover shadow-md"
                                data-ai-hint={member.dataAiHint}
                            />
                            <h3 className="mt-4 text-xl font-bold">{member.name}</h3>
                            <p className="text-primary">{member.role}</p>
                            <div className="mt-2 flex gap-4">
                                <Link href={member.socials.twitter} className="text-muted-foreground hover:text-foreground"><Twitter /></Link>
                                <Link href={member.socials.linkedin} className="text-muted-foreground hover:text-foreground"><Linkedin /></Link>
                                <Link href={member.socials.github} className="text-muted-foreground hover:text-foreground"><Github /></Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Tech Stack Section */}
        <section id="tech-stack" className="py-24 md:py-32">
             <div className="container max-w-7xl px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-lg font-semibold text-primary">Technology</p>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Built With the Best</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        We use a modern, scalable, and reliable tech stack to deliver a seamless experience.
                    </p>
                </div>
                <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
                    {techStack.map((tech) => (
                        <div key={tech.name} className="flex flex-col items-center justify-center gap-2 rounded-lg border bg-card p-6 text-center shadow-sm">
                            <h3 className="text-lg font-bold">{tech.name}</h3>
                            <p className="text-sm text-muted-foreground">{tech.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-24 md:py-32">
            <div className="container max-w-7xl text-center">
                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Transform Your Classroom?</h2>
                 <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
                    Join hundreds of educators who are already using EduTrack to create a more efficient and supportive learning environment.
                 </p>
                 <div className="mt-8">
                     <Button size="lg" variant="secondary" asChild>
                         <Link href="/signup">Start Your Free Trial Today</Link>
                     </Button>
                 </div>
            </div>
        </section>
      </main>
      <footer className="border-t py-8">
        <div className="container flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
                <Logo className="size-5" />
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} EduTrack. All rights reserved.
                </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
                <Link href="#" className="hover:text-foreground">Terms of Service</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
