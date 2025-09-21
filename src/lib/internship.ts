export const steps = [
  { key: "basic", label: "Basic Info", href: "/internship/basic-info" },
  // Resume upload is handled elsewhere; removed from the wizard
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
  degree?: string;
  cgpa?: string; // keep as string; normalized later for ML
  // Optional: artifacts from resume parsing (populated by the other uploader)
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
    const base = raw ? (JSON.parse(raw) as WizardData) : {};

    // Merge in values extracted from the uploaded resume (if present)
    // without overriding anything the user already typed in the wizard.
    try {
      const sraw = window.sessionStorage.getItem("intern_form_data");
      if (sraw) {
        const ext = JSON.parse(sraw) as any;
        const merged: WizardData = { ...base };
        if (!merged.fullName && ext.name) merged.fullName = ext.name;
        if (!merged.college && ext.university) merged.college = ext.university;
        if (!merged.degree && ext.degree) merged.degree = ext.degree;
        if (!merged.cgpa && ext.cgpa) merged.cgpa = String(ext.cgpa);
        if ((!merged.skills || merged.skills.length === 0) && ext.technicalSkills) {
          merged.skills = String(ext.technicalSkills)
            .split(/[,\n;]+/)
            .map((s) => s.trim())
            .filter(Boolean)
            .slice(0, 5);
        }
        if (!merged.preferredDomain && ext.preferredDomain) merged.preferredDomain = ext.preferredDomain;
        if (!merged.location && ext.preferredLocation) merged.location = ext.preferredLocation;
        return merged;
      }
    } catch {}

    return base;
  } catch {
    return {};
  }
}

export function saveWizard(data: Partial<WizardData>) {
  if (typeof window === "undefined") return;
  const current = loadWizard();
  const next = { ...current, ...data };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

  // Mirror essential fields to sessionStorage so ML/recommendations can rebuild profile
  try {
    const internForm = {
      name: next.fullName || "",
      university: next.college || "",
      degree: next.degree || "",
      cgpa: next.cgpa || "",
      technicalSkills: (next.skills || []).join(", "),
      preferredDomain: next.preferredDomain || "",
      preferredLocation: next.location || "",
    } as any;
    window.sessionStorage.setItem("intern_form_data", JSON.stringify(internForm));
  } catch {}
}

export function clearWizard() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}


