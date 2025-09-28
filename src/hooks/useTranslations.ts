"use client";

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

// Import translation files
import enTranslations from '../../locales/en/common.json';
import taTranslations from '../../locales/ta/common.json';
import hiTranslations from '../../locales/hi/common.json';

const translations = {
  en: enTranslations,
  ta: taTranslations,
  hi: hiTranslations,
};

export function useTranslations() {
  const pathname = usePathname();
  
  const locale = useMemo(() => {
    if (pathname.startsWith('/ta')) return 'ta';
    if (pathname.startsWith('/hi')) return 'hi';
    return 'en';
  }, [pathname]);

  const t = useMemo(() => {
    return (key: string, fallback?: string) => {
      const translation = translations[locale]?.[key as keyof typeof translations[typeof locale]];
      return translation || fallback || key;
    };
  }, [locale]);

  return { t, locale };
}
