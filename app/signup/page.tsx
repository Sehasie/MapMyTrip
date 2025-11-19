"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface StoredUser {
  name: string;
  email: string;
  password: string;
  status: "pending" | "approved";
  createdAt: string;
}

const USERS_KEY = "MapMyTrip_users";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!name || !email || !password) {
      setMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (typeof window === "undefined") return;

    const existingRaw = localStorage.getItem(USERS_KEY);
    const existing: StoredUser[] = existingRaw ? JSON.parse(existingRaw) : [];

    const already = existing.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (already) {
      setMessage("An account with this email already exists. Please log in.");
      setLoading(false);
      return;
    }

    const newUser: StoredUser = {
      name,
      email,
      password,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const updated = [...existing, newUser];
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));

    setMessage(
      "You’ve been added to the approval waitlist! For now you can try logging in."
    );

    setTimeout(() => {
      router.push("/login");
    }, 1500);

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-emerald-50 text-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-emerald-200 bg-white p-6 shadow-xl shadow-emerald-100">
        <h1 className="text-xl font-semibold tracking-tight">
          Create your MapMyTrip account
        </h1>
        <p className="mt-1 text-xs text-slate-600">
          Sign up to save trips and join the approval waitlist.
        </p>

        <form onSubmit={handleSignUp} className="mt-4 space-y-3 text-sm">
          <div>
            <label className="block text-xs text-slate-700 mb-1">
              Full name
            </label>
            <input
              className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Perera"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>

          {message && (
            <p className="mt-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-emerald-500 py-2 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-emerald-200"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-emerald-700 hover:text-emerald-500 underline"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
