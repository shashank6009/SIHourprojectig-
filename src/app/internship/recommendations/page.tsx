"use client";

import { useMemo } from "react";
import { loadWizard } from "@/lib/internship";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function RecommendationsPage() {
  const data = useMemo(() => loadWizard(), []);

  const fallback = [
    {
      title: "Data Analyst Intern — National Data Platform",
      domain: "IT",
      why: [
        "Matches your skills: SQL, Excel",
        "Duration aligns with your preference",
        "Remote-friendly as preferred",
      ],
    },
    {
      title: "UX Design Intern — Digital Services",
      domain: "Design",
      why: [
        "You entered interest in UI/UX",
        "Portfolio/resume mentions Figma",
        "Inclusive hiring initiative",
      ],
    },
    {
      title: "Operations Intern — Gov Facilitation Centre",
      domain: "Operations",
      why: [
        "Preference: Full-time, 3 months",
        "Tier-based outreach program",
        "Location matches Urban preference",
      ],
    },
  ];

  const recs = fallback; // placeholder until ML API integration

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gov-text mb-1">Personalized Recommendations</h1>
      <p className="text-gray-600 mb-6">Based on your profile and preferences.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recs.map((r, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="text-gov-blue">{r.title}</CardTitle>
              <CardDescription>{r.domain}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {r.why.map((w, i) => (
                  <li key={i}>Why: {w}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


