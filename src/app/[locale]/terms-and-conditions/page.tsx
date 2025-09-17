'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Users, Shield, AlertTriangle, Scale } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link as I18nLink } from '@/routing';

export default function TermsAndConditions() {
  const sections = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Acceptance of Terms",
      content: [
        "By accessing and using EduTrack, you accept and agree to be bound by the terms and provision of this agreement.",
        "If you do not agree to abide by the above, please do not use this service.",
        "These terms apply to all users, including deans, teachers, and students.",
        "Your continued use of the platform constitutes acceptance of these terms."
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "User Responsibilities",
      content: [
        "Users must provide accurate and complete information during registration",
        "Maintain the confidentiality of account credentials and access codes",
        "Use the platform only for authorized educational purposes",
        "Report any security incidents or unauthorized access immediately",
        "Comply with all applicable laws and institutional policies",
        "Respect the privacy and rights of other users"
      ]
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Service Description",
      content: [
        "EduTrack provides attendance tracking and student management tools",
        "Services are available 24/7 with scheduled maintenance windows",
        "We reserve the right to modify or discontinue services with notice",
        "Data backup and recovery services are provided as part of the platform",
        "Technical support is available during business hours",
        "Regular updates and improvements are deployed automatically"
      ]
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Prohibited Activities",
      content: [
        "Sharing account credentials with unauthorized users",
        "Attempting to gain unauthorized access to other accounts",
        "Uploading malicious code or content that could harm the platform",
        "Using the service for any illegal or unauthorized purpose",
        "Circumventing security measures or access controls",
        "Interfering with the proper functioning of the platform"
      ]
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Data Ownership & Privacy",
      content: [
        "Educational institutions retain ownership of their data",
        "We implement industry-standard security measures",
        "Data is processed in accordance with our Privacy Policy",
        "Users have rights to access, correct, and delete their data",
        "We may retain data as required by law or for legitimate business purposes",
        "Data portability options are available upon request"
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
              <Link href="/" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
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
              Terms & Conditions
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Please read these terms carefully before using EduTrack. By using our service, you agree to these terms.
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
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Agreement Overview</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            These Terms and Conditions (&quot;Terms&quot;) govern your use of EduTrack, an educational management platform
            provided by EduTrack Inc. (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing or using our service, you agree to be bound
            by these Terms and our Privacy Policy.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            If you disagree with any part of these terms, you may not access or use our service. These Terms apply to
            all users, including deans, teachers, students, and other authorized personnel.
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

        {/* Account Termination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 mt-8 border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account Termination</h2>
          </div>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              We reserve the right to terminate or suspend your account immediately, without prior notice or liability,
              for any reason whatsoever, including without limitation if you breach the Terms.
            </p>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Termination Consequences</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-300">
                <li>Immediate loss of access to all services</li>
                <li>Deletion of all associated data after retention period</li>
                <li>Forfeiture of any credits or unused services</li>
                <li>Potential legal action for breach of terms</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Limitation of Liability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 mt-8 border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Limitation of Liability</h2>
          </div>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              In no event shall EduTrack, nor its directors, employees, partners, agents, suppliers, or affiliates,
              be liable for any indirect, incidental, special, consequential, or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Service Availability</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                While we strive for 99.9% uptime, we do not guarantee uninterrupted service. We are not liable
                for any damages caused by service interruptions or data loss.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Governing Law */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 mt-8 border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Governing Law</h2>
          </div>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              These Terms shall be interpreted and governed by the laws of the jurisdiction in which your educational
              institution is located, without regard to its conflict of law provisions.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Dispute Resolution</h3>
                <p className="text-sm">Any disputes will be resolved through binding arbitration in accordance with institutional policies.</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Severability</h3>
                <p className="text-sm">If any provision is found invalid, the remaining provisions will remain in full force and effect.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 mt-8 border border-gray-200/50 dark:border-gray-700/50"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Contact Information</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Legal Inquiries</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-1">legal@edutrack.com</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">For legal and compliance matters</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Support</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-1">support@edutrack.com</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">For technical and account support</p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.0 }}
          className="text-center mt-12 pt-8 border-t border-gray-200/50 dark:border-gray-700/50"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            These Terms and Conditions are effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            and constitute the entire agreement between you and EduTrack.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" asChild>
              <I18nLink href="/privacy-policy">View Privacy Policy</I18nLink>
            </Button>
            <Button variant="outline" asChild>
              <I18nLink href="/">Back to Home</I18nLink>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
