'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/icons';

interface NavigationProps {
  scrollToSection: (id: string) => void;
}

export default function Navigation({ scrollToSection }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'features', label: 'Features' },
    { id: 'team', label: 'Team' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 p-4"
      >
        <div 
          className="max-w-7xl mx-auto flex justify-between items-center p-3 rounded-2xl"
          style={{
            background: 'linear-gradient(145deg, #efefef, #d9d9d9)',
            boxShadow: '8px 8px 16px #c8c8c8, -8px -8px 16px #ffffff'
          }}
        >
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection('home')}
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-2 rounded-lg" style={{
              background: 'linear-gradient(145deg, #e0e0e0, #c8c8c8)',
              boxShadow: '4px 4px 8px #b8b8b8, -4px -4px 8px #f8f8f8'
            }}>
              <Logo className="w-6 h-6 text-gray-700" />
            </div>
            <span className="font-bold text-lg text-gray-700">EduTrack</span>
          </motion.div>
          <div className="hidden md:flex items-center gap-4">
            {navItems.map(item => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-2 rounded-lg font-medium text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
            <motion.button
                onClick={() => window.location.href = '/login'}
                className="px-4 py-2 rounded-lg font-semibold text-gray-700"
                style={{
                    background: 'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
                    boxShadow: '6px 6px 12px #bebebe, -6px -6px 12px #ffffff'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ 
                    scale: 0.95,
                    boxShadow: 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff'
                }}
              >
                Login
              </motion.button>
          </div>
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 rounded-full"
              style={{
                background: 'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
                boxShadow: '6px 6px 12px #bebebe, -6px -6px 12px #ffffff'
              }}
              whileTap={{ 
                scale: 0.9,
                boxShadow: 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff'
              }}
            >
              {isOpen ? <X className="w-5 h-5 text-gray-600"/> : <Menu className="w-5 h-5 text-gray-600"/>}
            </motion.button>
          </div>
        </div>
      </motion.nav>
      
      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 bg-gray-200/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
        >
            <motion.div
                initial={{ y: '-100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-24 left-4 right-4 p-6 rounded-2xl"
                style={{
                    background: 'linear-gradient(145deg, #efefef, #d9d9d9)',
                    boxShadow: '8px 8px 16px #c8c8c8, -8px -8px 16px #ffffff'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center gap-6">
                    {navItems.map(item => (
                        <motion.button
                            key={item.id}
                            onClick={() => {
                                scrollToSection(item.id);
                                setIsOpen(false);
                            }}
                            className="text-xl font-medium text-gray-700"
                            whileHover={{ scale: 1.1 }}
                        >
                            {item.label}
                        </motion.button>
                    ))}
                    <motion.button
                        onClick={() => window.location.href = '/login'}
                        className="w-full mt-4 px-4 py-3 rounded-lg font-semibold text-gray-700"
                        style={{
                            background: 'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
                            boxShadow: '6px 6px 12px #bebebe, -6px -6px 12px #ffffff'
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ 
                            scale: 0.95,
                            boxShadow: 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff'
                        }}
                    >
                        Login
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
      )}
    </>
  );
}