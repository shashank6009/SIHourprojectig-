import { notFound } from 'next/navigation';
import { locales } from '../../../i18n/routing';

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: 'PM Internship Scheme Portal',
    description: 'Official portal for the Prime Minister\'s Internship Scheme',
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'ta': '/ta',
        'hi': '/hi',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as typeof locales[number])) {
    notFound();
  }

  return (
    <>
      {children}
    </>
  );
}
