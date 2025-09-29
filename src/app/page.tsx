import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to the default locale
  redirect('/en');
}

// Force static generation for this redirect page
export const dynamic = 'force-static';