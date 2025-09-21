"use client";

import { useEffect, useState } from "react";
import { clearWizard, loadWizard, saveWizard } from "@/lib/internship";
import { Bell, ShieldCheck, Rocket } from "lucide-react";
import { steps } from "@/lib/internship";
import { useRouter } from "next/navigation";

export default function ConsentStep() {
  const router = useRouter();
  const [notify, setNotify] = useState("");
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const d = loadWizard();
    setNotify(d.notify ?? "");
    setConsent(Boolean(d.consent));
  }, []);

  useEffect(() => {
    saveWizard({ notify: notify as any, consent });
  }, [notify, consent]);

  const currentIndex = 4; // final step after removing Resume

  const activate = () => {
    if (!consent) return;
    // In production, call API to trigger ML recommendation generation
    clearWizard();
    router.push("/internship/recommendations");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gov-text mb-1 flex items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-gov-blue" /> Notifications & Consent
      </h1>
      <p className="text-gray-600 mb-6">Choose how we reach you and allow recommendations.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Bell className="w-4 h-4 text-gov-blue" /> Preferred channel
          </label>
          <select value={notify} onChange={(e) => setNotify(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="">Select</option>
            <option>WhatsApp</option>
            <option>Email</option>
            <option>SMS</option>
          </select>
        </div>

        <div className="flex items-start gap-3">
          <input id="consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
          <label htmlFor="consent" className="text-sm text-gray-700">
            I allow my data to be used for internship recommendations.
          </label>
        </div>

        <button
          disabled={!consent}
          onClick={activate}
          className="px-4 py-2 rounded bg-gov-blue text-white disabled:opacity-50 flex items-center gap-2"
        >
          <Rocket className="w-4 h-4" /> Activate My Smart Recommendations 🚀
        </button>
      </div>
    </div>
  );
}


