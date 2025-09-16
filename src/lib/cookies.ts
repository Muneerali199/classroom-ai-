/**
 * Cookie management utilities for EduTrack
 * Provides functions to set, get, and manage cookies with proper consent handling
 */

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export interface CookieConsent {
  consent: 'accepted' | 'necessary-only' | 'declined';
  preferences: CookiePreferences;
  timestamp: number;
}

/**
 * Set a cookie with proper attributes
 */
export function setCookie(name: string, value: string, days: number = 365): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const cookieString = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

  // Add Secure flag if on HTTPS
  if (window.location.protocol === 'https:') {
    document.cookie = cookieString + '; Secure';
  } else {
    document.cookie = cookieString;
  }
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

/**
 * Delete a cookie by setting its expiration to past date
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Check if user has given consent for cookies
 */
export function hasCookieConsent(): boolean {
  const consent = localStorage.getItem('cookie-consent');
  return consent === 'accepted' || consent === 'necessary-only';
}

/**
 * Get user's cookie preferences
 */
export function getCookiePreferences(): CookiePreferences {
  const defaultPreferences: CookiePreferences = {
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  };

  try {
    const stored = localStorage.getItem('cookie-preferences');
    if (stored) {
      return { ...defaultPreferences, ...JSON.parse(stored) };
    }
  } catch {
    // Suppress error in production
  }

  return defaultPreferences;
}

/**
 * Set user's cookie consent and preferences
 */
export function setCookieConsent(consent: 'accepted' | 'necessary-only' | 'declined', preferences?: Partial<CookiePreferences>): void {
  const defaultPreferences: CookiePreferences = {
    necessary: true,
    analytics: consent === 'accepted',
    marketing: consent === 'accepted',
    functional: consent === 'accepted',
  };

  const finalPreferences = { ...defaultPreferences, ...preferences };

  localStorage.setItem('cookie-consent', consent);
  localStorage.setItem('cookie-preferences', JSON.stringify(finalPreferences));
  localStorage.setItem('cookie-consent-timestamp', Date.now().toString());

  // Apply cookie settings based on preferences
  applyCookieSettings(finalPreferences);
}

/**
 * Apply cookie settings based on user preferences
 */
export function applyCookieSettings(preferences: CookiePreferences): void {
  // Handle analytics cookies
  if (preferences.analytics) {
    // Enable analytics tracking
    enableAnalytics();
  } else {
    // Disable analytics tracking
    disableAnalytics();
  }

  // Handle marketing cookies
  if (preferences.marketing) {
    // Enable marketing cookies
    enableMarketing();
  } else {
    // Disable marketing cookies
    disableMarketing();
  }

  // Handle functional cookies
  if (preferences.functional) {
    // Enable functional cookies
    enableFunctional();
  } else {
    // Disable functional cookies
    disableFunctional();
  }
}

/**
 * Enable analytics tracking
 */
function enableAnalytics(): void {
  // Set analytics cookie
  setCookie('edutrack_analytics', 'enabled', 365);

  // Initialize analytics (Google Analytics, etc.)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted'
    });
  }
}

/**
 * Disable analytics tracking
 */
function disableAnalytics(): void {
  // Remove analytics cookie
  deleteCookie('edutrack_analytics');

  // Disable analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied'
    });
  }
}

/**
 * Enable marketing cookies
 */
function enableMarketing(): void {
  setCookie('edutrack_marketing', 'enabled', 365);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      ad_storage: 'granted'
    });
  }
}

/**
 * Disable marketing cookies
 */
function disableMarketing(): void {
  deleteCookie('edutrack_marketing');

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      ad_storage: 'denied'
    });
  }
}

/**
 * Enable functional cookies
 */
function enableFunctional(): void {
  setCookie('edutrack_functional', 'enabled', 365);
}

/**
 * Disable functional cookies
 */
function disableFunctional(): void {
  deleteCookie('edutrack_functional');
}

/**
 * Get detailed consent information
 */
export function getConsentDetails(): CookieConsent | null {
  try {
    const consent = localStorage.getItem('cookie-consent');
    const preferences = localStorage.getItem('cookie-preferences');
    const timestamp = localStorage.getItem('cookie-consent-timestamp');

    if (consent && preferences && timestamp) {
      return {
        consent: consent as 'accepted' | 'necessary-only' | 'declined',
        preferences: JSON.parse(preferences),
        timestamp: parseInt(timestamp),
      };
    }
  } catch {
    // Suppress error in production
  }

  return null;
}

/**
 * Reset all cookie preferences (for testing or user request)
 */
export function resetCookiePreferences(): void {
  // Clear localStorage
  localStorage.removeItem('cookie-consent');
  localStorage.removeItem('cookie-preferences');
  localStorage.removeItem('cookie-consent-timestamp');

  // Clear all cookies
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    deleteCookie(name);
  }
}

/**
 * Check if consent is still valid (not older than 1 year)
 */
export function isConsentValid(): boolean {
  const details = getConsentDetails();
  if (!details) return false;

  const oneYear = 365 * 24 * 60 * 60 * 1000;
  return (Date.now() - details.timestamp) < oneYear;
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
