import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediCheck AI — Symptom & Medication Safety Checker",
  description:
    "Free AI-powered tool to check symptoms, understand possible conditions, and detect dangerous drug interactions. Not a substitute for professional medical advice.",
  keywords: ["symptom checker", "drug interactions", "medication safety", "health AI"],
  openGraph: {
    title: "MediCheck AI — Free Symptom & Medication Checker",
    description: "Check symptoms and medication interactions instantly. Free, private, no signup.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
