'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Cookie, Shield, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { setCookieConsent, hasCookieConsent } from '@/lib/cookies';
import { Link as I18nLink } from '@/routing';

export default function CookiesConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    if (!hasCookieConsent()) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAllCookies = () => {
    setCookieConsent('accepted');
    setIsVisible(false);
  };

  const acceptNecessaryOnly = () => {
    setCookieConsent('necessary-only');
    setIsVisible(false);
  };

  const declineAllCookies = () => {
    setCookieConsent('declined');
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto">
            <div 
              className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl"
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 rounded-2xl pointer-events-none" />
              
              <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6">
                {/* Cookie Icon */}
                <motion.div
                  className="flex-shrink-0"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div 
                    className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30"
                  >
                    <Cookie className="w-7 h-7 md:w-8 md:h-8 text-cyan-400" />
                  </div>
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 flex items-center gap-2">
                        <span className="text-xl md:text-2xl">🍪</span>
                        We value your privacy
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        We use cookies to enhance your experience, analyze site traffic, and personalize content.
                        By continuing to use our site, you agree to our{' '}
                        <I18nLink
                          href="/privacy-policy"
                          className="text-cyan-400 hover:text-cyan-300 underline font-medium transition-colors"
                        >
                          Privacy Policy
                        </I18nLink>
                        {' '}and{' '}
                        <I18nLink
                          href="/terms-and-conditions"
                          className="text-cyan-400 hover:text-cyan-300 underline font-medium transition-colors"
                        >
                          Terms & Conditions
                        </I18nLink>
                        .
                      </p>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4"
                          >
                            <div 
                              className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl"
                            >
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold text-white mb-2 flex items-center">
                                    <Shield className="w-4 h-4 mr-2 text-emerald-400" />
                                    Necessary Cookies
                                  </h4>
                                  <p className="text-xs text-gray-400">Required for basic site functionality and security.</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-white mb-2 flex items-center">
                                    <FileText className="w-4 h-4 mr-2 text-cyan-400" />
                                    Analytics Cookies
                                  </h4>
                                  <p className="text-xs text-gray-400">Help us understand how visitors use our site.</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={handleClose}
                      className="flex-shrink-0 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
                      aria-label="Close cookie banner"
                    >
                      <X className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full lg:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={acceptAllCookies}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold text-sm rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25"
                  >
                    Accept All
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={acceptNecessaryOnly}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl border border-white/20 transition-all duration-300"
                  >
                    Necessary Only
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="px-4 py-2 text-gray-400 hover:text-white text-sm font-medium transition-colors"
                  >
                    {isExpanded ? 'Less Info' : 'More Info'}
                  </motion.button>
                </div>
              </div>

              {/* Decline All Option */}
              <div className="relative mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={declineAllCookies}
                  className="text-sm text-gray-500 hover:text-gray-300 underline transition-colors"
                >
                  Decline All Cookies
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
