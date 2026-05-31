import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wander — AI Trip Planner",
  description: "Generate personalised day-by-day itineraries with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
