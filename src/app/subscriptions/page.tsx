import { prisma } from "@/lib/prisma";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Repeat, ShieldCheck, Check, Sparkles } from "lucide-react";
import { SubscriptionActions } from "@/components/subscriptions/SubscriptionActions";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  const org = await prisma.organization.findFirst();

  const [subscriptions, plans, customers] = org
    ? await Promise.all([
        prisma.subscription.findMany({
          where: { organizationId: org.id },
          include: {
            customer: true,
            plan: true,
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.plan.findMany({
          where: { organizationId: org.id },
          include: { product: true },
        }),
        prisma.customer.findMany({
          where: { organizationId: org.id },
        }),
      ])
    : [[], [], []];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
      <AppSidebar currentPath="/subscriptions" />

      <main className="flex-1 p-8 overflow-y-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
              <Repeat className="h-6 w-6 text-blue-600" />
              Subscriptions & Plans
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Active recurring revenue contracts, tier configurations, and lifecycle actions
            </p>
          </div>

          <SubscriptionActions customers={customers} plans={plans} />
        </div>

        {/* Plan Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.slice(0, 3).map((p) => {
            let features: string[] = [];
            try {
              features = p.features ? JSON.parse(p.features) : [];
            } catch {
              features = ["Automated billing", "Email support"];
            }

            const isPro = p.name.includes("Pro");

            return (
              <div
                key={p.id}
                className={`saas-card p-6 flex flex-col justify-between ${
                  isPro ? "border-blue-500 ring-2 ring-blue-500/10 shadow-md" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {p.name}
                    </span>
                    {isPro && (
                      <span className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-bold border border-blue-200">
                        <Sparkles className="h-3 w-3" /> Most Popular
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">${p.price}</span>
                    <span className="text-xs text-slate-500">/{p.interval === "YEARLY" ? "yr" : "mo"}</span>
                  </div>

                  <p className="text-xs text-slate-500 mt-2">{p.description}</p>

                  <div className="mt-5 space-y-2.5">
                    {features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-medium text-slate-500">
                    Includes {p.trialDays} days free trial
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Subscriptions Table */}
        <div className="saas-card p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Active Customer Subscriptions</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Plan</th>
                  <th className="pb-3 font-semibold">Billing Period</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Renews On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-bold text-slate-900">{sub.customer.name}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[11px]">
                        {sub.plan.name} (${sub.plan.price}/{sub.plan.interval === "YEARLY" ? "yr" : "mo"})
                      </span>
                    </td>
                    <td className="py-3 text-slate-600 capitalize">{sub.plan.interval.toLowerCase()}</td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          sub.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : sub.status === "PAST_DUE"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-slate-500">
                      {sub.currentPeriodEnd.toISOString().split("T")[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
