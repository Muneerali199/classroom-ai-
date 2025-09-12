
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  Play,
  Users,
  BookOpen,
  BarChart3,
  Shield,
  Smartphone,
  Database,
  Cloud,
  Zap,
  CheckCircle,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
} from 'lucide-react';
import { Logo } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollYValue, setScrollYValue] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollYValue(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure Authentication',
      description:
        'Role-based access control with Firebase Auth ensuring data security for students, teachers, and administrators.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Curriculum Management',
      description:
        'Comprehensive tools to create, update, and track curriculum activities with real-time progress monitoring.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Smart Attendance',
      description:
        'Effortlessly mark attendance in seconds with our intuitive interface. Ditch the paper and save valuable time.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'AI-Powered Insights',
      description:
        'Automatically generate attendance summaries to identify trends and support students who need it most.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Mobile First',
      description:
        'Fully responsive design ensures a seamless experience on any device, from desktops to smartphones.',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Real-time Updates',
      description:
        'Track student attendance in real-time, with instant data synchronization across all devices.',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  const techStack = [
    { name: 'Next.js', category: 'Web Framework', color: 'bg-gray-900' },
    { name: 'React', category: 'UI Library', color: 'bg-blue-500' },
    { name: 'Firebase', category: 'Backend & Auth', color: 'bg-orange-500' },
    { name: 'Genkit', category: 'AI Framework', color: 'bg-emerald-500' },
    { name: 'TypeScript', category: 'Language', color: 'bg-blue-600' },
    { name: 'Tailwind CSS', category: 'Styling', color: 'bg-cyan-500' },
    { name: 'ShadCN UI', category: 'Component Library', color: 'bg-indigo-600' },
  ];

  const team = [
    {
      name: 'Muneer Ali',
      role: 'Lead Developer',
      image: 'https://picsum.photos/seed/muneer/200/200',
      dataAiHint: 'person portrait',
      bio: 'Full-stack developer specializing in Next.js and AI integration for educational technology.',
      social: {
        github: 'https://github.com/Muneerali199/',
        linkedin: 'https://www.linkedin.com/in/muneer-ali/',
        email: 'alimuneerali245@gmail.com',
      },
    },
    {
      name: 'Jayant Bansal',
      role: 'UX/UI Designer',
      image: 'https://picsum.photos/seed/samantha/200/200',
      dataAiHint: 'person portrait',
      bio: 'Creative designer passionate about crafting intuitive, user-friendly interfaces that elevate modern applications and enhance digital experiences.',
      social: { github: 'https://github.com/jayant233', linkedin: 'https://www.linkedin.com/in/jayant-bansal-0934b1271?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', email: 'bjayant231@gmail.com' },
    },
    {
      name: 'Akshay Jain',
      role: 'Frontend developer',
      image: 'https://picsum.photos/seed/michael/200/200',
      dataAiHint: 'person portrait',
      bio: 'Frontend engineer skilled in React and modern JavaScript, bringing engaging and responsive user interfaces to life with a focus on performance.',
      social: { github: 'https://github.com/Akshay1267', linkedin: 'https://www.linkedin.com/in/akshay-jain-8816252a5?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', email: 'akshay.jain9568@gmail.com' },
    },
    {
      name: 'Aveek',
      role: 'Backend developer',
      image: 'https://picsum.photos/seed/david/200/200',
      dataAiHint: 'person portrait',
      bio: 'Backend developer focused on building secure, efficient APIs and optimizing databases to ensure seamless performance at scale.',
      social: { github: 'https://github.com/Aveek29', linkedin: 'https://www.linkedin.com/in/aveek-patel-473996327?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', email: 'aveekpatel@gmail.com' },
    },
    {
      name: 'Amisha jindal',
      role: 'Marketing research',
      image: 'https://picsum.photos/seed/david/200/200',
      dataAiHint: 'person portrait',
      bio: 'Marketing researcher dedicated to analyzing trends and user needs, providing data-driven insights to shape product strategies and growth.',
      social: { github: 'https://github.com/Amisha0405', linkedin: 'https://www.linkedin.com/in/amisha-jindal-396ba62a1?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', email: 'amishajindal4@gmail.com' },
    },
    {
      name: 'Khushi ',
      role: 'tester',
      image: 'https://picsum.photos/seed/david/200/200',
      dataAiHint: 'person portrait',
      bio: 'Quality assurance tester ensuring product reliability and seamless user experience through meticulous testing and bug reporting.',
      social: { github: '#', linkedin: '#', email: 'david@edutrack.com' },
    },
  ];
  
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen text-gray-900 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 dark:text-white overflow-x-hidden transition-all duration-500">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/20 dark:bg-black/20 backdrop-blur-lg border-b border-gray-200/20 dark:border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Logo className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduTrack
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {['home', 'about', 'features', 'tech-stack', 'team'].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className="capitalize hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
                  >
                    {item.replace('-', ' ')}
                  </button>
                )
              )}
               <ThemeToggle />
               <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
                <ThemeToggle />
                <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-gray-900/10 dark:bg-white/10 backdrop-blur-sm"
                >
                {isMenuOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <Menu className="w-6 h-6" />
                )}
                </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/40 dark:bg-black/40 backdrop-blur-lg border-t border-gray-200/20 dark:border-white/10">
            <div className="px-4 py-2 space-y-2">
              {['home', 'about', 'features', 'tech-stack', 'team'].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className="capitalize block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-900/10 dark:hover:bg-white/10 transition-colors duration-200"
                  >
                    {item.replace('-', ' ')}
                  </button>
                )
              )}
              <div className="border-t border-white/10 pt-2 flex flex-col gap-2">
                <Button variant="ghost" asChild className="w-full">
                    <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="w-full">
                    <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400/20 dark:bg-purple-500/30 rounded-full blur-3xl animate-pulse transition-all duration-500"
            style={{
              transform: `translate3d(${scrollYValue * 0.1}px, ${
                scrollYValue * 0.1
              }px, 0)`,
            }}
          />
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/30 rounded-full blur-3xl animate-pulse transition-all duration-500"
            style={{
              transform: `translate3d(${-scrollYValue * 0.1}px, ${
                -scrollYValue * 0.1
              }px, 0)`,
              animationDelay: '1s',
            }}
          />
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 backdrop-blur-sm border border-gray-300/30 dark:border-white/20 mb-6 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto transform hover:scale-110 transition-transform duration-300">
                <Logo className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              EduTrack
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">Activity & Attendance</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            A mobile-first platform designed for educational institutions to
            manage curriculum activities, monitor student progress, and track
            attendance seamlessly with real-time analytics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="group" asChild>
                <Link href="/signup">
                Get Started Free <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-gray-900/10 dark:bg-white/10 border-gray-300/30 dark:border-white/20 hover:bg-gray-900/20 dark:hover:bg-white/20">
                <Play className="mr-2"/>
                Watch Demo
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>99.9%+ Uptime</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Real-time Sync</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Secure & Scalable</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => scrollToSection('about')}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <ChevronDown className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </button>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-white/30 dark:bg-black/20 backdrop-blur-sm transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                About Our Platform
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing educational management with cutting-edge
              technology, real-time analytics, and seamless user experience.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Our Mission
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  We're building the future of educational technology by
                  providing institutions with powerful tools to manage
                  curriculum activities, track student progress, and streamline
                  attendance management through intelligent automation.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 border border-gray-300/20 dark:border-white/10 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">For Everyone</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Students, teachers, and administrators all benefit from our
                    intuitive platform.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/10 border border-gray-300/20 dark:border-white/10 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                    Lightning Fast
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Attendance marked in seconds with real-time
                    synchronization.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 p-8 rounded-3xl bg-gradient-to-br from-gray-900/5 to-gray-900/10 dark:from-white/10 dark:to-white/5 backdrop-blur-sm border border-gray-300/30 dark:border-white/20 transition-all duration-300">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Active Users
                    </span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                      50K+
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Institutions
                    </span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                      200+
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20">
                    <span className="font-medium text-gray-900 dark:text-white">Uptime</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                      99.9%
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-500/30 dark:to-purple-500/30 rounded-full blur-2xl transition-all duration-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive tools designed to streamline educational
              management and enhance learning outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-3xl bg-gradient-to-br from-gray-900/5 to-gray-900/10 dark:from-white/5 dark:to-white/10 backdrop-blur-sm border border-gray-300/20 dark:border-white/10 hover:border-gray-300/40 dark:hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section
        id="tech-stack"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-white/30 dark:bg-black/20 backdrop-blur-sm transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                Our Tech Stack
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Built with cutting-edge technologies for maximum performance,
              scalability, and developer experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-gradient-to-br from-gray-900/5 to-gray-900/10 dark:from-white/5 dark:to-white/10 backdrop-blur-sm border border-gray-300/20 dark:border-white/10 hover:border-gray-300/40 dark:hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105 text-center"
              >
                <div
                  className={`w-12 h-12 ${tech.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-blue-600 dark:group-hover:from-green-400 dark:group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                  {tech.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{tech.category}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-gray-900/5 to-gray-900/10 dark:from-white/5 dark:to-white/10 backdrop-blur-sm border border-gray-300/20 dark:border-white/10 transition-all duration-300">
            <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Architecture Highlights
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Cloud className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Cloud-Native</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Fully serverless architecture with Firebase and Genkit.
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  Enterprise Security
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  End-to-end encryption with role-based access control.
                </p>
              </div>
              <div className="text-center">
                <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  Real-time Performance
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Sub-second response times with optimized data
                  synchronization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                Meet Our Team
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A passionate team of developers and designers dedicated to
              transforming educational technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="group text-center p-8 rounded-3xl bg-gradient-to-br from-gray-900/5 to-gray-900/10 dark:from-white/5 dark:to-white/10 backdrop-blur-sm border border-gray-300/20 dark:border-white/10 hover:border-gray-300/40 dark:hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="relative mb-6">
                  <Image
                    src={member.image}
                    width={96}
                    height={96}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gray-300/30 dark:border-white/20 group-hover:border-gray-300/60 dark:group-hover:border-white/40 transition-all duration-300"
                    data-ai-hint="person portrait"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 dark:group-hover:from-pink-400 dark:group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                  {member.name}
                </h3>
                <p className="text-blue-500 dark:text-blue-400 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {member.bio}
                </p>

                <div className="flex justify-center space-x-4">
                  <a
                    href={member.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-900/10 dark:bg-white/10 hover:bg-gray-900/20 dark:hover:bg-white/20 transition-colors duration-200"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-900/10 dark:bg-white/10 hover:bg-gray-900/20 dark:hover:bg-white/20 transition-colors duration-200"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={`mailto:${member.social.email}`}
                    className="p-2 rounded-lg bg-gray-900/10 dark:bg-white/10 hover:bg-gray-900/20 dark:hover:bg-white/20 transition-colors duration-200"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-600/20 dark:to-purple-600/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Ready to Transform Your Institution?
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of educational institutions already using EduTrack to
            streamline their operations and improve student outcomes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button size="lg" asChild>
                <Link href="/signup">
                    Get Started Free
                </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-gray-900/10 dark:bg-white/10 border-gray-300/30 dark:border-white/20 hover:bg-gray-900/20 dark:hover:bg-white/20">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white/40 dark:bg-black/40 backdrop-blur-sm border-t border-gray-200/20 dark:border-white/10 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Logo className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  EduTrack
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                Revolutionizing educational management with intelligent
                automation, real-time analytics, and seamless user experience.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-6">Product</h3>
              <div className="space-y-3">
                <button onClick={() => scrollToSection('features')} className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                  Features
                </button>
                <button className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                  Pricing
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-6">Company</h3>
              <div className="space-y-3">
                <button onClick={() => scrollToSection('about')} className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                  About
                </button>
                <button onClick={() => scrollToSection('team')} className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                  Team
                </button>
                <button onClick={() => scrollToSection('contact')} className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                  Contact
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200/20 dark:border-white/10 mt-12 pt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} EduTrack. All rights reserved. Built
              with ❤️ for education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

    