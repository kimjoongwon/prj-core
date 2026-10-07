import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Proposal",
  description: "제안서",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-white text-neutral-900">{children}</body>
    </html>
  );
}
