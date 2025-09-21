import React from 'react';
import { CheckCircle, Shield, Users, BarChart, BookOpen, Clock, Database, Code, Zap } from 'lucide-react';

export const benefits = [
    { icon: CheckCircle, text: 'No credit card required' },
    { icon: Shield, text: 'Enterprise-grade security' },
    { icon: Users, text: 'Trusted by 1,000+ institutions' },
];

export const stats = [
    { label: 'Active Users', value: '10,000+', color: 'from-blue-500 to-cyan-500' },
    { label: 'Institutions', value: '1,000+', color: 'from-green-500 to-emerald-500' },
    { label: 'Uptime', value: '99.9%', color: 'from-purple-500 to-pink-500' },
];

export const features = [
    {
        icon: <BarChart className="w-8 h-8"/>,
        title: 'Real-time Analytics',
        description: 'Track attendance and engagement with our powerful analytics dashboard.',
        color: 'from-blue-500 to-purple-600',
    },
    {
        icon: <Shield className="w-8 h-8"/>,
        title: 'Secure Access Control',
        description: 'Role-based permissions ensure data privacy and institutional oversight.',
        color: 'from-green-500 to-emerald-600',
    },
    {
        icon: <BookOpen className="w-8 h-8"/>,
        title: 'Student Management',
        description: 'A comprehensive system for managing student records and progress.',
        color: 'from-purple-500 to-pink-600',
    },
     {
        icon: <Clock className="w-8 h-8"/>,
        title: 'Automated Attendance',
        description: 'Streamline attendance tracking with automated check-ins and reporting.',
        color: 'from-orange-500 to-yellow-600',
    },
    {
        icon: <Users className="w-8 h-8"/>,
        title: 'Dean-Supervised Accounts',
        description: 'Institutions maintain full control with dean-supervised user creation.',
        color: 'from-cyan-500 to-blue-600',
    },
    {
        icon: <CheckCircle className="w-8 h-8"/>,
        title: 'Easy Integration',
        description: 'Seamlessly integrate with your existing educational tools and systems.',
        color: 'from-red-500 to-orange-600',
    }
];

export const team = [
    {
        name: 'Alex Johnson',
        role: 'Lead Developer',
        bio: 'Alex is the architect behind our robust and scalable platform.',
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop',
        dataAiHint: 'A man with short brown hair and a beard, smiling.',
        social: {
            github: '#',
            linkedin: '#',
            email: 'alex@example.com',
        },
    },
    {
        name: 'Maria Garcia',
        role: 'UI/UX Designer',
        bio: 'Maria crafts the intuitive and beautiful interfaces you love.',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
        dataAiHint: 'A woman with long dark hair, smiling at the camera.',
        social: {
            github: '#',
            linkedin: '#',
            email: 'maria@example.com',
        },
    },
    {
        name: 'David Kim',
        role: 'Backend Engineer',
        bio: 'David ensures our systems are fast, reliable, and secure.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        dataAiHint: 'A man with black hair wearing glasses, professional headshot.',
        social: {
            github: '#',
            linkedin: '#',
            email: 'david@example.com',
        },
    },
    {
        name: 'Sarah Wilson',
        role: 'Product Manager',
        bio: 'Sarah bridges the gap between user needs and technical solutions.',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop',
        dataAiHint: 'A woman with blonde hair, professional business attire.',
        social: {
            github: '#',
            linkedin: '#',
            email: 'sarah@example.com',
        },
    }
];

export const architectureHighlights = [
    {
        icon: Database,
        title: 'Secure Database',
        description: 'PostgreSQL with encrypted data storage and role-based access control.',
    },
    {
        icon: Code,
        title: 'Modern Framework',
        description: 'Built with React and Next.js for optimal performance and scalability.',
    },
    {
        icon: Zap,
        title: 'Real-time Updates',
        description: 'Live synchronization across all devices with instant data updates.',
    },
];