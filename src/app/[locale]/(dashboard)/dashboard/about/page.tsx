'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HulyButton } from '@/components/ui/huly-button';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Users, 
  Calendar, 
  BarChart3, 
  Shield, 
  Zap, 
  Target, 
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Lightbulb,
  TrendingUp,
  Clock,
  BookOpen,
  GraduationCap
} from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Timetable Optimization",
      description: "Advanced algorithms generate multiple optimized schedules, eliminating conflicts and maximizing resource utilization.",
      highlight: "Smart Scheduling"
    },
    {
      icon: Users,
      title: "Smart Attendance Tracking",
      description: "Real-time attendance monitoring with AI-powered insights and automated reporting for better student engagement.",
      highlight: "Real-time Analytics"
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Comprehensive grade analysis and attendance insights that help improve learning outcomes over time.",
      highlight: "Data-Driven Insights"
    },
    {
      icon: Calendar,
      title: "Multi-Department Scheduling",
      description: "Handle complex scheduling across multiple departments, shifts, and academic programs seamlessly.",
      highlight: "Enterprise Scale"
    }
  ];

  const usps = [
    {
      icon: Target,
      title: "Beyond Static Scheduling",
      description: "Unlike traditional apps that just create schedules, we analyze real outcomes and continuously improve."
    },
    {
      icon: TrendingUp,
      title: "Continuous Learning",
      description: "Our AI learns from attendance patterns and academic performance to suggest better future schedules."
    },
    {
      icon: Shield,
      title: "NEP 2020 Compliant",
      description: "Fully supports flexible, multidisciplinary learning requirements of the New Education Policy."
    },
    {
      icon: Zap,
      title: "Real-time Adaptation",
      description: "Dynamically adjusts when situations change - no more manual rescheduling headaches."
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Secure Login",
      description: "Authorized staff access the platform with role-based permissions",
      icon: Shield
    },
    {
      step: "02", 
      title: "Input Data",
      description: "Add classrooms, subjects, faculty, batches, and scheduling constraints",
      icon: BookOpen
    },
    {
      step: "03",
      title: "AI Generation",
      description: "System generates multiple optimized timetable options automatically",
      icon: Brain
    },
    {
      step: "04",
      title: "Review & Approve",
      description: "Review suggestions, make tweaks if needed, and approve the final schedule",
      icon: CheckCircle
    },
    {
      step: "05",
      title: "Smart Tracking",
      description: "Platform tracks attendance and analyzes performance for future improvements",
      icon: BarChart3
    }
  ];

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10" />
          <CardContent className="relative p-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary/10 rounded-2xl">
                  <GraduationCap className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">
                    Smart Classroom & Timetable Scheduler
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    AI-Powered Educational Management Platform
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 ml-auto">
                <Badge variant="secondary" className="px-4 py-2">
                  <Award className="w-4 h-4 mr-2" />
                  NEP 2020 Compliant
                </Badge>
                <Badge variant="secondary" className="px-4 py-2">
                  <Star className="w-4 h-4 mr-2" />
                  AI-Powered
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-primary" />
              Who We Are & Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-muted-foreground leading-relaxed">
              We are building the future of educational management with an AI-powered platform that revolutionizes how colleges and universities handle timetable scheduling, attendance tracking, and academic performance analysis.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our Smart Classroom & Timetable Scheduler eliminates the chaos of manual scheduling by using advanced artificial intelligence to create optimized timetables that avoid conflicts, balance workloads, and maximize resource utilization. But we don't stop there – we continuously analyze real student engagement and academic outcomes to make your schedules smarter over time.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">10,000+</div>
                <div className="text-sm text-muted-foreground">Students Managed</div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Faculty Members</div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Conflict Resolution</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Problem Statement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-destructive" />
              The Problem We Solve
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Educational institutions face massive challenges with manual timetable scheduling that result in poor learning outcomes and administrative chaos.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Current Challenges:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2" />
                    <span className="text-muted-foreground">Class scheduling conflicts and room double-bookings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2" />
                    <span className="text-muted-foreground">Underutilized classrooms and uneven faculty workload</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2" />
                    <span className="text-muted-foreground">Manual attendance tracking leading to poor engagement insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2" />
                    <span className="text-muted-foreground">No connection between scheduling and student performance</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">NEP 2020 Complexity:</h3>
                <p className="text-muted-foreground">
                  The New Education Policy 2020 introduces flexible, multidisciplinary learning that makes traditional scheduling methods obsolete. Students now need:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1" />
                    <span className="text-muted-foreground">Cross-department course selections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1" />
                    <span className="text-muted-foreground">Flexible credit systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-1" />
                    <span className="text-muted-foreground">Multiple entry and exit points</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Our Solution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Our AI-Powered Solution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              We've built a comprehensive web-based platform that uses artificial intelligence to automate timetable generation, track attendance in real-time, and continuously improve scheduling based on actual learning outcomes.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="relative p-6 border border-border rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{feature.title}</h3>
                        <Badge variant="outline" className="text-xs">{feature.highlight}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              How It Works - Simple 5-Step Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{step.step}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <step.icon className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-shrink-0 ml-6">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Unique Selling Points */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-6 w-6 text-primary" />
              What Makes Us Different
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {usps.map((usp, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <usp.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{usp.title}</h3>
                    <p className="text-sm text-muted-foreground">{usp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* What Others Don't Provide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Beyond Traditional Timetable Apps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Most timetable applications stop at creating static schedules. We go far beyond that to ensure better learning outcomes.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Traditional Apps:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-muted rounded-full" />
                    Create static schedules only
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-muted rounded-full" />
                    No attendance analysis
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-muted rounded-full" />
                    Manual conflict resolution
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-muted rounded-full" />
                    No performance insights
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-3">Our Smart Platform:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-primary">
                    <CheckCircle className="w-4 h-4" />
                    AI-optimized dynamic scheduling
                  </li>
                  <li className="flex items-center gap-2 text-primary">
                    <CheckCircle className="w-4 h-4" />
                    Real-time attendance & engagement tracking
                  </li>
                  <li className="flex items-center gap-2 text-primary">
                    <CheckCircle className="w-4 h-4" />
                    Automatic conflict prevention
                  </li>
                  <li className="flex items-center gap-2 text-primary">
                    <CheckCircle className="w-4 h-4" />
                    Learning outcome optimization
                  </li>
                </ul>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="text-center p-6 bg-primary/5 rounded-lg">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                We Don't Just Schedule Classes – We Optimize Learning
              </h3>
              <p className="text-muted-foreground">
                Our platform creates a continuous feedback loop where every schedule gets smarter based on real student engagement and academic performance data.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to Transform Your Institution?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join the future of educational management with AI-powered scheduling that actually improves learning outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <HulyButton variant="primary" size="large">
                Get Started Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </HulyButton>
              <HulyButton variant="secondary" size="large">
                Schedule Demo
              </HulyButton>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
