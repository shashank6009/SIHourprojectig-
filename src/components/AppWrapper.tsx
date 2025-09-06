"use client";

import { useState } from "react";
import { GovHeaderTop } from "@/components/GovHeaderTop";
import { MainNav } from "@/components/MainNav";
import { GovFooter } from "@/components/GovFooter";
import { Language } from "@/lib/i18n";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [textSize, setTextSize] = useState<"small" | "normal" | "large">("normal");
  const [highContrast, setHighContrast] = useState(false);

  const handleTextSizeChange = (size: "small" | "normal" | "large") => {
    setTextSize(size);
    document.documentElement.setAttribute("data-text-size", size);
  };

  const handleContrastChange = (highContrast: boolean) => {
    setHighContrast(highContrast);
    document.documentElement.setAttribute("data-contrast", highContrast ? "high" : "normal");
  };

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
