import React from 'react';
import {
  Shield,
  BookOpen,
  Users,
  BarChart3,
  Smartphone,
  Zap,
  Database,
  Cloud,
  CheckCircle,
  Star,
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
    icon: React.createElement(Shield, { className: "w-8 h-8" }),
    title: 'Controlled Authentication',
    description:
      'Dean-managed account creation with no public signup. Secure role-based access control ensuring institutional data privacy.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: React.createElement(BookOpen, { className: "w-8 h-8" }),
    title: 'Curriculum Management',
    description:
      'Comprehensive tools to create, update, and track curriculum activities with real-time progress monitoring.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: React.createElement(Users, { className: "w-8 h-8" }),
    title: 'Smart Attendance',
    description:
      'Effortlessly mark attendance in seconds with our intuitive interface. Ditch the paper and save valuable time.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: React.createElement(BarChart3, { className: "w-8 h-8" }),
    title: 'AI-Powered Insights',
    description:
      'Automatically generate attendance summaries to identify trends and support students who need it most.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: React.createElement(Smartphone, { className: "w-8 h-8" }),
    title: 'Mobile First',
    description:
      'Fully responsive design ensures a seamless experience on any device, from desktops to smartphones.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: React.createElement(Zap, { className: "w-8 h-8" }),
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
    icon: React.createElement(Database, { className: "w-6 h-6 text-white" }),
  },
  {
    name: 'React',
    category: 'UI Library',
    color: 'bg-blue-500',
    icon: React.createElement(Database, { className: "w-6 h-6 text-white" }),
  },
  {
    name: 'Supabase',
    category: 'Backend & Auth',
    color: 'bg-green-500',
    icon: React.createElement(Database, { className: "w-6 h-6 text-white" }),
  },
  {
    name: 'Genkit',
    category: 'AI Framework',
    color: 'bg-emerald-500',
    icon: React.createElement(Database, { className: "w-6 h-6 text-white" }),
  },
  {
    name: 'TypeScript',
    category: 'Language',
    color: 'bg-blue-600',
    icon: React.createElement(Database, { className: "w-6 h-6 text-white" }),
  },
  {
    name: 'Tailwind CSS',
    category: 'Styling',
    color: 'bg-cyan-500',
    icon: React.createElement(Database, { className: "w-6 h-6 text-white" }),
  },
  {
    name: 'ShadCN UI',
    category: 'Component Library',
    color: 'bg-indigo-600',
    icon: React.createElement(Database, { className: "w-6 h-6 text-white" }),
  },
];

export const team: TeamMember[] = [
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
    social: {
      github: 'https://github.com/jayant233',
      linkedin: 'https://www.linkedin.com/in/jayant-bansal-0934b1271?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      email: 'bjayant231@gmail.com',
    },
  },
  {
    name: 'Akshay Jain',
    role: 'Frontend developer',
    image: 'https://picsum.photos/seed/michael/200/200',
    dataAiHint: 'person portrait',
    bio: 'Frontend engineer skilled in React and modern JavaScript, bringing engaging and responsive user interfaces to life with a focus on performance.',
    social: {
      github: 'https://github.com/Akshay1267',
      linkedin: 'https://www.linkedin.com/in/akshay-jain-8816252a5?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      email: 'akshay.jain9568@gmail.com',
    },
  },
  {
    name: 'Aveek Patel',
    role: 'Backend developer',
    image: 'https://picsum.photos/seed/david/200/200',
    dataAiHint: 'person portrait',
    bio: 'Backend developer focused on building secure, efficient APIs and optimizing databases to ensure seamless performance at scale.',
    social: {
      github: 'https://github.com/Aveek29',
      linkedin: 'https://www.linkedin.com/in/aveek-patel-473996327?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      email: 'aveekpatel@gmail.com',
    },
  },
  {
    name: 'Amisha jindal',
    role: 'Marketing research',
    image: 'https://picsum.photos/seed/david/200/200',
    dataAiHint: 'person portrait',
    bio: 'Marketing researcher dedicated to analyzing trends and user needs, providing data-driven insights to shape product strategies and growth.',
    social: {
      github: 'https://github.com/Amisha0405',
      linkedin: 'https://www.linkedin.com/in/amisha-jindal-396ba62a1?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      email: 'amishajindal4@gmail.com',
    },
  },
  {
    name: 'Khushi ',
    role: 'tester',
    image: 'https://picsum.photos/seed/david/200/200',
    dataAiHint: 'person portrait',
    bio: 'Quality assurance tester ensuring product reliability and seamless user experience through meticulous testing and bug reporting.',
    social: {
      github: '#',
      linkedin: 'https://www.linkedin.com/in/khushi-gupta-0541112b3?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      email: 'http://gikhushi.20gmail.com',
    },
  },
];

export const testimonials: Testimonial[] = [
  {
    quote: "EduTrack has revolutionized how we manage attendance. The AI insights help us identify students who need extra support before it's too late.",
    author: "Dr. Sarah Johnson",
    role: "Principal, Lincoln High School",
    avatar: "https://picsum.photos/seed/testimonial1/100/100",
    rating: 5,
  },
  {
    quote: "The controlled access system gives us peace of mind. No more worrying about data security or unauthorized access to student information.",
    author: "Prof. Michael Chen",
    role: "Dean of Students, University of Tech",
    avatar: "https://picsum.photos/seed/testimonial2/100/100",
    rating: 5,
  },
  {
    quote: "As a teacher, I love how quick and easy it is to mark attendance. The mobile app makes it perfect for our dynamic classroom environment.",
    author: "Ms. Emily Rodriguez",
    role: "Science Teacher, Maple Elementary",
    avatar: "https://picsum.photos/seed/testimonial3/100/100",
    rating: 5,
  },
];

export const stats: Stat[] = [
  { label: 'Active Users', value: '50K+', color: 'from-blue-600 to-purple-600' },
  { label: 'Institutions', value: '200+', color: 'from-green-600 to-emerald-600' },
  { label: 'Uptime', value: '99.9%', color: 'from-orange-600 to-red-600' },
];

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
