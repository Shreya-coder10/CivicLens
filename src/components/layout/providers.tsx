"use client";

import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";

const ClientToaster = dynamic(
  () => import("sonner").then((mod) => mod.Toaster),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <ClientToaster position="top-right" richColors closeButton />
    </SessionProvider>
  );
}
