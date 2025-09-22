"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Minus, Plus, Monitor } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
  const [mounted, setMounted] = useState(false);
  const strings = i18n[language];

  useEffect(() => {
    setMounted(true);
  }, []);

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
            {/* Language dropdown */}
            {mounted ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-gray-600 text-base">
                    {strings.language}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onLanguageChange("en")}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onLanguageChange("hi")}>
                    हिंदी
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onLanguageChange("ta")}>
                    தமிழ்
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-600 text-base">
                {strings.language}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            )}

            {/* Text size controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-600 p-2"
                onClick={() => handleTextSizeChange("small")}
                disabled={textSize === "small"}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-base px-2">A</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-600 p-2"
                onClick={() => handleTextSizeChange("large")}
                disabled={textSize === "large"}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Contrast toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-600 text-base"
              onClick={handleContrastChange}
            >
              <Monitor className="h-5 w-5 mr-2" />
              {strings.contrast}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
