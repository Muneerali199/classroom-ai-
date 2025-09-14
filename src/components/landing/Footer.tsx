'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/icons';

interface FooterProps {
  scrollToSection: (id: string) => void;
}

export default function Footer({ scrollToSection }: FooterProps) {
  return (
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
              <button
                onClick={() => scrollToSection('features')}
                className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
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
              <button
                onClick={() => scrollToSection('about')}
                className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('team')}
                className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Team
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
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
  );
}
