"use client";

import { useEffect, useState } from "react";
import { loadWizard, saveWizard } from "@/lib/internship";
import { Accessibility, Languages } from "lucide-react";
import { WizardNav } from "@/components/internship/WizardNav";

export default function FairnessStep() {
  const [background, setBackground] = useState("");
  const [language, setLanguage] = useState("");

  useEffect(() => {
    const d = loadWizard();
    setBackground(d.background ?? "");
    setLanguage(d.language ?? "");
  }, []);

  useEffect(() => {
    saveWizard({ background: background as any, language });
  }, [background, language]);

  const currentIndex = 4;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gov-text mb-1 flex items-center gap-2">
        <Accessibility className="w-6 h-6 text-gov-blue" /> Fairness & Accessibility
      </h1>
      <p className="text-gray-600 mb-6">Help us ensure inclusive recommendations.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
          <select value={background} onChange={(e) => setBackground(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="">Select</option>
            <option>Urban</option>
            <option>Rural</option>
            <option>Tier-1</option>
            <option>Tier-2</option>
            <option>Tier-3</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Languages className="w-4 h-4 text-gov-blue" /> Preferred Language
          </label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="">Select</option>
            <option>English</option>
            <option>Hindi</option>
            <option>Tamil</option>
          </select>
        </div>
      </div>

      <WizardNav currentIndex={currentIndex} />
    </div>
  );
}


