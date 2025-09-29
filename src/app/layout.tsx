import type { Metadata, Viewport } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { AppWrapper } from "@/components/AppWrapper";
import { AuthProvider } from "@/components/AuthProvider";
import { OfflineStatus } from "@/components/OfflineStatus";
import { LocaleProvider } from "@/components/LocaleProvider";

const notoSans = Noto_Sans({ 
  subsets: ["latin", "latin-ext"], 
  display: "swap",
  variable: "--font-noto-sans",
});

// Add Noto Sans Tamil for Tamil locale
const notoSansTamil = Noto_Sans({
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans-tamil",
});

// Add Noto Sans Devanagari for Hindi locale
const notoSansHindi = Noto_Sans({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans-hindi",
});

export const metadata: Metadata = {
  title: "Prime Minister's Internship Scheme (PMIS)",
  description: "Official portal for the Prime Minister's Internship Scheme - Apply for internships, manage your profile, and access government opportunities offline",
  keywords: ["PM Internship", "Government Internship", "India", "Career", "Jobs", "Students"],
  authors: [{ name: "Government of India" }],
  creator: "Ministry of Corporate Affairs",
  publisher: "Government of India",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PMIS Portal",
  },
  icons: {
    icon: [
      { url: "/pwa-icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa-icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/pwa-icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/pwa-icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  openGraph: {
    title: "PM Internship Scheme Portal",
    description: "Official portal for applying to government internship opportunities",
    url: "https://pminternship.mca.gov.in",
    siteName: "PM Internship Scheme",
    images: [
      {
        url: "/pwa-screenshots/desktop-home.png",
        width: 1280,
        height: 720,
        alt: "PM Internship Scheme Portal",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Internship Scheme Portal",
    description: "Apply for government internships - Available offline",
    images: ["/pwa-screenshots/desktop-home.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B3D91",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <html lang="en" className={`${notoSans.variable} ${notoSansTamil.variable} ${notoSansHindi.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={notoSans.className}>
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-gov-navy text-white px-4 py-2 rounded z-50"
        >
          Skip to content
        </a>

        <LocaleProvider>
          <AuthProvider>
            <OfflineStatus />
            <AppWrapper>
              {children}
            </AppWrapper>
          </AuthProvider>
        </LocaleProvider>

        {/* Global download prevention script */}
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              // Nuclear download prevention
              const preventDownloads = (e) => {
                const target = e.target;
                if (target.tagName === 'A') {
                  const anchor = target;
                  if (anchor.download || anchor.href.includes('blob:') || anchor.href.includes('data:') || anchor.href.includes('download')) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    console.log('🚫 DOWNLOAD BLOCKED:', anchor.href);
                    alert('Download functionality has been disabled on this site.');
                    return false;
                  }
                }
                // Block any programmatic blob/data URL navigation
                if (target.click && (target.href?.includes('blob:') || target.href?.includes('data:'))) {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🚫 PROGRAMMATIC DOWNLOAD BLOCKED');
                  return false;
                }
              };
              
              // Add multiple levels of download prevention
              document.addEventListener('click', preventDownloads, true);
              document.addEventListener('mousedown', preventDownloads, true);
              document.addEventListener('auxclick', preventDownloads, true);
              
              // Override window.open for blob/data URLs
              const originalOpen = window.open;
              window.open = function(url, ...args) {
                if (typeof url === 'string' && (url.includes('blob:') || url.includes('data:'))) {
                  console.log('🚫 WINDOW.OPEN DOWNLOAD BLOCKED:', url);
                  alert('Download functionality has been disabled.');
                  return null;
                }
                return originalOpen.call(this, url, ...args);
              };
              
              console.log('✅ Global download prevention activated');
            });
          `
        }} />

        {/* ElevenLabs ConvAI Widget */}
        <elevenlabs-convai agent-id="agent_9201k5sry698e14sf58cpbyfrdkx"></elevenlabs-convai>
        <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
      </body>
    </html>
  );
}
