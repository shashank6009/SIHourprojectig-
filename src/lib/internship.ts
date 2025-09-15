export const steps = [
  { key: "basic", label: "Basic Info", href: "/internship/basic-info" },
  { key: "resume", label: "Resume", href: "/internship/resume" },
  { key: "skills", label: "Skills & Interests", href: "/internship/skills" },
  { key: "prefs", label: "Preferences", href: "/internship/preferences" },
  { key: "fairness", label: "Fairness & Accessibility", href: "/internship/fairness" },
  { key: "consent", label: "Consent", href: "/internship/consent" },
];

export function getStepIndex(pathname: string): number {
  const index = steps.findIndex((s) => pathname.startsWith(s.href));
  return index >= 0 ? index : 0;
}

export type WizardData = {
  fullName?: string;
  verifiedId?: string;
  college?: string;
  year?: string;
  resumeUrl?: string;
  extractedEducation?: string[];
  extractedSkills?: string[];
  extractedExperience?: string[];
  skills?: string[];
  preferredDomain?: string;
  careerKeywords?: string[];
  location?: "Remote" | "Hybrid" | "Onsite";
  duration?: "1" | "3" | "6";
  workload?: "Part-time" | "Full-time";
  background?: "Urban" | "Rural" | "Tier-1" | "Tier-2" | "Tier-3";
  language?: string;
  notify?: "WhatsApp" | "Email" | "SMS";
  consent?: boolean;
};

const STORAGE_KEY = "pmis-internship-wizard";

export function loadWizard(): WizardData {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WizardData) : {};
  } catch {
    return {};
  }
}

export function saveWizard(data: Partial<WizardData>) {
  if (typeof window === "undefined") return;
  const current = loadWizard();
  const next = { ...current, ...data };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearWizard() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}


