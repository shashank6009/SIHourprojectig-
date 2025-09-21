import type { Metadata, Viewport } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { AppWrapper } from "@/components/AppWrapper";
import { AuthProvider } from "@/components/AuthProvider";
import { OfflineStatus } from "@/components/OfflineStatus";
import { PWAInstaller } from "@/components/PWAInstaller";

const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap" });

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
    <html lang="en">
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

        <AuthProvider>
          <OfflineStatus />
          <AppWrapper>
            {children}
          </AppWrapper>
          <PWAInstaller />
        </AuthProvider>
      </body>
    </html>
  );
}
