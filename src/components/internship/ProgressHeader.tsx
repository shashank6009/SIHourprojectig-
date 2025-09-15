"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, ChevronRight, Rocket } from "lucide-react";
import { getStepIndex, steps } from "@/lib/internship";

export function ProgressHeader() {
  const pathname = usePathname();
  const currentIndex = getStepIndex(pathname);
  const percent = Math.round(((currentIndex + 1) / steps.length) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gov-text">
          <Rocket className="w-5 h-5 text-gov-blue" />
          <span className="font-semibold">Just a few quick questions to get you started 🚀</span>
        </div>
        <div className="text-sm text-gray-700">{percent}%</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gov-blue h-2 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <nav className="hidden md:flex items-center gap-2 text-sm text-gray-600">
        {steps.map((s, i) => {
          const isDone = i < currentIndex;
          const isActive = i === currentIndex;
          return (
            <div key={s.href} className="flex items-center gap-2">
              <Link
                href={s.href}
                className={`flex items-center gap-1 px-2 py-1 rounded ${
                  isActive ? "bg-white text-gov-blue font-medium" : isDone ? "text-gov-blue" : "hover:text-gov-blue"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-gray-400" />
                )}
                <span>{s.label}</span>
              </Link>
              {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            </div>
          );
        })}
      </nav>
    </div>
  );
}


