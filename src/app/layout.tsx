import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atelier — Where Creators Work in Public",
  description: "A creator community platform built around work-based identity, process-first culture, and AI-powered matching.",
  openGraph: {
    title: "Atelier — Where Creators Work in Public",
    description: "Join a community where you're known for what you build, not just what you've shipped.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
