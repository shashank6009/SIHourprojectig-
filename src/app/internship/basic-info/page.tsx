"use client";

import { useEffect, useMemo, useState } from "react";
import { saveWizard, loadWizard, steps } from "@/lib/internship";
import { User, IdCard, School, Calendar } from "lucide-react";
import { WizardNav } from "@/components/internship/WizardNav";

const colleges = [
  "Indian Institute of Technology, Delhi",
  "Indian Institute of Technology, Bombay",
  "National Institute of Technology, Trichy",
  "University of Delhi",
  "Anna University",
];

export default function BasicInfo() {
  const [fullName, setFullName] = useState("");
  const [verifiedId, setVerifiedId] = useState("");
  const [college, setCollege] = useState("");
  const [year, setYear] = useState("");

  // Autofill name from hypothetical login in future; for now from storage
  useEffect(() => {
    const data = loadWizard();
    if (data.fullName) setFullName(data.fullName);
    if (data.verifiedId) setVerifiedId(data.verifiedId);
    if (data.college) setCollege(data.college);
    if (data.year) setYear(data.year);
  }, []);

  useEffect(() => {
    saveWizard({ fullName, verifiedId, college, year });
  }, [fullName, verifiedId, college, year]);

  const suggestions = useMemo(() => {
    const q = college.toLowerCase();
    if (!q) return [] as string[];
    return colleges.filter((c) => c.toLowerCase().includes(q)).slice(0, 5);
  }, [college]);

  const currentIndex = 0;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gov-text mb-1 flex items-center gap-2">
        <User className="w-6 h-6 text-gov-blue" /> Basic Info
      </h1>
      <p className="text-gray-600 mb-6">Tell us a little about yourself.</p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <div className="relative">
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gov-blue"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <IdCard className="w-4 h-4 text-gov-blue" /> Verified ID (Aadhaar/DigiLocker) — coming soon
          </label>
          <input
            value={verifiedId}
            onChange={(e) => setVerifiedId(e.target.value)}
            placeholder="Enter ID or leave blank"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gov-blue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <School className="w-4 h-4 text-gov-blue" /> College Name *
          </label>
          <input
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            placeholder="Start typing your college"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gov-blue"
          />
          {suggestions.length > 0 && (
            <div className="mt-2 border rounded bg-white shadow">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setCollege(s)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gov-blue" /> Year of Study
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gov-blue"
          >
            <option value="">Select</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
      </div>

      <WizardNav currentIndex={currentIndex} />
      <p className="text-xs text-gray-500 mt-3">Mandatory: Name, College</p>
    </div>
  );
}


