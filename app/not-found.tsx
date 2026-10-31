import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080B14] text-[#F5F7FF] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#4F8CFF]/15 border border-[#4F8CFF]/30 flex items-center justify-center text-[#4F8CFF] mb-6">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-[#F5F7FF]">
        404 — Page Not Found
      </h1>
      <p className="text-sm text-[#9BA7BA] max-w-md mt-3">
        The requested portfolio route or project slug could not be located.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white font-semibold text-xs shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Ali Husnain Portfolio</span>
      </Link>
    </div>
  );
}
