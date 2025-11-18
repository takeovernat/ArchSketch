import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArchSketch - AI Architecture Diagrams",
  description: "Turn natural language into beautiful architecture diagrams",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-b from-gray-50 to-white">
        {children}
      </body>
    </html>
  );
}