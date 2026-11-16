"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("CivicLens App Router Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-subtle max-w-md space-y-4">
        <h2 className="font-heading text-xl font-bold text-slate-900">
          Something went wrong
        </h2>
        <p className="text-sm text-slate-600">
          An unexpected error occurred while loading this page.
        </p>
        <Button
          onClick={() => reset()}
          className="btn-premium bg-slate-950 hover:bg-slate-900 text-white"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
