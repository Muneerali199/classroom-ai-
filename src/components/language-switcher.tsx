"use client";

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/routing';
import { Globe, Search } from 'lucide-react';
import { useState } from 'react';

const LOCALE_LABELS: Record<string, string> = {
  en: 'English',
  es: 'Español',
  hi: 'हिन्दी (Hindi)',
  bn: 'বাংলা (Bengali)',
  te: 'తెలుగు (Telugu)',
  mr: 'मराठी (Marathi)',
  ta: 'தமிழ் (Tamil)',
  gu: 'ગુજરાતી (Gujarati)',
  ur: 'اردو (Urdu)',
  kn: 'ಕನ್ನಡ (Kannada)',
  or: 'ଓଡ଼ିଆ (Odia)',
  ml: 'മലയാളം (Malayalam)',
  pa: 'ਪੰਜਾਬੀ (Punjabi)',
  as: 'অসমীয়া (Assamese)',
  ne: 'नेपाली (Nepali)',
  sa: 'संस्कृतम् (Sanskrit)',
  mai: 'मैथिली (Maithili)',
  mag: 'मगही (Magahi)',
  bho: 'भोजपुरी (Bhojpuri)',
  raj: 'राजस्थानी (Rajasthani)',
  bpy: 'বিষ্ণুপ্রিয়া (Bishnupriya)',
  hne: 'छत्तीसगढ़ी (Chhattisgarhi)',
  gom: 'कोंकणी (Konkani)',
  ks: 'कॉशुर (Kashmiri)',
  sd: 'سنڌي (Sindhi)',
  doi: 'डोगरी (Dogri)',
  mni: 'মৈতৈলোন্ (Manipuri)',
  sat: 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)',
  kok: 'कोंकणी (Konkani Goan)',
  brx: 'बर\' (Bodo)'
};

// Group languages by category for better organization
const LANGUAGE_GROUPS = {
  'International': ['en', 'es'],
  'Major Indian Languages': ['hi', 'bn', 'te', 'mr', 'ta', 'gu', 'ur', 'kn', 'or', 'ml', 'pa', 'as'],
  'Regional & Classical': ['ne', 'sa', 'mai', 'mag', 'bho', 'raj', 'bpy', 'hne', 'gom', 'ks', 'sd', 'doi', 'mni', 'sat', 'kok', 'brx']
};

export default function LanguageSwitcher() {
  const locale = useLocale() as keyof typeof LOCALE_LABELS;
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelect = (nextLocale: keyof typeof LOCALE_LABELS) => {
    // Replace current path with same pathname under new locale
    router.replace(pathname, { locale: nextLocale });
  };

  // Filter languages based on search term
  const filteredLanguages = Object.entries(LOCALE_LABELS).filter(([code, label]) =>
    label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderLanguageGroup = (groupName: string, languageCodes: string[]) => {
    const groupLanguages = languageCodes.filter(code => 
      filteredLanguages.some(([filteredCode]) => filteredCode === code)
    );

    if (groupLanguages.length === 0) return null;

    return (
      <div key={groupName}>
        <DropdownMenuLabel className="text-xs !text-gray-400 px-2 py-1">
          {groupName}
        </DropdownMenuLabel>
        {groupLanguages.map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleSelect(code as keyof typeof LOCALE_LABELS)}
            className={`${code === locale ? 'font-semibold !bg-gray-700 !text-white' : '!text-gray-300 hover:!text-white hover:!bg-gray-700'} cursor-pointer`}
          >
            <span className="flex items-center justify-between w-full">
              {LOCALE_LABELS[code]}
              {code === locale && <span className="text-xs text-primary">✓</span>}
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
      </div>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 px-1 md:px-2 !text-white hover:!bg-gray-700">
          <Globe className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline text-sm">
            {LOCALE_LABELS[locale]?.split(' ')[0] ?? locale}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 md:w-80 max-h-96 overflow-y-auto !bg-gray-800 !border-gray-700">
        <DropdownMenuLabel className="!text-white">Select Language</DropdownMenuLabel>
        <div className="px-2 pb-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8"
            />
          </div>
        </div>
        <DropdownMenuSeparator />
        
        {searchTerm ? (
          // Show filtered results when searching
          filteredLanguages.length > 0 ? (
            filteredLanguages.map(([code, label]) => (
              <DropdownMenuItem
                key={code}
                onClick={() => handleSelect(code as keyof typeof LOCALE_LABELS)}
                className={`${code === locale ? 'font-semibold bg-accent' : ''} cursor-pointer`}
              >
                <span className="flex items-center justify-between w-full">
                  {label}
                  {code === locale && <span className="text-xs text-primary">✓</span>}
                </span>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-2 py-4 text-sm text-muted-foreground text-center">
              No languages found
            </div>
          )
        ) : (
          // Show grouped languages when not searching
          Object.entries(LANGUAGE_GROUPS).map(([groupName, languageCodes]) =>
            renderLanguageGroup(groupName, languageCodes)
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
