/**
 * Centralized Theme Configuration
 * Use these constants across all dashboard components for consistency
 */

export const THEME_COLORS = {
  // Primary Gradients (matching landing page)
  primary: 'from-cyan-400 to-blue-500',
  secondary: 'from-purple-400 to-pink-500',
  success: 'from-emerald-400 to-teal-500',
  warning: 'from-orange-400 to-red-500',
  
  // Background Gradients
  primaryBg: 'from-cyan-500/20 to-blue-500/20',
  secondaryBg: 'from-purple-500/20 to-pink-500/20',
  successBg: 'from-emerald-500/20 to-teal-500/20',
  warningBg: 'from-orange-500/20 to-red-500/20',
  
  // Solid Gradients for Buttons
  primarySolid: 'from-cyan-500 to-blue-600',
  secondarySolid: 'from-purple-500 to-pink-600',
  successSolid: 'from-emerald-500 to-teal-600',
  warningSolid: 'from-orange-500 to-red-600',
  
  // Text Colors
  primaryText: 'text-cyan-400',
  secondaryText: 'text-purple-400',
  successText: 'text-emerald-400',
  warningText: 'text-orange-400',
  
  // Status Colors
  live: 'bg-emerald-500/20 text-emerald-400',
  next: 'bg-cyan-500/20 text-cyan-400',
  pending: 'bg-orange-500/20 text-orange-400',
  completed: 'bg-emerald-500/20 text-emerald-400',
} as const;

export const THEME_STYLES = {
  // Card Styles
  card: 'bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl backdrop-blur-sm hover:border-cyan-500/50 transition-all',
  cardElevated: 'bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 backdrop-blur-sm',
  
  // Background Pattern
  bgPattern: 'absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]',
  
  // Gradient Orbs
  orbCyan: 'absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse',
  orbPurple: 'absolute w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse',
  
  // Button Styles
  buttonPrimary: 'px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl text-white font-medium shadow-lg hover:shadow-cyan-500/50 transition-all',
  buttonSecondary: 'px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all font-medium',
  
  // Icon Container
  iconContainer: 'w-10 h-10 rounded-lg flex items-center justify-center',
  iconContainerLg: 'w-12 h-12 rounded-xl flex items-center justify-center',
  
  // Input Styles
  input: 'bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-500/50 focus:outline-none transition-all',
  
  // Badge Styles
  badge: 'text-xs px-2 py-1 rounded-full',
  badgeSuccess: 'text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full',
  badgeWarning: 'text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full',
  badgeInfo: 'text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full',
} as const;

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
  },
  hoverLift: {
    whileHover: { y: -5 },
  },
  hoverScale: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  },
} as const;

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const;
