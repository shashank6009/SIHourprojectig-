"use client";

// Unified Internship layout without the wizard header to avoid duplicate sections
export default function InternshipLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-8">
        {children}
      </div>
    </div>
  );
}


