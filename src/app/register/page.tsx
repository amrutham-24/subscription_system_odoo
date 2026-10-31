"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, ArrowRight, CheckCircle2, XCircle } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [role, setRole] = useState<"ADMIN" | "CUSTOMER">("ADMIN");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Password rules evaluation
  const hasMinLength = password.length > 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasSpecial;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError("Please satisfy all password security requirements.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, organizationName, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register");
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

  return (
    <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center p-6 text-slate-100">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-xl shadow-indigo-500/30 mb-4">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create Brightloop Account</h1>
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

          <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
            {/* Role / Account Type Selector */}
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("ADMIN")}
                  className={`py-2 px-3 rounded-xl border text-center transition-all ${
                    role === "ADMIN"
                      ? "bg-indigo-600/30 border-indigo-500 text-white font-semibold"
                      : "bg-slate-900/60 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  Admin / Business
                </button>
                <button
                  type="button"
                  onClick={() => setRole("CUSTOMER")}
                  className={`py-2 px-3 rounded-xl border text-center transition-all ${
                    role === "CUSTOMER"
                      ? "bg-indigo-600/30 border-indigo-500 text-white font-semibold"
                      : "bg-slate-900/60 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  Customer / Subscriber
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-xl bg-slate-900/80 border border-white/10 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Company / Organization</label>
              <input
                type="text"
                required
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="Acme Labs Inc"
                className="w-full rounded-xl bg-slate-900/80 border border-white/10 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-xl bg-slate-900/80 border border-white/10 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl bg-slate-900/80 border border-white/10 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />

              {/* Real-time Password Requirements checklist as per Odoo PDF */}
              <div className="mt-2 space-y-1 text-[11px] bg-slate-950/40 p-2.5 rounded-lg border border-white/5">
                <p className="text-slate-400 font-medium mb-1">Security Requirements:</p>
                <div className="flex items-center gap-1.5">
                  {hasMinLength ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <XCircle className="h-3.5 w-3.5 text-slate-500" />}
                  <span className={hasMinLength ? "text-emerald-400" : "text-slate-500"}>More than 8 characters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasUppercase ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <XCircle className="h-3.5 w-3.5 text-slate-500" />}
                  <span className={hasUppercase ? "text-emerald-400" : "text-slate-500"}>At least 1 uppercase letter (A-Z)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasLowercase ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <XCircle className="h-3.5 w-3.5 text-slate-500" />}
                  <span className={hasLowercase ? "text-emerald-400" : "text-slate-500"}>At least 1 lowercase letter (a-z)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasSpecial ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <XCircle className="h-3.5 w-3.5 text-slate-500" />}
                  <span className={hasSpecial ? "text-emerald-400" : "text-slate-500"}>At least 1 special character (!@#$%^&*)</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isPasswordValid}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 p-3 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-violet-500 hover:to-indigo-500 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
