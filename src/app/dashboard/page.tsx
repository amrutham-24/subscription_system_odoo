import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Calendar,
  ChevronDown,
  Info,
  TrendingUp,
  TrendingDown,
  UserPlus,
  BadgeDollarSign,
  Plus,
  Activity,
  Zap,
} from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const org = await prisma.organization.findFirst();

  const [subscriptions, customers, workflows] = org
    ? await Promise.all([
        prisma.subscription.findMany({
          where: { organizationId: org.id },
          include: { plan: true, customer: true },
          take: 6,
        }),
        prisma.customer.findMany({ where: { organizationId: org.id } }),
        prisma.workflow.findMany({ where: { organizationId: org.id } }),
      ])
    : [[], [], []];

  // 12-Month MRR growth data matching Image 2
  const growthData = [
    { month: "Jun '24", value: 2500 },
    { month: "Jul '24", value: 3000 },
    { month: "Aug '24", value: 3500 },
    { month: "Sep '24", value: 4200 },
    { month: "Oct '24", value: 5000 },
    { month: "Nov '24", value: 6000 },
    { month: "Dec '24", value: 7100 },
    { month: "Jan '25", value: 8500 },
    { month: "Feb '25", value: 10000 },
    { month: "Mar '25", value: 11500 },
    { month: "Apr '25", value: 12500 },
    { month: "May '25", value: 15000 },
  ];

  // Active subscribers list matching Image 2 style
  const activeSubsList = [
    {
      name: "Acme Inc.",
      plan: "Pro Plan",
      amount: "$2,000 /mo",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    },
    {
      name: "Vertex Solutions",
      plan: "Pro Plan",
      amount: "$1,500 /mo",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    },
    {
      name: "Bright Analytics",
      plan: "Growth Plan",
      amount: "$1,200 /mo",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    },
    {
      name: "Momentum Labs",
      plan: "Pro Plan",
      amount: "$1,000 /mo",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces",
    },
    {
      name: "Starter Corp",
      plan: "Growth Plan",
      amount: "$800 /mo",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces",
    },
    {
      name: "Northpeak Studios",
      plan: "Growth Plan",
      amount: "$750 /mo",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
      <AppSidebar currentPath="/dashboard" />

      <main className="flex-1 p-8 overflow-y-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Overview</h1>

          <div className="flex items-center gap-3">
            <Link
              href={`/automations/${workflows[0]?.id || "new"}`}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer"
            >
              <Zap className="h-4 w-4" />
              Automations Canvas
            </Link>

            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>May 1 – May 31, 2025</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Top Hero 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MRR Main Card + MRR Growth Chart */}
          <div className="lg:col-span-2 saas-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <span>Monthly Recurring Revenue</span>
                    <Info className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <h2 className="text-4xl font-extrabold tracking-tight text-blue-600">
                      $15,000 <span className="text-xl font-bold text-blue-600">MRR</span>
                    </h2>
                  </div>
                  <p className="mt-1 text-xs font-medium text-emerald-600 flex items-center gap-1">
                    <span>↑ 50%</span>
                    <span className="text-slate-500 font-normal">
                      vs April 1 – April 30, 2025 ($10,000 MRR)
                    </span>
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Activity className="h-5 w-5" />
                </div>
              </div>

              {/* MRR Growth Bar Chart matching Image 2 */}
              <DashboardCharts growthData={growthData} />
            </div>
          </div>

          {/* Active Subscriptions Right Column */}
          <div className="saas-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Active Subscriptions</h3>
                  <span className="flex h-5 items-center justify-center rounded-full bg-blue-50 text-blue-600 px-2 text-xs font-bold border border-blue-100">
                    12
                  </span>
                </div>
                <Link
                  href="/subscriptions"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  View all
                </Link>
              </div>

              {/* Subscriber List */}
              <div className="mt-3 divide-y divide-slate-50">
                {activeSubsList.map((sub, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={sub.avatar}
                        alt={sub.name}
                        className="h-8 w-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{sub.name}</p>
                        <p className="text-[11px] text-slate-500">{sub.plan}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-600 font-mono">
                      {sub.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* + Add Subscription Button */}
            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/subscriptions"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Subscription
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom 4 Metric Cards matching Image 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* New MRR */}
          <div className="saas-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                New MRR <Info className="h-3 w-3 text-slate-400" />
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <UserPlus className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-extrabold text-blue-600">$5,000</h3>
              <p className="text-[11px] font-medium text-emerald-600 mt-1">
                ↑ 25% <span className="text-slate-400 font-normal">vs Apr 1 - Apr 30</span>
              </p>
            </div>
          </div>

          {/* Expansion MRR */}
          <div className="saas-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                Expansion MRR <Info className="h-3 w-3 text-slate-400" />
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-extrabold text-blue-600">$2,000</h3>
              <p className="text-[11px] font-medium text-emerald-600 mt-1">
                ↑ 33% <span className="text-slate-400 font-normal">vs Apr 1 - Apr 30</span>
              </p>
            </div>
          </div>

          {/* Churned MRR */}
          <div className="saas-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                Churned MRR <Info className="h-3 w-3 text-slate-400" />
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <TrendingDown className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-extrabold text-blue-600">$2,500</h3>
              <p className="text-[11px] font-medium text-rose-500 mt-1">
                ↓ 17% <span className="text-slate-400 font-normal">vs Apr 1 - Apr 30</span>
              </p>
            </div>
          </div>

          {/* Net New MRR */}
          <div className="saas-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                Net New MRR <Info className="h-3 w-3 text-slate-400" />
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <BadgeDollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-extrabold text-blue-600">$4,500</h3>
              <p className="text-[11px] font-medium text-emerald-600 mt-1">
                ↑ 38% <span className="text-slate-400 font-normal">vs Apr 1 - Apr 30</span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
