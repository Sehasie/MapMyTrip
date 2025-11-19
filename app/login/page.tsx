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
const CURRENT_USER_KEY = "MapMyTrip_current_user";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!email || !password) {
      setMessage("Please enter email and password.");
      setLoading(false);
      return;
    }

    if (typeof window === "undefined") return;

    const existingRaw = localStorage.getItem(USERS_KEY);
    const existing: StoredUser[] = existingRaw ? JSON.parse(existingRaw) : [];

    const user = existing.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!user) {
      setMessage("Invalid email or password.");
      setLoading(false);
      return;
    }

    if (user.status === "pending") {
      setMessage(
        "Your account is still on the approval waitlist. For this demo, you can click 'Continue anyway' to simulate approval."
      );
      setLoading(false);
      return;
    }

    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify({ email: user.email, name: user.name })
    );

    router.push("/home");
  };

  const handleContinueAnyway = () => {
    if (typeof window === "undefined") return;

    const existingRaw = localStorage.getItem(USERS_KEY);
    const existing: StoredUser[] = existingRaw ? JSON.parse(existingRaw) : [];

    const userIndex = existing.findIndex(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (userIndex === -1) {
      setMessage("We can't find your pending account. Try logging in again.");
      return;
    }

    existing[userIndex].status = "approved";
    const user = existing[userIndex];

    localStorage.setItem(USERS_KEY, JSON.stringify(existing));
    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify({ email: user.email, name: user.name })
    );

    setMessage("You’ve been approved and logged in (demo). Redirecting…");
    setTimeout(() => {
      router.push("/home");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-emerald-50 text-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-emerald-200 bg-white p-6 shadow-xl shadow-emerald-100">
        <h1 className="text-xl font-semibold tracking-tight">Log in</h1>
        <p className="mt-1 text-xs text-slate-600">
          Access your MapMyTrip account and saved plans.
        </p>

        <form onSubmit={handleLogin} className="mt-4 space-y-3 text-sm">
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
              placeholder="Your password"
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
            {loading ? "Checking..." : "Log in"}
          </button>
        </form>

        {message?.includes("approval waitlist") && (
          <button
            onClick={handleContinueAnyway}
            className="mt-3 w-full rounded-xl border border-emerald-400 bg-white py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            Continue anyway (demo approve)
          </button>
        )}

        <p className="mt-4 text-xs text-slate-600">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="text-emerald-700 hover:text-emerald-500 underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
