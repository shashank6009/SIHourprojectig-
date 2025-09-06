import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppWrapper } from "@/components/AppWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prime Minister's Internship Scheme (PMIS)",
  description: "Official portal for the Prime Minister's Internship Scheme",
  themeColor: "#0B5CAB",
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
        <meta name="theme-color" content="#0B5CAB" />
      </head>
      <body className={inter.className}>
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-gov-blue text-white px-4 py-2 rounded z-50"
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
