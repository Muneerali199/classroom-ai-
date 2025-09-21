'use client';

import React, { useState } from 'react';
import { Github, Linkedin, Mail, User, Code, Palette, Database, TrendingUp, Bug, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TeamMember {
  name: string;
  role: string;
  background: string;
  expertise: string[];
  contributions: string[];
  icon: React.ReactElement;
  color: string;
  social: {
    github: string;
    linkedin: string;
    email: string;
  };
}

export default function TeamSection() {
  const [expandedMember, setExpandedMember] = useState<number | null>(null);

  const teamMembers: TeamMember[] = [
    {
      name: "Muneer Ali",
      role: "Lead Developer",
      background: "Full-stack developer with 8+ years experience in educational technology.",
      expertise: [
        "React/Next.js development",
        "Database design and optimization", 
        "AI/ML integration",
        "Performance optimization"
      ],
      contributions: [
        "Core application architecture",
        "Supabase integration",
        "AI workflow implementation",
        "Performance optimization"
      ],
      icon: <User className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      social: {
        github: "https://github.com/Muneerali199",
        linkedin: "https://linkedin.com/in/muneerali",
        email: "alimuneerali245@gmail.com"
      }
    },
    {
      name: "Jayant Bansal",
      role: "UX/UI Designer", 
      background: "UX designer specializing in educational platforms.",
      expertise: [
        "User research and testing",
        "Interface design",
        "Accessibility compliance",
        "Design systems"
      ],
      contributions: [
        "User interface design",
        "User experience optimization",
        "Accessibility implementation", 
        "Design system creation"
      ],
      icon: <Palette className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
      social: {
        github: "https://github.com/jayantbansal",
        linkedin: "https://linkedin.com/in/jayantbansal",
        email: "jayant@edutrack.com"
      }
    },
    {
      name: "Akshay Jain",
      role: "Frontend Developer",
      background: "Frontend specialist with focus on modern web technologies.",
      expertise: [
        "React ecosystem",
        "TypeScript development",
        "Performance optimization",
        "Testing frameworks"
      ],
      contributions: [
        "Component development",
        "State management",
        "Testing implementation",
        "Performance monitoring"
      ],
      icon: <Code className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
      social: {
        github: "https://github.com/akshayjain",
        linkedin: "https://linkedin.com/in/akshayjain",
        email: "akshay@edutrack.com"
      }
    },
    {
      name: "Aveek Patel",
      role: "Backend Developer",
      background: "Backend engineer with expertise in scalable systems.",
      expertise: [
        "Node.js development",
        "Database systems",
        "API design", 
        "Security implementation"
      ],
      contributions: [
        "API development",
        "Database schema design",
        "Security implementation",
        "Scalability improvements"
      ],
      icon: <Database className="w-8 h-8" />,
      color: "from-orange-500 to-red-500",
      social: {
        github: "https://github.com/aveekpatel",
        linkedin: "https://linkedin.com/in/aveekpatel", 
        email: "aveek@edutrack.com"
      }
    },
    {
      name: "Amisha Jindal",
      role: "Marketing Research",
      background: "Marketing strategist with educational technology focus.",
      expertise: [
        "Market research",
        "User acquisition",
        "Product positioning",
        "Competitive analysis"
      ],
      contributions: [
        "Market analysis",
        "User research", 
        "Feature prioritization",
        "Go-to-market strategy"
      ],
      icon: <TrendingUp className="w-8 h-8" />,
      color: "from-indigo-500 to-purple-500",
      social: {
        github: "https://github.com/amishajindal",
        linkedin: "https://linkedin.com/in/amishajindal",
        email: "amisha@edutrack.com"
      }
    },
    {
      name: "Khushi",
      role: "QA Tester",
      background: "Quality assurance specialist with testing expertise.",
      expertise: [
        "Manual testing",
        "Automated testing", 
        "Bug tracking",
        "Quality processes"
      ],
      contributions: [
        "Test case development",
        "Bug identification",
        "Quality assurance",
        "Release validation"
      ],
      icon: <Bug className="w-8 h-8" />,
      color: "from-teal-500 to-cyan-500",
      social: {
        github: "https://github.com/khushi",
        linkedin: "https://linkedin.com/in/khushi",
        email: "khushi@edutrack.com"
      }
    }
  ];

  const getGradientColors = (colorString: string): string => {
    switch (colorString) {
      case 'from-blue-500 to-cyan-500':
        return '#3b82f6, #06b6d4';
      case 'from-purple-500 to-pink-500':
        return '#8b5cf6, #ec4899';
      case 'from-green-500 to-emerald-500':
        return '#10b981, #059669';
      case 'from-orange-500 to-red-500':
        return '#f97316, #ef4444';
      case 'from-indigo-500 to-purple-500':
        return '#6366f1, #8b5cf6';
      case 'from-teal-500 to-cyan-500':
        return '#14b8a6, #06b6d4';
      default:
        return '#3b82f6, #06b6d4';
    }
  };

  return (
    <motion.section
      id="team"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-24 px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(135deg, #e8e8e8 0%, #dadada 100%)'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-6 text-gray-700"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Meet Our Team
        </motion.h2>
        <motion.div
          className="max-w-3xl mx-auto p-6 rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #efefef, #d9d9d9)',
            boxShadow: 'inset 6px 6px 12px #c8c8c8, inset -6px -6px 12px #ffffff'
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p className="text-xl text-gray-600">
            A passionate team of developers and designers dedicated to
            transforming educational technology with cutting-edge solutions.
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
      >
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            className="group text-center p-6 rounded-3xl transition-all duration-300 cursor-pointer"
            style={{
              background: 'linear-gradient(145deg, #efefef, #d9d9d9)',
              boxShadow: '12px 12px 24px #c8c8c8, -12px -12px 24px #ffffff'
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: '16px 16px 32px #c0c0c0, -16px -16px 32px #ffffff'
            }}
            whileTap={{ 
              scale: 0.98,
              boxShadow: 'inset 8px 8px 16px #c8c8c8, inset -8px -8px 16px #ffffff'
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            onClick={() => setExpandedMember(expandedMember === index ? null : index)}
          >
            {/* Avatar with Icon */}
            <motion.div
              className="relative mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white"
                style={{
                  background: `linear-gradient(135deg, ${getGradientColors(member.color)})`,
                  boxShadow: '8px 8px 16px #c0c0c0, -8px -8px 16px #ffffff'
                }}
              >
                {member.icon}
              </motion.div>
            </motion.div>

            {/* Name and Role */}
            <motion.h3
              className="text-xl font-bold text-gray-700 mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {member.name}
            </motion.h3>
            <motion.p
              className="text-blue-500 font-medium mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {member.role}
            </motion.p>

            {/* Background */}
            <motion.p
              className="text-sm text-gray-600 mb-4 leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {member.background}
            </motion.p>

            {/* Expand/Collapse Button */}
            <motion.button
              className="flex items-center justify-center mx-auto mb-4 p-2 rounded-lg"
              style={{
                background: 'linear-gradient(145deg, #e0e0e0, #c8c8c8)',
                boxShadow: '4px 4px 8px #b8b8b8, -4px -4px 8px #f8f8f8'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {expandedMember === index ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </motion.button>

            {/* Expandable Content */}
            <AnimatePresence>
              {expandedMember === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 mb-6">
                    {/* Expertise */}
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-700 mb-2">Expertise</h4>
                      <ul className="space-y-1">
                        {member.expertise.map((skill, skillIndex) => (
                          <li key={skillIndex} className="text-sm text-gray-600 flex items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-400 mr-2 flex-shrink-0" />
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Contributions */}
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-700 mb-2">Key Contributions</h4>
                      <ul className="space-y-1">
                        {member.contributions.map((contribution, contribIndex) => (
                          <li key={contribIndex} className="text-sm text-gray-600 flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-400 mr-2 flex-shrink-0" />
                            {contribution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Social Links */}
            <motion.div
              className="flex justify-center space-x-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              {[
                { Icon: Github, href: member.social.github, label: "GitHub" },
                { Icon: Linkedin, href: member.social.linkedin, label: "LinkedIn" },
                { Icon: Mail, href: `mailto:${member.social.email}`, label: "Email" },
              ].map(({ Icon, href }, socialIndex) => (
                <motion.a
                  key={socialIndex}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-colors duration-200"
                  style={{
                    background: 'linear-gradient(145deg, #e0e0e0, #c8c8c8)',
                    boxShadow: '4px 4px 8px #b8b8b8, -4px -4px 8px #f8f8f8'
                  }}
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 5,
                    boxShadow: 'inset 2px 2px 4px #b8b8b8, inset -2px -2px 4px #f8f8f8'
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icon className="w-4 h-4 text-gray-600" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Team Stats */}
      <motion.div
        className="mt-20 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="text-2xl font-bold text-gray-700 mb-8">Team Excellence</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                boxShadow: '8px 8px 16px #c0c0c0, -8px -8px 16px #ffffff'
              }}
            >
              <User className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">6 Team Members</h4>
            <p className="text-sm text-gray-600">Diverse expertise across all domains</p>
          </div>
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                boxShadow: '8px 8px 16px #c0c0c0, -8px -8px 16px #ffffff'
              }}
            >
              <Code className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">20+ Years Experience</h4>
            <p className="text-sm text-gray-600">Combined industry expertise</p>
          </div>
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                boxShadow: '8px 8px 16px #c0c0c0, -8px -8px 16px #ffffff'
              }}
            >
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Full-Stack Coverage</h4>
            <p className="text-sm text-gray-600">Frontend, backend, design, and QA</p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}