import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Firewall Log Analyzer",
  description: "Dashboard for blocked IPs, attack ports, and traffic origin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}