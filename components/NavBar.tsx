// components/Navbar.tsx
"use client";

import AuthButton from "@/components/AuthButton";
import { Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">ArchSketch</span>
        </div>

        {/* Auth */}
        <AuthButton />
      </div>
    </nav>
  );
}
