"use client";

// Note: useLocale removed to work without NextIntlClientProvider context
import { useRouter, usePathname } from 'next/navigation';
import { useState, useTransition, useEffect, useLayoutEffect } from 'react';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch by only detecting locale after mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Always use 'en' during SSR and initial render to prevent hydration mismatch
  const locale = mounted 
    ? (pathname.startsWith('/ta') ? 'ta' : pathname.startsWith('/hi') ? 'hi' : 'en')
    : 'en';

  const switchLocale = (newLocale: string) => {
    startTransition(() => {
      // Set cookie for persistence
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`;

      console.log('Switching locale from', locale, 'to', newLocale);
      console.log('Current pathname:', pathname);

      // For development, let's use a simpler approach
      // Just redirect to the home page of the new locale
      const newPath = `/${newLocale}`;
      
      console.log('Final new path:', newPath);
      
      // Use window.location for more reliable navigation
      window.location.href = newPath;
      setIsOpen(false);
    });
  };

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' }
  ];

  const currentLanguage = languages.find(lang => lang.code === locale);
  const otherLanguage = languages.find(lang => lang.code !== locale);

  // Show loading state during hydration to prevent mismatch
  if (!mounted) {
    return (
      <div className="relative">
        <button
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
          disabled
          aria-pressed="false"
          aria-label="Loading language switcher"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">English</span>
          <span className="sm:hidden">EN</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Mobile/Simple Toggle Button */}
      <button
        onClick={() => switchLocale(otherLanguage?.code || 'en')}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
        aria-pressed={locale === 'ta'}
        aria-label={`Switch to ${otherLanguage?.name || 'English'}`}
        disabled={isPending}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">
          {locale === 'en' ? 'தமிழ்' : 'English'}
        </span>
        <span className="sm:hidden">
          {locale === 'en' ? 'த' : 'EN'}
        </span>
        {isPending && (
          <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin ml-1" />
        )}
      </button>

      {/* Desktop Dropdown (Alternative Implementation) */}
      <div className="hidden lg:block relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
          aria-expanded={isOpen}
          aria-haspopup="true"
          disabled={isPending}
        >
          <Globe className="w-4 h-4" />
          <span>{currentLanguage?.nativeName}</span>
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => switchLocale(language.code)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200 ${
                    locale === language.code 
                      ? 'bg-gray-50 text-gov-navy font-medium' 
                      : 'text-gray-700'
                  }`}
                  disabled={isPending}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{language.nativeName}</div>
                      <div className="text-xs text-gray-500">{language.name}</div>
                    </div>
                    {locale === language.code && (
                      <div className="w-2 h-2 bg-gov-saffron rounded-full" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

// Simplified version for header/nav usage (works without i18n context)
export function SimpleLanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch by only detecting locale after mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Always use 'en' during SSR and initial render to prevent hydration mismatch
  const currentLocale = mounted 
    ? (pathname.startsWith('/ta') ? 'ta' : pathname.startsWith('/hi') ? 'hi' : 'en')
    : 'en';

  const switchLocale = () => {
    // Cycle through languages: en -> ta -> hi -> en
    const newLocale = currentLocale === 'en' ? 'ta' : currentLocale === 'ta' ? 'hi' : 'en';
    startTransition(() => {
      // Set cookie for persistence
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`;

      console.log('Simple switcher: changing from', currentLocale, 'to', newLocale);
      console.log('Current pathname:', pathname);

      // For development, let's use a simpler approach
      // Just redirect to the home page of the new locale
      const newPath = `/${newLocale}`;
      
      console.log('Final new path:', newPath);
      
      // Use window.location for more reliable navigation
      window.location.href = newPath;
    });
  };

  // Show loading state during hydration to prevent mismatch
  if (!mounted) {
    return (
      <button
        className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-white hover:text-gray-200 transition-colors duration-200 border border-white/20 hover:border-white/40 rounded"
        disabled
        aria-pressed="false"
        aria-label="Loading language switcher"
      >
        <Globe className="w-3 h-3" />
        <span>EN</span>
      </button>
    );
  }

  return (
    <button
      onClick={switchLocale}
      className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-white hover:text-gray-200 transition-colors duration-200 border border-white/20 hover:border-white/40 rounded"
      aria-pressed={currentLocale !== 'en'}
      aria-label={`Switch to ${currentLocale === 'en' ? 'Tamil' : currentLocale === 'ta' ? 'Hindi' : 'English'}`}
      disabled={isPending}
    >
      <Globe className="w-3 h-3" />
      <span>{currentLocale === 'en' ? 'தமிழ்' : currentLocale === 'ta' ? 'हिंदी' : 'EN'}</span>
      {isPending && (
        <div className="w-3 h-3 border border-white/40 border-t-transparent rounded-full animate-spin ml-1" />
      )}
    </button>
  );
}
