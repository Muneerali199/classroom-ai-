
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Users,
  Calendar,
  BarChart3,
  Shield,
  BotMessageSquare,
  CheckCircle,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Zap,
  Layers,
  Code2,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { Logo } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'features', 'tech-stack', 'team'];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLink = ({ section }: { section: string }) => (
    <a
      href={`#${section}`}
      onClick={(e) => {
        e.preventDefault();
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      }}
      className={`capitalize transition-colors duration-200 text-sm font-medium ${
        activeSection === section
          ? 'text-primary'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {section.replace('-', ' ')}
    </a>
  );

  const features = [
    {
      icon: Shield,
      title: 'Secure Authentication',
      description:
        'Role-based access control with Firebase Auth ensuring data security for students, teachers, and administrators.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Calendar,
      title: 'Smart Attendance',
      description:
        'Effortlessly mark attendance in seconds with our intuitive interface. Ditch the paper and save valuable time.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: BotMessageSquare,
      title: 'AI-Powered Insights',
      description:
        'Automatically generate attendance summaries to identify trends and support students who need it most.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description:
        'Visualize classroom data with clear, concise dashboards. Make informed decisions to improve student outcomes.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Users,
      title: 'User Role Management',
      description:
        'Implement role-based access control to restrict access to features based on user roles.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description:
        'Track student attendance in real-time, with instant data synchronization across all devices.',
      color: 'from-teal-500 to-cyan-500',
    },
  ];

  const techStack = [
    {
      category: 'Framework',
      icon: Layers,
      technologies: [
        { name: 'Next.js', description: 'The React Framework for the Web' },
        { name: 'React', description: 'A library for building user interfaces' },
      ],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      category: 'Styling',
      icon: Code2,
      technologies: [
        { name: 'Tailwind CSS', description: 'A utility-first CSS framework' },
        { name: 'ShadCN UI', description: 'Beautifully designed components' },
      ],
      color: 'from-purple-500 to-pink-500',
    },
    {
      category: 'Backend & AI',
      icon: Zap,
      technologies: [
        { name: 'Firebase', description: 'Authentication and backend services' },
        { name: 'Genkit', description: 'The AI Framework for JavaScript/TypeScript' },
      ],
      color: 'from-green-500 to-emerald-500',
    },
    {
      category: 'Language',
      icon: Code2,
      technologies: [{ name: 'TypeScript', description: 'JavaScript with syntax for types' }],
      color: 'from-orange-500 to-red-500',
    },
  ];

  const teamMembers = [
    {
      name: 'Muneer Ali',
      role: 'Lead Developer',
      image: 'https://picsum.photos/200/200?random=1',
      dataAiHint: 'person portrait',
      bio: 'Full-stack developer specializing in Next.js and AI integration for educational technology.',
      skills: ['Next.js', 'React', 'Firebase', 'Genkit', 'AI'],
      social: {
        github: 'https://github.com/Muneerali199/',
        linkedin: 'https://www.linkedin.com/in/muneer-ali/',
        email: 'muneer@edutrack.com',
      },
    },
    {
      name: 'Samantha Lee',
      role: 'UX/UI Designer',
      image: 'https://picsum.photos/200/200?random=2',
      dataAiHint: 'person portrait',
      bio: 'Creative designer focused on crafting intuitive and engaging user experiences for modern applications.',
      skills: ['UI/UX Design', 'Figma', 'User Research', 'Prototyping'],
      social: {
        github: '#',
        linkedin: '#',
        email: 'samantha@edutrack.com',
      },
    },
    {
      name: 'Michael Chen',
      role: 'AI Specialist',
      image: 'https://picsum.photos/200/200?random=3',
      dataAiHint: 'person portrait',
      bio: 'AI expert with a passion for leveraging large language models to solve real-world problems in education.',
      skills: ['Genkit', 'LLMs', 'Prompt Engineering', 'Data Science'],
      social: {
        github: '#',
        linkedin: '#',
        email: 'michael@edutrack.com',
      },
    },
  ];

  const stats = [
    { number: '99.9%', label: 'Uptime Guarantee', icon: Zap },
    { number: '<100ms', label: 'API Response Time', icon: CheckCircle },
    { number: '10x', label: 'Faster Reporting', icon: BarChart3 },
    { number: '70%', label: 'Reduced Admin Work', icon: Users },
  ];

  const Header = () => (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
          : 'bg-transparent'
      }`}
    >
      <div className="container flex h-16 max-w-7xl items-center">
        <Link href="/" className="mr-6 flex items-center">
          <Logo className="mr-2 size-6 text-primary" />
          <span className="font-bold">EduTrack</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {['home', 'about', 'features', 'tech-stack', 'team'].map((section) => (
            <NavLink key={section} section={section} />
          ))}
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
                  <Logo className="mr-2 size-6 text-primary" />
                  <span className="font-bold">EduTrack</span>
                </Link>
                <nav className="grid gap-4">
                  {['home', 'about', 'features', 'tech-stack', 'team'].map(
                    (section) => (
                      <a
                        key={section}
                        href={`#${section}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById(section)
                            ?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="py-2 capitalize text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {section.replace('-', ' ')}
                      </a>
                    )
                  )}
                </nav>
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section id="home" className="pt-24 pb-16 md:pt-32 lg:pb-24">
          <div className="container max-w-7xl px-4 text-center md:px-6">
             <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-medium mb-8">
              <CheckCircle className="w-4 h-4" />
              <span>Smart Education Management Platform</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Transform Your
              <span className="mt-2 block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Educational Experience
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
              A revolutionary curriculum management and attendance tracking system designed for modern educational institutions. Streamline activities, monitor progress, and boost engagement with real-time analytics.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Start Free Trial <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#features">Learn More</a>
              </Button>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                   <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-3">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 lg:py-24 bg-muted">
          <div className="container grid max-w-7xl items-center gap-12 px-4 md:px-6 lg:grid-cols-2 lg:gap-24">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="font-semibold text-primary">About Us</p>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Empowering Educators Through Technology
                </h2>
                <p className="text-lg text-muted-foreground">
                  EduTrack was born from a simple idea: to give teachers more time to teach. We believe that by simplifying administrative tasks and providing powerful, easy-to-understand insights, we can help educators focus on what truly matters—student success.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="size-5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">Streamlined curriculum management</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="size-5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">Real-time attendance tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="size-5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">Comprehensive analytics and reporting</span>
                </div>
              </div>
            </div>
            <div className="relative h-full min-h-[300px] w-full lg:min-h-[400px]">
              <Image
                src="https://picsum.photos/1200/800?random=4"
                fill
                alt="Collaborative classroom"
                className="rounded-xl object-cover shadow-lg"
                data-ai-hint="classroom collaboration"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 lg:py-24">
          <div className="container max-w-7xl px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-lg font-semibold text-primary">Features</p>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful Features</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Comprehensive tools designed to streamline every aspect of educational management.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="group flex flex-col gap-4 rounded-lg border bg-card p-8 text-center shadow-sm transition-transform hover:-translate-y-2 hover:shadow-lg">
                  <div className={`mx-auto flex size-14 items-center justify-center rounded-full bg-gradient-to-r ${feature.color} text-primary-foreground group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="size-7" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="tech-stack" className="py-16 lg:py-24 bg-muted">
          <div className="container max-w-7xl px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-lg font-semibold text-primary">Technology</p>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Technology Stack</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Built with cutting-edge technologies for maximum performance, scalability, and reliability.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {techStack.map((category, index) => (
                <div key={index} className="group rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                   <div className={`mb-4 inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{category.category}</h3>
                  <div className="space-y-2">
                    {category.technologies.map((tech, techIndex) => (
                      <div key={techIndex}>
                        <h4 className="font-medium text-sm">{tech.name}</h4>
                        <p className="text-xs text-muted-foreground">{tech.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="py-16 lg:py-24">
          <div className="container max-w-7xl px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-lg font-semibold text-primary">Our Team</p>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Meet Our Team</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Passionate experts dedicated to transforming education through innovative technology.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member, index) => (
                <div key={index} className="group flex flex-col items-center text-center rounded-lg border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                  <Image
                    src={member.image}
                    width={96}
                    height={96}
                    alt={member.name}
                    className="size-24 rounded-full object-cover ring-4 ring-primary/10 group-hover:ring-primary/20 transition-all"
                    data-ai-hint={member.dataAiHint}
                  />
                  <h3 className="mt-4 text-xl font-bold">{member.name}</h3>
                  <p className="text-primary">{member.role}</p>
                  <p className="mt-2 text-sm text-muted-foreground flex-1">{member.bio}</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {member.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-4 border-t w-full pt-4 justify-center">
                    <Link href={member.social.github} className="text-muted-foreground hover:text-foreground"><Github /></Link>
                    <Link href={member.social.linkedin} className="text-muted-foreground hover:text-foreground"><Linkedin /></Link>
                    <a href={`mailto:${member.social.email}`} className="text-muted-foreground hover:text-foreground"><Mail /></a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 text-primary-foreground lg:py-24">
          <div className="container max-w-4xl px-4 text-center md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">Ready to Transform Your Institution?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Join thousands of educators who have already revolutionized their teaching experience. Start your free trial today and see the difference.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Start Your Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
                <Logo className="size-5 text-primary" />
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
       <button
        onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 ${
          isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ChevronDown className="h-6 w-6 rotate-180" />
      </button>
    </div>
  );
}
