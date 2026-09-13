import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskAura — Complete. Earn. Reward.",
  description: "A modern task and rewards platform.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
