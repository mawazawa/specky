import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Specky - The Spec is the Moat",
  description: "Ultra-granular specification generation for AI agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
