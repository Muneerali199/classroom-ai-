'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/icons';
import { Github, Twitter, Linkedin } from 'lucide-react';

interface FooterProps {
  scrollToSection: (id: string) => void;
}

export default function Footer({ scrollToSection }: FooterProps) {
  const navLinks = [
    { label: 'About', id: 'about' },
    { label: 'Features', id: 'features' },
    { label: 'Team', id: 'team' },
  ];
  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, href: '#' },
    { icon: <Twitter className="w-5 h-5" />, href: '#' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#' },
  ];

  return (
    <footer 
      className="py-12 px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(135deg, #d1d1d1 0%, #c4c4c4 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <motion.div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection('home')}
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-2 rounded-lg" style={{
              background: 'linear-gradient(145deg, #dcdcdc, #bababa)',
              boxShadow: '4px 4px 8px #adadad, -4px -4px 8px #efefef'
            }}>
              <Logo className="w-6 h-6 text-gray-700" />
            </div>
            <span className="font-bold text-lg text-gray-700">EduTrack</span>
          </motion.div>
          <div className="flex gap-6">
            {navLinks.map(link => (
              <motion.button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="font-medium text-gray-600 hover:text-gray-800"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.label}
              </motion.button>
            ))}
          </div>
          <div className="flex gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full text-gray-600"
                style={{
                  background: 'linear-gradient(145deg, #e0e0e0, #c8c8c8)',
                  boxShadow: '5px 5px 10px #b8b8b8, -5px -5px 10px #f8f8f8'
                }}
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: 'inset 3px 3px 6px #b8b8b8, inset -3px -3px 6px #f8f8f8'
                }}
                whileTap={{ scale: 0.9 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>
        <div className="text-center text-gray-500 mt-8 pt-8 border-t" style={{borderColor: 'rgba(0,0,0,0.1)'}}>
          <p>&copy; {new Date().getFullYear()} EduTrack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}