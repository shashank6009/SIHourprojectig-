"use client";

import { ProgressHeader } from "@/components/internship/ProgressHeader";

export default function InternshipLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white min-h-screen">
      <div className="border-b bg-gov-gray">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <ProgressHeader />
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-6 py-8">
        {children}
      </div>
    </div>
  );
}


