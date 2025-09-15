"use client";

import { useRouter } from "next/navigation";
import { steps } from "@/lib/internship";

export function WizardNav({ currentIndex }: { currentIndex: number }) {
  const router = useRouter();
  const go = (delta: number) => {
    const target = currentIndex + delta;
    if (target >= 0 && target < steps.length) router.push(steps[target].href);
  };
  return (
    <div className="flex items-center justify-between mt-8">
      <button
        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50"
        onClick={() => go(-1)}
        disabled={currentIndex === 0}
      >
        Back
      </button>
      <button
        className="px-4 py-2 rounded bg-gov-blue hover:bg-gov-blueDark text-white"
        onClick={() => go(1)}
      >
        Next
      </button>
    </div>
  );
}


