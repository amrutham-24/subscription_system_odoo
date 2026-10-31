"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, ArrowRight, ShieldCheck, UserCheck, Briefcase } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to log in");
      }

      if (data.user?.role === "CUSTOMER") {
        router.push("/portal");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fillRole = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("Password123!");
  };

  return (
    <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center p-6 text-slate-100">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-xl shadow-indigo-500/30 mb-4">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sign In to Brightloop</h1>
          <p className="text-xs text-slate-400 mt-1">
            Subscription Management & Visual Revenue Automation Platform
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 shadow-2xl">
          {error && (
            <div className="mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-xl bg-slate-900/80 border border-white/10 p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-slate-300 font-medium">Password</label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl bg-slate-900/80 border border-white/10 p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 p-3 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-violet-500 hover:to-indigo-500 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Enter Workspace <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Role Logins */}
          <div className="mt-5 pt-4 border-t border-white/10 text-center space-y-2">
            <p className="text-[11px] font-medium text-slate-400">Quick Demo Logins (Click to Autofill):</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillRole("admin@brightloop.io")}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-2 text-[11px] text-indigo-300 border border-indigo-500/20 transition-all cursor-pointer"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                onClick={() => fillRole("staff@brightloop.io")}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-2 text-[11px] text-emerald-300 border border-emerald-500/20 transition-all cursor-pointer"
              >
                <Briefcase className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Staff</span>
              </button>

              <button
                type="button"
                onClick={() => fillRole("customer@acme.com")}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-2 text-[11px] text-amber-300 border border-amber-500/20 transition-all cursor-pointer"
              >
                <UserCheck className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>Customer</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-indigo-400 hover:underline font-medium">
            Register Workspace
          </Link>
        </p>
      </div>
    </div>
  );
}
