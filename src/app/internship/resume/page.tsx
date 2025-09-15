"use client";

import { useEffect, useRef, useState } from "react";
import { loadWizard, saveWizard } from "@/lib/internship";
import { FileUp, ListChecks } from "lucide-react";
import { WizardNav } from "@/components/internship/WizardNav";

export default function ResumeStep() {
  const [resumeUrl, setResumeUrl] = useState<string | undefined>();
  const [education, setEducation] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const data = loadWizard();
    setResumeUrl(data.resumeUrl);
    setEducation(data.extractedEducation ?? []);
    setSkills(data.extractedSkills ?? []);
    setExperience(data.extractedExperience ?? []);
  }, []);

  useEffect(() => {
    saveWizard({
      resumeUrl,
      extractedEducation: education,
      extractedSkills: skills,
      extractedExperience: experience,
    });
  }, [resumeUrl, education, skills, experience]);

  const parseTextHeuristics = async (text: string) => {
    const edu = Array.from(text.matchAll(/(B\.?Tech|B\.?E|M\.?Tech|MBA|BSc|MSc)/gi)).map((m) => m[0]);
    const skl = Array.from(text.matchAll(/(Python|JavaScript|React|SQL|Figma|Design|AWS|Excel)/gi)).map((m) => m[0]);
    const exp = Array.from(text.matchAll(/(Intern|Project|Research|Volunteer)/gi)).map((m) => m[0]);
    setEducation([...new Set(edu)]);
    setSkills([...new Set(skl)]);
    setExperience([...new Set(exp)]);
  };

  const onFile = async (file: File) => {
    const url = URL.createObjectURL(file);
    setResumeUrl(url);
    try {
      const text = await file.text();
      await parseTextHeuristics(text);
    } catch {
      // For binary like PDF/DOCX, skip heuristics here; future: server parse
    }
  };

  const currentIndex = 1;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gov-text mb-1 flex items-center gap-2">
        <FileUp className="w-6 h-6 text-gov-blue" /> Resume (optional)
      </h1>
      <p className="text-gray-600 mb-6">Upload your resume. We'll auto-extract details you can edit.</p>

      <div className="space-y-6">
        <div className="border-2 border-dashed rounded p-6 text-center">
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
          <button
            className="px-4 py-2 rounded bg-gov-blue text-white hover:bg-gov-blueDark"
            onClick={() => fileRef.current?.click()}
          >
            Choose file
          </button>
          {resumeUrl && (
            <p className="text-sm text-gray-600 mt-2">File selected.</p>
          )}
        </div>

        <div>
          <h2 className="font-semibold text-gov-text mb-2 flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-gov-blue" /> Extracted info (editable)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
              <textarea
                value={education.join("\n")}
                onChange={(e) => setEducation(e.target.value.split(/\n+/).filter(Boolean))}
                className="w-full border rounded px-3 py-2 h-28"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
              <textarea
                value={skills.join(", ")}
                onChange={(e) => setSkills(e.target.value.split(/,\s*/).filter(Boolean))}
                className="w-full border rounded px-3 py-2 h-28"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <textarea
                value={experience.join("\n")}
                onChange={(e) => setExperience(e.target.value.split(/\n+/).filter(Boolean))}
                className="w-full border rounded px-3 py-2 h-28"
              />
            </div>
          </div>
        </div>
      </div>

      <WizardNav currentIndex={currentIndex} />
    </div>
  );
}


