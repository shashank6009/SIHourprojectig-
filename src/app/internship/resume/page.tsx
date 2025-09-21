"use client";

import { useEffect } from "react";
import { loadWizard } from "@/lib/internship";
import { FileUp } from "lucide-react";
import { WizardNav } from "@/components/internship/WizardNav";

export default function ResumeStep() {
  useEffect(() => {
    // Nothing to do; kept for backward compatibility.
    loadWizard();
  }, []);

  const currentIndex = 1;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gov-text mb-1 flex items-center gap-2">
        <FileUp className="w-6 h-6 text-gov-blue" /> Resume Upload
      </h1>
      <p className="text-gray-600 mb-6">Resume upload is handled in the Intern section already. We will continue to prefill your details in the wizard based on the parsed resume.</p>

      <WizardNav currentIndex={currentIndex} />
    </div>
  );
}


