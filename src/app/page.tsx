import Link from "next/link";
import { Sparkles, ArrowRight, Zap, ShieldCheck, Repeat, TrendingUp } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="h-20 border-b border-white/10 px-8 flex items-center justify-between backdrop-blur-xl bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight">Brightloop</span>
            <span className="ml-2 text-[10px] bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded border border-indigo-500/30">
              REVENUE OS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-violet-500 hover:to-indigo-500 transition-all cursor-pointer"
          >
            Launch Demo App <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-20 flex flex-col items-center text-center justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-medium text-indigo-300 mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-Generation Subscription Management & AI Automations</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
          Revenue Operations Built for Speed &amp; Intelligent Automation.
        </h1>

        <p className="mt-6 text-base text-slate-400 max-w-2xl leading-relaxed">
          Manage subscriptions, calculate real-time MRR/ARR, recover overdue dunning revenue with visual drag-and-drop workflows, and synthesize entire automation pipelines using natural language AI.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition-all cursor-pointer"
          >
            Open Executive Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/automations"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 hover:bg-slate-800 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-all cursor-pointer"
          >
            <Zap className="h-4 w-4 text-indigo-400" />
            Visual Workflow Builder
          </Link>
        </div>

        {/* 3 Core Highlight Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="glass-card rounded-2xl p-6 border border-white/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Real-Time Financials</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Instant computation of MRR, ARR, churn rate, plan distribution, and invoice payment statuses straight from relational database records.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400 mb-4 border border-violet-500/30">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Visual React Flow Engine</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Drag-and-drop triggers, condition rules, and actions. Run live test simulations and observe glowing node-by-node execution logs.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4 border border-emerald-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">AI Workflow Synthesizer</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Describe business policies in plain English. The AI synthesizes connected React Flow nodes &amp; edges ready for execution.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-16 border-t border-white/10 px-8 flex items-center justify-between text-xs text-slate-500">
        <span>© 2026 Brightloop Technologies. Hackathon Edition.</span>
        <span>Built with Next.js, Prisma, Tailwind, and React Flow</span>
      </footer>
    </div>
  );
}
