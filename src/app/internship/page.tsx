"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InternshipRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/internship/basic-info");
  }, [router]);
  return null;
}


