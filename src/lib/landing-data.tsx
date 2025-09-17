import React from 'react';
import Image from 'next/image';
import {
  Shield,
  BookOpen,
  Users,
  BarChart3,
  Smartphone,
  Zap,
  Cloud,
  CheckCircle,
} from 'lucide-react';

export interface Feature {
  icon: React.ReactElement;
  title: string;
  description: string;
  color: string;
}

export interface TechItem {
  name: string;
  category: string;
  color: string;
  icon: React.ReactElement;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  dataAiHint: string;
  bio: string;
  social: {
    github: string;
    linkedin: string;
    email: string;
  };
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
}

export interface Stat {
  label: string;
  value: string;
  color: string;
}

export interface Benefit {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}

export interface ArchitectureHighlight {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Controlled Authentication',
    description:
      'Dean-managed account creation with no public signup. Secure role-based access control ensuring institutional data privacy.',
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

export const techStack: TechItem[] = [
  {
    name: 'Next.js',
    category: 'Web Framework',
    color: 'bg-gray-900',
    icon: <Image src="/nextjs-logo.png" alt="Next.js" width={40} height={40} className="w-full h-full object-contain" />,
  },
  {
    name: 'React',
    category: 'UI Library',
    color: 'bg-blue-500',
    icon: <Image src="/react-logo.png" alt="React" width={40} height={40} className="w-full h-full object-contain" />,
  },
  {
    name: 'Supabase',
    category: 'Backend & Auth',
    color: 'bg-green-500',
    icon: <Image src="/supabase-logo.png" alt="Supabase" width={40} height={40} className="w-full h-full object-contain" />,
  },
  {
    name: 'Genkit',
    category: 'AI Framework',
    color: 'bg-emerald-500',
    icon: <Image src="/genkit-logo.png" alt="Genkit" width={40} height={40} className="w-full h-full object-contain" />,
  },
  {
    name: 'TypeScript',
    category: 'Language',
    color: 'bg-blue-600',
    icon: <Image src="/typescript-logo.png" alt="TypeScript" width={40} height={40} className="w-full h-full object-contain" />,
  },
  {
    name: 'Tailwind CSS',
    category: 'Styling',
    color: 'bg-cyan-500',
    icon: <Image src="/tailwind-logo.png" alt="Tailwind CSS" width={40} height={40} className="w-full h-full object-contain" />,
  },
  {
    name: 'ShadCN UI',
    category: 'Component Library',
    color: 'bg-indigo-600',
    icon: <Image src="/shadcn-logo.png" alt="ShadCN UI" width={40} height={40} className="w-full h-full object-contain" />,
  },
];

export const team: TeamMember[] = [];

export const testimonials: Testimonial[] = [];

export const stats: Stat[] = [];

export const benefits: Benefit[] = [
  { icon: CheckCircle, text: "99.9%+ Uptime" },
  { icon: CheckCircle, text: "Institution Managed" },
  { icon: CheckCircle, text: "Role-Based Access" },
];

export const architectureHighlights: ArchitectureHighlight[] = [
  {
    icon: Cloud,
    title: 'Cloud-Native',
    description: 'Fully serverless architecture with Supabase and Genkit.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'End-to-end encryption with role-based access control.',
  },
  {
    icon: Zap,
    title: 'Real-time Performance',
    description: 'Sub-second response times with optimized data synchronization.',
  },
];
