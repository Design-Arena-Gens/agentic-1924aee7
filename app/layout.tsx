import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Lip Sync Avatar - Realistic AI-Powered Avatar Animation",
  description: "Create realistic lip-synced avatars with AI-powered facial expressions, emotion control, and natural movements. Export in 1080p.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
