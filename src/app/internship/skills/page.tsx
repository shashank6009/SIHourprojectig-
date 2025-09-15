"use client";

import { useEffect, useMemo, useState } from "react";
import { loadWizard, saveWizard } from "@/lib/internship";
import { Sparkles, Briefcase } from "lucide-react";
import { WizardNav } from "@/components/internship/WizardNav";

const SKILL_BANK = [
  "Python", "JavaScript", "TypeScript", "React", "Next.js", "SQL", "NoSQL", "Figma", "UI/UX", "Excel", "Data Analysis", "Machine Learning", "Java", "C++", "AWS", "Docker"
];

const DOMAINS = ["IT", "Finance", "Marketing", "Healthcare", "Design", "Operations"];

export default function SkillsStep() {
  const [skillQuery, setSkillQuery] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [domain, setDomain] = useState("");
  const [keywords, setKeywords] = useState<string>("");

  useEffect(() => {
    const d = loadWizard();
    setSkills(d.skills ?? []);
    setDomain(d.preferredDomain ?? "");
    setKeywords((d.careerKeywords ?? []).join(", "));
  }, []);

  useEffect(() => {
    saveWizard({ skills, preferredDomain: domain, careerKeywords: keywords.split(/,\s*/).filter(Boolean).slice(0, 3) });
  }, [skills, domain, keywords]);

  const filtered = useMemo(() => {
    const q = skillQuery.toLowerCase();
    return SKILL_BANK.filter((s) => s.toLowerCase().includes(q) && !skills.includes(s)).slice(0, 6);
  }, [skillQuery, skills]);

  const addSkill = (s: string) => {
    if (skills.length >= 5) return;
    setSkills((prev) => [...prev, s]);
    setSkillQuery("");
  };

  const removeSkill = (s: string) => setSkills((prev) => prev.filter((x) => x !== s));

  const currentIndex = 2;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gov-text mb-1 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-gov-blue" /> Skills & Interests
      </h1>
      <p className="text-gray-600 mb-6">Pick up to 5 skills and your preferred domain.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Top 5 Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map((s) => (
              <span key={s} className="px-2 py-1 bg-gov-gray rounded text-sm">
                {s}
                <button className="ml-2 text-gray-500" onClick={() => removeSkill(s)}>×</button>
              </span>
            ))}
          </div>
          <input
            value={skillQuery}
            onChange={(e) => setSkillQuery(e.target.value)}
            placeholder="Type a skill"
            className="w-full border rounded px-3 py-2"
          />
          {filtered.length > 0 && (
            <div className="mt-2 border rounded bg-white shadow">
              {filtered.map((s) => (
                <button key={s} onClick={() => addSkill(s)} className="w-full text-left px-3 py-2 hover:bg-gray-50">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gov-blue" /> Preferred Internship Domain
          </label>
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select</option>
            {DOMAINS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Career Goal Keywords (max 3)</label>
          <input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g., Data Scientist, UX Designer"
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <WizardNav currentIndex={currentIndex} />
    </div>
  );
}


