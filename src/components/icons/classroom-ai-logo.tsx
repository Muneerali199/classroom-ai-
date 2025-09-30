'use client';

import { motion } from 'framer-motion';

interface ClassroomAILogoProps {
  className?: string;
  animated?: boolean;
}

export function ClassroomAILogo({ className = "w-10 h-10", animated = true }: ClassroomAILogoProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="logoGradientAlt" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background Circle with Gradient */}
      <circle cx="100" cy="100" r="95" fill="url(#logoGradient)" opacity="0.15" />

      {/* Main Book Shape */}
      <g filter="url(#glow)">
        {/* Book Cover */}
        <path
          d="M 60 50 L 140 50 L 140 150 L 100 140 L 60 150 Z"
          fill="url(#logoGradient)"
          opacity="0.9"
        />
        
        {/* Book Spine */}
        <path
          d="M 100 50 L 100 140"
          stroke="white"
          strokeWidth="2"
          opacity="0.6"
        />

        {/* AI Circuit Pattern Left */}
        <circle cx="80" cy="80" r="4" fill="white" opacity="0.9" />
        <circle cx="80" cy="100" r="4" fill="white" opacity="0.9" />
        <circle cx="80" cy="120" r="4" fill="white" opacity="0.9" />
        <line x1="80" y1="84" x2="80" y2="96" stroke="white" strokeWidth="2" opacity="0.7" />
        <line x1="80" y1="104" x2="80" y2="116" stroke="white" strokeWidth="2" opacity="0.7" />

        {/* AI Circuit Pattern Right */}
        <circle cx="120" cy="80" r="4" fill="white" opacity="0.9" />
        <circle cx="120" cy="100" r="4" fill="white" opacity="0.9" />
        <circle cx="120" cy="120" r="4" fill="white" opacity="0.9" />
        <line x1="120" y1="84" x2="120" y2="96" stroke="white" strokeWidth="2" opacity="0.7" />
        <line x1="120" y1="104" x2="120" y2="116" stroke="white" strokeWidth="2" opacity="0.7" />

        {/* Connecting Lines */}
        <line x1="84" y1="80" x2="116" y2="80" stroke="white" strokeWidth="2" opacity="0.7" />
        <line x1="84" y1="100" x2="116" y2="100" stroke="white" strokeWidth="2" opacity="0.7" />
        <line x1="84" y1="120" x2="116" y2="120" stroke="white" strokeWidth="2" opacity="0.7" />

        {/* AI Brain Symbol Top */}
        <path
          d="M 85 65 Q 100 60 115 65"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          opacity="0.8"
        />
        <circle cx="85" cy="65" r="3" fill="white" opacity="0.9" />
        <circle cx="115" cy="65" r="3" fill="white" opacity="0.9" />
      </g>

      {/* Accent Elements */}
      <g opacity="0.6">
        <circle cx="50" cy="60" r="3" fill="url(#logoGradientAlt)" />
        <circle cx="150" cy="60" r="3" fill="url(#logoGradientAlt)" />
        <circle cx="50" cy="140" r="3" fill="url(#logoGradientAlt)" />
        <circle cx="150" cy="140" r="3" fill="url(#logoGradientAlt)" />
      </g>
    </svg>
  );
}

export function AnimatedClassroomAILogo({ className = "w-10 h-10" }: ClassroomAILogoProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <ClassroomAILogo className={className} animated={true} />
    </motion.div>
  );
}
