import type { Metadata, Viewport } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { AppWrapper } from "@/components/AppWrapper";

const notoSans = Noto_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Prime Minister's Internship Scheme (PMIS)",
  description: "Official portal for the Prime Minister's Internship Scheme",
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

        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
