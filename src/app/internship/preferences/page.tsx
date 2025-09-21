"use client";

import { useEffect, useState } from "react";
import { loadWizard, saveWizard } from "@/lib/internship";
import { MapPin, Timer, Clock } from "lucide-react";
import { WizardNav } from "@/components/internship/WizardNav";

export default function PreferencesStep() {
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [workload, setWorkload] = useState("");

  useEffect(() => {
    const d = loadWizard();
    setLocation(d.location ?? "");
    setDuration(d.duration ?? "");
    setWorkload(d.workload ?? "");
  }, []);

  useEffect(() => {
    saveWizard({ location: location as string, duration: duration as string, workload: workload as string });
  }, [location, duration, workload]);

  const currentIndex = 2;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gov-text mb-1 flex items-center gap-2">
        <MapPin className="w-6 h-6 text-gov-blue" /> Preferences
      </h1>
      <p className="text-gray-600 mb-6">Tell us how you prefer to work.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="">Select</option>
            <option>Remote</option>
            <option>Hybrid</option>
            <option>Onsite</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Timer className="w-4 h-4 text-gov-blue" /> Duration</label>
          <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="">Select</option>
            <option value="1">1 month</option>
            <option value="3">3 months</option>
            <option value="6">6 months</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Clock className="w-4 h-4 text-gov-blue" /> Workload</label>
          <select value={workload} onChange={(e) => setWorkload(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="">Select</option>
            <option>Part-time</option>
            <option>Full-time</option>
          </select>
        </div>
      </div>

      <WizardNav currentIndex={currentIndex} />
    </div>
  );
}


