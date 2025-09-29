import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/routing';

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale,
  
  // Always show locale prefix
  localePrefix: 'always',
  
  // Redirect to default locale if no locale is provided
  localeDetection: true
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    // - … admin, dashboard, login, register, profile, copilot, api-demo, api-test, offline, test-internship pages
    '/((?!api|_next|_vercel|admin|dashboard|login|register|profile|copilot|api-demo|api-test|offline|test-internship|.*\\..*).*)'
  ]
};
