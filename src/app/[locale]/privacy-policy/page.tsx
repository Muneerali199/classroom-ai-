'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Eye, Lock, Database, Mail, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link as I18nLink } from '@/routing';

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Information We Collect",
      content: [
        "Personal information you provide directly (name, email, institution details)",
        "Usage data and analytics through cookies and similar technologies",
        "Device information and browser data for security and optimization",
        "Attendance and academic data entered by authorized users",
        "Communication records when you contact our support team"
      ]
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "How We Use Your Information",
      content: [
        "Provide and maintain our educational management services",
        "Ensure secure access and role-based permissions",
        "Analyze usage patterns to improve our platform",
        "Send important service updates and security notifications",
        "Comply with legal obligations and institutional requirements",
        "Generate attendance reports and academic insights"
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Data Security & Protection",
      content: [
        "End-to-end encryption for all data transmission",
        "Secure cloud infrastructure with regular security audits",
        "Role-based access control ensuring data privacy",
        "Regular backups and disaster recovery procedures",
        "Employee training on data protection best practices",
        "Compliance with international data protection standards"
      ]
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Sharing & Third Parties",
      content: [
        "We do not sell or rent personal information to third parties",
        "Limited sharing with service providers for essential functions",
        "Legal compliance may require sharing in specific circumstances",
        "Aggregated, anonymized data may be used for research purposes",
        "Educational institutions retain ownership of their data",
        "International transfers comply with data protection laws"
      ]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Your Rights & Choices",
      content: [
        "Access and review your personal information",
        "Request correction of inaccurate data",
        "Delete your account and associated data",
        "Object to certain data processing activities",
        "Data portability for your information",
        "Withdraw consent for non-essential processing"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduTrack
              </span>
            </Link>
            <Button variant="ghost" asChild>
              <I18nLink href="/" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </I18nLink>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-200/50 dark:border-gray-700/50"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Introduction</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            EduTrack (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy and ensuring the security of your personal information.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our educational
            management platform.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            By using EduTrack, you agree to the collection and use of information in accordance with this policy. We will not use or
            share your information except as described in this Privacy Policy.
          </p>
        </motion.div>

        {/* Main Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
              </div>

              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <motion.li
                    key={itemIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 + itemIndex * 0.05 }}
                    className="flex items-start text-gray-700 dark:text-gray-300"
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Cookies Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 mt-8 border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
              <Database className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cookies & Tracking Technologies</h2>
          </div>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              We use cookies and similar tracking technologies to enhance your experience, analyze site traffic,
              and understand where our visitors are coming from. By using our website, you consent to the use of cookies
              in accordance with this policy.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Essential Cookies</h3>
                <p className="text-sm">Required for basic site functionality, authentication, and security.</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Analytics Cookies</h3>
                <p className="text-sm">Help us understand how visitors interact with our site to improve performance.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 mt-8 border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Us</h2>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
                <p className="text-gray-600 dark:text-gray-400">privacy@edutrack.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Data Protection Officer</h3>
                <p className="text-gray-600 dark:text-gray-400">dpo@edutrack.com</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="text-center mt-12 pt-8 border-t border-gray-200/50 dark:border-gray-700/50"
        >
          <p className="text-gray-600 dark:text-gray-400">
            This privacy policy is effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            and will remain in effect except with respect to any changes in its provisions in the future.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
