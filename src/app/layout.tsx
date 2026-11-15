import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/providers";

export const metadata: Metadata = {
  title: "CivicLens – AI-Powered Civic Issue Reporting & Community Intelligence",
  description:
    "See the problem. Report the issue. Improve your community. An intelligent municipal civic management platform powered by Amazon Bedrock GenAI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
