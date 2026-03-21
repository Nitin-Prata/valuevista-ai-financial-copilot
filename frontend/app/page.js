"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.replace("/dashboard"), 1800);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <main className="vv-splash">
      <div className="vv-splash-logo">V</div>
      <div className="vv-progress">
        <span />
      </div>
    </main>
  );
}
