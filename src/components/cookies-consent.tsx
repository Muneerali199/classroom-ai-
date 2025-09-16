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
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50 shadow-2xl"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              {/* Cookie Icon */}
              <motion.div
                className="flex-shrink-0"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-white" />
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      🍪 We value your privacy
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      We use cookies to enhance your experience, analyze site traffic, and personalize content.
                      By continuing to use our site, you agree to our{' '}
                      <I18nLink
                        href="/privacy-policy"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        Privacy Policy
                      </I18nLink>
                      {' '}and{' '}
                      <I18nLink
                        href="/terms-and-conditions"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
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
                          className="mt-3 text-sm text-gray-600 dark:text-gray-300"
                        >
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                                <Shield className="w-4 h-4 mr-2 text-green-500" />
                                Necessary Cookies
                              </h4>
                              <p className="text-xs">Required for basic site functionality and security.</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-blue-500" />
                                Analytics Cookies
                              </h4>
                              <p className="text-xs">Help us understand how visitors use our site.</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Close cookie banner"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={acceptAllCookies}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Accept All
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={acceptNecessaryOnly}
                    variant="outline"
                    size="sm"
                    className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Necessary Only
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => setIsExpanded(!isExpanded)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    {isExpanded ? 'Less Info' : 'More Info'}
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Decline All Option */}
            <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <button
                onClick={declineAllCookies}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
              >
                Decline All Cookies
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
