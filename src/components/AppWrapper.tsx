"use client";

import { useState, useEffect } from "react";
import { GovHeaderTop } from "@/components/GovHeaderTop";
import { MainNav } from "@/components/MainNav";
import { GovFooter } from "@/components/GovFooter";
import { Language } from "@/lib/i18n";
import { initializePWA } from "@/lib/pwa";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const handleTextSizeChange = (size: "small" | "normal" | "large") => {
    document.documentElement.setAttribute("data-text-size", size);
  };

  const handleContrastChange = (highContrast: boolean) => {
    document.documentElement.setAttribute("data-contrast", highContrast ? "high" : "normal");
  };

  // Initialize PWA features
  useEffect(() => {
    initializePWA();
  }, []);

  return (
    <>
      <header>
        <GovHeaderTop
          language={language}
          onLanguageChange={setLanguage}
          onTextSizeChange={handleTextSizeChange}
          onContrastChange={handleContrastChange}
        />
        <MainNav language={language} />
      </header>

      <main id="main-content">
        {children}
      </main>

      <GovFooter language={language} />
    </>
  );
}
