'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  scrollToSection: (id: string) => void;
}

export default function Navigation({ scrollToSection }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = (section: string) => {
    scrollToSection(section);
    setIsMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 w-full z-50 bg-white/20 dark:bg-black/20 backdrop-blur-lg border-b border-gray-200/20 dark:border-white/10 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Logo className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
              EduTrack
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['home', 'about', 'features', 'tech-stack', 'team'].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => handleMenuClick(item)}
                  className="capitalize hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium relative group"
                >
                  {item.replace('-', ' ')}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </button>
              )
            )}
            <ThemeToggle />
            <Button variant="ghost" asChild className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <Link href="/login">Login</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-900/10 dark:bg-white/10 backdrop-blur-sm hover:bg-gray-900/20 dark:hover:bg-white/20 transition-colors duration-200"
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
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white/40 dark:bg-black/40 backdrop-blur-lg border-t border-gray-200/20 dark:border-white/10"
        >
          <div className="px-4 py-2 space-y-2">
            {['home', 'about', 'features', 'tech-stack', 'team'].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => handleMenuClick(item)}
                  className="capitalize block w-full text-left py-3 px-4 rounded-lg hover:bg-gray-900/10 dark:hover:bg-white/10 transition-colors duration-200 font-medium"
                >
                  {item.replace('-', ' ')}
                </button>
              )
            )}
            <div className="border-t border-white/10 pt-2 flex flex-col gap-2">
              <Button variant="ghost" asChild className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
