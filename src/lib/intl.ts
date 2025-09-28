/**
 * Internationalization utilities for number and date formatting
 * Supports English (en) and Tamil (ta-IN) locales
 */

// Locale mapping for proper Intl API usage
const LOCALE_MAP = {
  'en': 'en-IN', // English (India)
  'ta': 'ta-IN'  // Tamil (India)
} as const;

/**
 * Format numbers according to locale
 * @param num - The number to format
 * @param locale - The locale code ('en' or 'ta')
 * @param options - Intl.NumberFormatOptions
 * @returns Formatted number string
 */
export const formatNumber = (
  num: number, 
  locale: string = 'en',
  options?: Intl.NumberFormatOptions
): string => {
  const intlLocale = LOCALE_MAP[locale as keyof typeof LOCALE_MAP] || 'en-IN';
  
  try {
    return new Intl.NumberFormat(intlLocale, {
      maximumFractionDigits: 2,
      ...options
    }).format(num);
  } catch (error) {
    console.warn(`Failed to format number for locale ${intlLocale}:`, error);
    return num.toString();
  }
};

/**
 * Format currency according to locale
 * @param amount - The amount to format
 * @param locale - The locale code ('en' or 'ta')
 * @param currency - Currency code (default: 'INR')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  locale: string = 'en',
  currency: string = 'INR'
): string => {
  const intlLocale = LOCALE_MAP[locale as keyof typeof LOCALE_MAP] || 'en-IN';
  
  try {
    return new Intl.NumberFormat(intlLocale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (error) {
    console.warn(`Failed to format currency for locale ${intlLocale}:`, error);
    return `₹${amount.toLocaleString()}`;
  }
};

/**
 * Format dates according to locale
 * @param date - The date to format
 * @param locale - The locale code ('en' or 'ta')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string | number,
  locale: string = 'en',
  options?: Intl.DateTimeFormatOptions
): string => {
  const intlLocale = LOCALE_MAP[locale as keyof typeof LOCALE_MAP] || 'en-IN';
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    console.warn('Invalid date provided to formatDate');
    return 'Invalid Date';
  }
  
  try {
    return new Intl.DateTimeFormat(intlLocale, {
      dateStyle: 'medium',
      ...options
    }).format(dateObj);
  } catch (error) {
    console.warn(`Failed to format date for locale ${intlLocale}:`, error);
    return dateObj.toLocaleDateString();
  }
};

/**
 * Format relative time (e.g., "2 days ago", "in 3 hours")
 * @param date - The target date
 * @param locale - The locale code ('en' or 'ta')
 * @param baseDate - The base date to compare against (default: now)
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (
  date: Date | string | number,
  locale: string = 'en',
  baseDate: Date = new Date()
): string => {
  const intlLocale = LOCALE_MAP[locale as keyof typeof LOCALE_MAP] || 'en-IN';
  const targetDate = new Date(date);
  
  if (isNaN(targetDate.getTime())) {
    console.warn('Invalid date provided to formatRelativeTime');
    return 'Invalid Date';
  }
  
  try {
    const rtf = new Intl.RelativeTimeFormat(intlLocale, { numeric: 'auto' });
    const diffInSeconds = (targetDate.getTime() - baseDate.getTime()) / 1000;
    
    // Determine the appropriate unit
    const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
      { unit: 'year', seconds: 31536000 },
      { unit: 'month', seconds: 2592000 },
      { unit: 'week', seconds: 604800 },
      { unit: 'day', seconds: 86400 },
      { unit: 'hour', seconds: 3600 },
      { unit: 'minute', seconds: 60 },
      { unit: 'second', seconds: 1 }
    ];
    
    for (const { unit, seconds } of units) {
      const value = Math.round(diffInSeconds / seconds);
      if (Math.abs(value) >= 1) {
        return rtf.format(value, unit);
      }
    }
    
    return rtf.format(0, 'second');
  } catch (error) {
    console.warn(`Failed to format relative time for locale ${intlLocale}:`, error);
    return targetDate.toLocaleDateString();
  }
};

/**
 * Format percentage according to locale
 * @param value - The value to format as percentage (0.5 = 50%)
 * @param locale - The locale code ('en' or 'ta')
 * @param options - Additional formatting options
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number,
  locale: string = 'en',
  options?: Intl.NumberFormatOptions
): string => {
  const intlLocale = LOCALE_MAP[locale as keyof typeof LOCALE_MAP] || 'en-IN';
  
  try {
    return new Intl.NumberFormat(intlLocale, {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
      ...options
    }).format(value);
  } catch (error) {
    console.warn(`Failed to format percentage for locale ${intlLocale}:`, error);
    return `${Math.round(value * 100)}%`;
  }
};

/**
 * Format time duration (e.g., "2 hours 30 minutes")
 * @param seconds - Duration in seconds
 * @param locale - The locale code ('en' or 'ta')
 * @returns Formatted duration string
 */
