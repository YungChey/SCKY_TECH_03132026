import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VerdictAI - AI Recommendations on Trial",
  description: "Courtroom-themed AI analysis dashboard for testing recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
