import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  // English, Spanish, and all major Indian languages
  locales: [
    'en',    // English
    'es',    // Spanish
    'hi',    // Hindi
    'bn',    // Bengali
    'te',    // Telugu
    'mr',    // Marathi
    'ta',    // Tamil
    'gu',    // Gujarati
    'ur',    // Urdu
    'kn',    // Kannada
    'or',    // Odia
    'ml',    // Malayalam
    'pa',    // Punjabi
    'as',    // Assamese
    'mai',   // Maithili
    'mag',   // Magahi
    'bho',   // Bhojpuri
    'raj',   // Rajasthani
    'bpy',   // Bishnupriya
    'hne',   // Chhattisgarhi
    'gom',   // Konkani
    'sa',    // Sanskrit
    'ne',    // Nepali
    'ks',    // Kashmiri
    'sd',    // Sindhi
    'doi',   // Dogri
    'mni',   // Manipuri
    'sat',   // Santali
    'kok',   // Konkani (Goan)
    'brx'    // Bodo
  ],

  // Used when no locale matches
  defaultLocale: 'en'
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);