"use client";

import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-emerald-50 text-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-lg text-center space-y-10">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/MapMyTrip.jpg"
            alt="MapMyTrip Logo"
            width={120}
            height={120}
            className="rounded-3xl shadow-xl shadow-emerald-200"
            priority
          />
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to MapMyTrip
          </h1>
          <p className="text-slate-600 text-lg">
            AI-powered trip planning made beautifully simple.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full rounded-2xl bg-emerald-500 py-4 text-lg font-semibold text-white hover:bg-emerald-400 transition shadow-md shadow-emerald-200"
          >
            Log in
          </Link>

          <Link
            href="/signup"
            className="block w-full rounded-2xl border border-emerald-500 text-emerald-700 py-4 text-lg hover:bg-emerald-50 transition"
          >
            Sign up
          </Link>
        </div>

        {/* Footer */}
        <p className="text-sm text-slate-500 mt-10">
          © {new Date().getFullYear()} MapMyTrip. All rights reserved.
        </p>
      </div>
    </div>
  );
}
