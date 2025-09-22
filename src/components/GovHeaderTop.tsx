"use client";

import { useState } from "react";
import { ChevronDown, Minus, Plus, Monitor } from "lucide-react";
import Image from "next/image";
// Replaced shared Button with native buttons to avoid hydration issues
import { i18n, type Language } from "@/lib/i18n";

interface GovHeaderTopProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onTextSizeChange: (size: "small" | "normal" | "large") => void;
  onContrastChange: (highContrast: boolean) => void;
}

export function GovHeaderTop({
  language,
  onLanguageChange,
  onTextSizeChange,
  onContrastChange,
}: GovHeaderTopProps) {
  const [textSize, setTextSize] = useState<"small" | "normal" | "large">("normal");
  const [highContrast, setHighContrast] = useState(false);
  const strings = i18n[language];

  const handleTextSizeChange = (size: "small" | "normal" | "large") => {
    setTextSize(size);
    onTextSizeChange(size);
  };

  const handleContrastChange = () => {
    const newContrast = !highContrast;
    setHighContrast(newContrast);
    onContrastChange(newContrast);
  };

  return (
    <div className="bg-black text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-4 text-sm">
          {/* Left side - Government branding */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <Image
                src="/flag.jpeg"
                alt="Indian Flag"
                width={60}
                height={40}
                className="rounded-sm"
              />
              <span className="hidden sm:inline text-lg font-medium">{strings.governmentOfIndia}</span>
            </div>
            <div className="hidden md:inline text-gray-200 text-lg">|</div>
            <span className="hidden md:inline text-lg">{strings.ministryOfCorporateAffairs}</span>
          </div>

          {/* Right side - Accessibility controls */}
          <div className="flex items-center space-x-6">
            {/* Language selector - simplified to avoid hydration issues */}
            <button 
              className="text-white hover:bg-gray-600 text-base h-9 rounded-md px-3 inline-flex items-center justify-center whitespace-nowrap"
              onClick={() => onLanguageChange(language === "en" ? "hi" : "en")}
              aria-label="Change language"
            >
              <span className="inline-flex items-center gap-1">{strings.language}<ChevronDown className="ml-1 h-4 w-4" /></span>
            </button>

            {/* Text size controls */}
            <div className="flex items-center space-x-2">
              <button
                className="text-white hover:bg-gray-600 p-2 h-8 w-8 rounded-md inline-flex items-center justify-center disabled:opacity-50"
                onClick={() => handleTextSizeChange("small")}
                disabled={textSize === "small"}
                aria-label="Decrease text size"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-base px-2">A</span>
              <button
                className="text-white hover:bg-gray-600 p-2 h-8 w-8 rounded-md inline-flex items-center justify-center disabled:opacity-50"
                onClick={() => handleTextSizeChange("large")}
                disabled={textSize === "large"}
                aria-label="Increase text size"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Contrast toggle */}
            <button
              className="text-white hover:bg-gray-600 text-base h-9 rounded-md px-3 inline-flex items-center justify-center whitespace-nowrap"
              onClick={handleContrastChange}
              aria-label="Toggle contrast"
            >
              <span className="inline-flex items-center gap-2"><Monitor className="h-5 w-5" /> {strings.contrast}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
