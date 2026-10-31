import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Zap, Plus, ArrowRight, Activity, Sparkles, CheckCircle2 } from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";

export const dynamic = "force-dynamic";

export default async function AutomationsListPage() {
  const org = await prisma.organization.findFirst();
  const workflows = org
    ? await prisma.workflow.findMany({
        where: { organizationId: org.id },
        include: {
          executions: { take: 1, orderBy: { startedAt: "desc" } },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
      <AppSidebar currentPath="/automations" />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
              <Zap className="h-6 w-6 text-blue-600" />
              Automations & Visual Workflows
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Event-driven revenue automations, dunning rules, and AI workflows
            </p>
          </div>

          <Link
            href={`/automations/${workflows[0]?.id || "new"}`}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Open Visual Builder
          </Link>
        </div>

        {/* AI Copilot Recommendation Banner */}
        <div className="mt-6 rounded-2xl border border-purple-200 bg-purple-50/60 p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 border border-purple-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                  AI Revenue Copilot
                </span>
                <span className="text-[10px] bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full font-bold border border-purple-200">
                  Recommendation
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-1">
                Detected 2 high-value overdue accounts ($322.92 past due)
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Smart Dunning automation is active and automatically recovered 1 invoice. Suggested prompt: &quot;If payment fails 2 times, apply 15% discount coupon and alert #sales on Slack&quot;.
              </p>
            </div>
          </div>
        </div>

        {/* Workflows Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Workflows ({workflows.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workflows.map((wf) => (
              <div
                key={wf.id}
                className="saas-card p-6 flex flex-col justify-between hover:border-blue-400 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                      {wf.triggerEvent}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Active
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{wf.name}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {wf.description || "Automated revenue workflow"}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Activity className="h-3.5 w-3.5 text-blue-600" />
                    <span>Last ran recently</span>
                  </div>

                  <Link
                    href={`/automations/${wf.id}`}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Edit in Canvas <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