export const formatDuration = (
  seconds: number,
  locale: string = 'en'
): string => {
  const intlLocale = LOCALE_MAP[locale as keyof typeof LOCALE_MAP] || 'en-IN';
  
  try {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    const parts: string[] = [];
    
    if (hours > 0) {
      const hourFormatter = new Intl.NumberFormat(intlLocale);
      parts.push(`${hourFormatter.format(hours)} ${locale === 'ta' ? 'மணி' : 'hour'}${hours !== 1 ? (locale === 'ta' ? '' : 's') : ''}`);
    }
    
    if (minutes > 0) {
      const minuteFormatter = new Intl.NumberFormat(intlLocale);
      parts.push(`${minuteFormatter.format(minutes)} ${locale === 'ta' ? 'நிமிடம்' : 'minute'}${minutes !== 1 ? (locale === 'ta' ? '' : 's') : ''}`);
    }
    
    if (remainingSeconds > 0 && hours === 0) {
      const secondFormatter = new Intl.NumberFormat(intlLocale);
      parts.push(`${secondFormatter.format(remainingSeconds)} ${locale === 'ta' ? 'விநாடி' : 'second'}${remainingSeconds !== 1 ? (locale === 'ta' ? '' : 's') : ''}`);
    }
    
    return parts.join(' ');
  } catch (error) {
    console.warn(`Failed to format duration for locale ${intlLocale}:`, error);
    return `${seconds}s`;
  }
};

/**
 * Format file size (e.g., "1.5 MB", "2.3 GB")
 * @param bytes - Size in bytes
 * @param locale - The locale code ('en' or 'ta')
 * @returns Formatted file size string
 */
export const formatFileSize = (
  bytes: number,
  locale: string = 'en'
): string => {
  const intlLocale = LOCALE_MAP[locale as keyof typeof LOCALE_MAP] || 'en-IN';
  
  try {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const unitsTamil = ['பை', 'கேபி', 'எம்பி', 'ஜிபி', 'டிபி'];
    
    if (bytes === 0) return `0 ${locale === 'ta' ? unitsTamil[0] : units[0]}`;
    
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = bytes / Math.pow(k, i);
    
    const formatter = new Intl.NumberFormat(intlLocale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    });
    
    const unitArray = locale === 'ta' ? unitsTamil : units;
    return `${formatter.format(size)} ${unitArray[i]}`;
  } catch (error) {
    console.warn(`Failed to format file size for locale ${intlLocale}:`, error);
    return `${bytes} bytes`;
  }
};

/**
 * Get the appropriate locale for Intl APIs
 * @param locale - The app locale code
 * @returns The Intl-compatible locale string
 */
export const getIntlLocale = (locale: string): string => {
  return LOCALE_MAP[locale as keyof typeof LOCALE_MAP] || 'en-IN';
};

/**
 * Example usage component for testing
 */
export const IntlExamples = {
  number: {
    en: formatNumber(123456.789, 'en'),
    ta: formatNumber(123456.789, 'ta')
  },
  currency: {
    en: formatCurrency(50000, 'en'),
    ta: formatCurrency(50000, 'ta')
  },
  date: {
    en: formatDate(new Date(), 'en'),
    ta: formatDate(new Date(), 'ta')
  },
  percentage: {
    en: formatPercentage(0.85, 'en'),
    ta: formatPercentage(0.85, 'ta')
  },
  duration: {
    en: formatDuration(7890, 'en'),
    ta: formatDuration(7890, 'ta')
  },
  fileSize: {
    en: formatFileSize(1048576, 'en'),
    ta: formatFileSize(1048576, 'ta')
  }
};
