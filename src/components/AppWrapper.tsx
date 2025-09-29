"use client";

import { useState, useEffect } from "react";
import { GovHeaderTop } from "@/components/GovHeaderTop";
import { MainNav } from "@/components/MainNav";
import { GovFooter } from "@/components/GovFooter";
import { initializePWA } from "@/lib/pwa";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  const handleTextSizeChange = (size: "small" | "normal" | "large") => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute("data-text-size", size);
    }
  };

  const handleContrastChange = (highContrast: boolean) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute("data-contrast", highContrast ? "high" : "normal");
    }
  };

  // Initialize PWA features and set mounted state
  useEffect(() => {
    setMounted(true);
    initializePWA();
  }, []);

  return (
    <>
      <header>
        <GovHeaderTop
          onTextSizeChange={handleTextSizeChange}
          onContrastChange={handleContrastChange}
        />
        <MainNav />
      </header>

      <main id="main-content">
        {children}
      </main>

      <GovFooter />
    </>
  );
}
