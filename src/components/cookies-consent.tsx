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
          className="fixed bottom-0 left-0 right-0 z-50 p-6"
          style={{
            background: 'linear-gradient(135deg, #e3e3e3 0%, #d6d6d6 100%)'
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div 
              className="neumorphic-card p-8"
              style={{
                background: 'linear-gradient(145deg, #ebebeb, #d5d5d5)',
                boxShadow: '8px 8px 16px #c4c4c4, -8px -8px 16px #ffffff'
              }}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                {/* Cookie Icon */}
                <motion.div
                  className="flex-shrink-0"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div 
                    className="w-16 h-16 neumorphic-sm-inset rounded-2xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(145deg, #d0d0d0, #f0f0f0)',
                      boxShadow: 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff'
                    }}
                  >
                    <Cookie className="w-8 h-8 text-gray-600" />
                  </div>
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <span className="text-2xl">🍪</span>
                        We value your privacy
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        We use cookies to enhance your experience, analyze site traffic, and personalize content.
                        By continuing to use our site, you agree to our{' '}
                        <I18nLink
                          href="/privacy-policy"
                          className="text-blue-600 hover:underline font-medium neumorphic-badge px-2 py-1"
                        >
                          Privacy Policy
                        </I18nLink>
                        {' '}and{' '}
                        <I18nLink
                          href="/terms-and-conditions"
                          className="text-blue-600 hover:underline font-medium neumorphic-badge px-2 py-1"
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
                              className="neumorphic-sm-inset p-4 rounded-xl"
                              style={{
                                background: 'linear-gradient(145deg, #d0d0d0, #f0f0f0)',
                                boxShadow: 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff'
                              }}
                            >
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                    <Shield className="w-4 h-4 mr-2 text-green-500" />
                                    Necessary Cookies
                                  </h4>
                                  <p className="text-xs text-gray-600">Required for basic site functionality and security.</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                    <FileText className="w-4 h-4 mr-2 text-blue-500" />
                                    Analytics Cookies
                                  </h4>
                                  <p className="text-xs text-gray-600">Help us understand how visitors use our site.</p>
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
                      className="flex-shrink-0 p-2 neumorphic-sm rounded-xl hover:neumorphic-sm-inset transition-all duration-300"
                      aria-label="Close cookie banner"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={acceptAllCookies}
                      className="neumorphic-button px-6 py-3 text-gray-700 font-medium text-sm"
                    >
                      Accept All
                    </button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={acceptNecessaryOnly}
                      className="neumorphic-sm px-6 py-3 text-gray-700 font-medium text-sm hover:neumorphic-sm-inset transition-all duration-300"
                    >
                      Necessary Only
                    </button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="neumorphic-badge px-4 py-2 text-gray-600 hover:text-gray-700 text-sm font-medium"
                    >
                      {isExpanded ? 'Less Info' : 'More Info'}
                    </button>
                  </motion.div>
                </div>
              </div>

              {/* Decline All Option */}
              <div className="mt-6 pt-4 border-t border-gray-300/50">
                <button
                  onClick={declineAllCookies}
                  className="text-sm text-gray-500 hover:text-gray-700 underline neumorphic-sm px-3 py-1 rounded-lg transition-all duration-300"
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
