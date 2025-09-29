"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";

type Internship = {
  title: string;
  company: string;
  domain: string;
  duration: 1 | 3 | 6;
  location: "Remote" | "Hybrid" | "Onsite";
  success_prob: number; // 0-100
  fairness_tag: string;
  reasons: string[]; // exactly 3
};

const MOCK_INTERNSHIPS: Internship[] = [
  {
    title: "Data Analyst Intern",
    company: "National Data Platform",
    domain: "IT",
    duration: 3,
    location: "Remote",
    success_prob: 82,
    fairness_tag: "Balanced for Rural / Tier-2",
    reasons: [
      "Python, SQL align with requirements",
      "Students from your stream applied here",
      "Fits your Data Analytics focus",
    ],
  },
  {
    title: "Finance Research Intern",
    company: "Public Sector Bank",
    domain: "Finance",
    duration: 1,
    location: "Hybrid",
    success_prob: 76,
    fairness_tag: "Balanced for Rural / Tier-2",
    reasons: [
      "Excel, Statistics match requirements",
      "Peers from your college shortlisted",
      "Fits your Finance specialization",
    ],
  },
  {
    title: "Marketing Outreach Intern",
    company: "Digital India Campaign",
    domain: "Marketing",
    duration: 6,
    location: "Onsite",
    success_prob: 68,
    fairness_tag: "Balanced for Rural / Tier-2",
    reasons: [
      "Content writing and Canva match",
      "High engagement from your stream",
      "Aligned with Public Outreach domain",
    ],
  },
  {
    title: "UX Design Intern",
    company: "National e-Services",
    domain: "Design",
    duration: 3,
    location: "Hybrid",
    success_prob: 74,
    fairness_tag: "Balanced for Rural / Tier-2",
    reasons: [
      "Figma, Prototyping align with JD",
      "Peers from your stream applied",
      "UI for citizen services matches interests",
    ],
  },
  {
    title: "Operations Intern",
    company: "Gov Facilitation Centre",
    domain: "Operations",
    duration: 3,
    location: "Onsite",
    success_prob: 71,
    fairness_tag: "Balanced for Rural / Tier-2",
    reasons: [
      "Process and coordination skills match",
      "Stream seniors got offers here",
      "Matches your Admin/Operations interest",
    ],
  },
];

export default function ResultsPage() {
  const [domain, setDomain] = useState<string>("All");
  const [duration, setDuration] = useState<number | "All">("All");
  const [location, setLocation] = useState<string>("All");
  const [minProb, setMinProb] = useState<number>(0);
  const [fairnessOnly, setFairnessOnly] = useState<boolean>(false);

  const filtered = useMemo(() => {
    return MOCK_INTERNSHIPS.filter((i) => {
      if (domain !== "All" && i.domain !== domain) return false;
      if (duration !== "All" && i.duration !== duration) return false;
      if (location !== "All" && i.location !== location) return false;
      if (i.success_prob < minProb) return false;
      if (fairnessOnly && !i.fairness_tag.toLowerCase().includes("balanced")) return false;
      return true;
    });
  }, [domain, duration, location, minProb, fairnessOnly]);

  const stats = useMemo(() => {
    const count = filtered.length;
    const avg = Math.round(
      filtered.reduce((acc, i) => acc + i.success_prob, 0) / Math.max(filtered.length, 1)
    );
    const gapClosed = 65; // mock
    return { count, avg, gapClosed };
  }, [filtered]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gov-blue">
              PM Internship Smart Recommendations
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Hi Student, here are your tailored internships 🚀
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-gov-blue">Filters</CardTitle>
              <CardDescription>Refine your recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Domain */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gov-blue"
                >
                  {[
                    "All",
                    "IT",
                    "Finance",
                    "Marketing",
                    "Design",
                    "Operations",
                  ].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <select
                  value={duration}
                  onChange={(e) =>
                    setDuration(e.target.value === "All" ? "All" : Number(e.target.value))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gov-blue"
                >
                  {["All", 1, 3, 6].map((d) => (
                    <option key={d.toString()} value={d.toString()}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gov-blue"
                >
                  {["All", "Remote", "Hybrid", "Onsite"].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Success Probability */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Success Probability</label>
                  <span className="text-sm text-gray-600">{minProb}%+</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={minProb}
                  onChange={(e) => setMinProb(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Fairness Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Show Fairness Balanced Only</label>
                <input
                  type="checkbox"
                  checked={fairnessOnly}
                  onChange={(e) => setFairnessOnly(e.target.checked)}
                  className="h-4 w-4 text-gov-blue"
                />
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Main Area */}
        <section className="lg:col-span-9 space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-gov-blue flex items-center gap-2">
                  <Sparkles className="h-5 w-5" /> Recommendations Generated
                </CardTitle>
                <CardDescription>Updated this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gov-text">{stats.count} this week</div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-gov-blue flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" /> Avg. Success Probability
                </CardTitle>
                <CardDescription>Across current filters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gov-text">{stats.avg}%</div>
                <div className="h-2 bg-gray-200 rounded mt-2">
                  <div
                    className="h-2 bg-gov-blue rounded"
                    style={{ width: `${stats.avg}%` }}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-gov-blue flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" /> Skill-Gap Closed
                </CardTitle>
                <CardDescription>Based on recent activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gov-text">{stats.gapClosed}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((item, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div>
                      <CardTitle className="text-gov-blue">{item.title}</CardTitle>
                      <CardDescription className="text-gray-700">{item.company}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm text-gray-700">
                      <span>Success Probability</span>
                      <span className="font-semibold text-gov-text">{item.success_prob}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded">
                      <div
                        className="h-2 bg-gov-blue rounded"
                        style={{ width: `${item.success_prob}%` }}
                      />
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {item.reasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-800">
                        <CheckCircle2 className="h-4 w-4 text-gov-blue mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center gap-3">
                    <button className="bg-gov-blue hover:bg-gov-blueDark text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2">
                      <span>Apply Now</span>
                    </button>
                    <button className="border border-gov-blue text-gov-blue hover:bg-blue-50 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2">
                      <span>Save for Later</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 text-sm text-gray-600 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <p>
            All recommendations powered by Hybrid AI + Fairness Layer. Every recommendation comes with 3 reasons for transparency.
          </p>
          <a href="#" className="text-gov-blue hover:underline">Contact / Support</a>
        </div>
      </footer>
    </div>
  );
}


