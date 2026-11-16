"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import "aos/dist/aos.css";

const ClientToaster = dynamic(
  () => import("sonner").then((mod) => mod.Toaster),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize AOS safely on client mount with premium easing
    import("aos").then((AOS) => {
      AOS.default.init({
        duration: 450,
        easing: "ease-out-cubic",
        once: true,
        offset: 40,
      });
    });
  }, []);

  return (
    <SessionProvider>
      {children}
      <ClientToaster position="top-right" richColors closeButton />
    </SessionProvider>
  );
}
