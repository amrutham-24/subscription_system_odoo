import { prisma } from "@/lib/prisma";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Users, Building2, AlertTriangle, ShieldCheck, Mail } from "lucide-react";
import { CustomerActions } from "@/components/customers/CustomerActions";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const org = await prisma.organization.findFirst();

  const customers = org
    ? await prisma.customer.findMany({
        where: { organizationId: org.id },
        include: {
          subscriptions: {
            include: { plan: true },
            take: 1,
          },
          invoices: {
            take: 1,
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
      <AppSidebar currentPath="/customers" />

      <main className="flex-1 p-8 overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
              <Users className="h-6 w-6 text-blue-600" />
              Customer Directory
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Account profiles, subscription tiers, and AI churn risk indicators
            </p>
          </div>

          <CustomerActions />
        </div>

        {/* Customer Table */}
        <div className="saas-card p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Company</th>
                  <th className="pb-3 font-semibold">Active Plan</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Churn Risk</th>
                  <th className="pb-3 font-semibold">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => {
                  const sub = c.subscriptions[0];
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs border border-blue-200">
                            {c.name.slice(0, 1)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{c.name}</p>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Mail className="h-3 w-3 text-slate-400" /> {c.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-slate-700 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          {c.company || "N/A"}
                        </span>
                      </td>
                      <td className="py-3">
                        {sub ? (
                          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
                            {sub.plan.name} (${sub.plan.price}/
                            {sub.plan.interval === "YEARLY" ? "yr" : "mo"})
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">No active plan</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3">
                        {c.churnRisk === "HIGH" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="h-3 w-3" /> HIGH RISK
                          </span>
                        ) : c.churnRisk === "MEDIUM" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            MEDIUM
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="h-3 w-3" /> HEALTHY
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-slate-500 font-mono text-[11px]">
                        {c.createdAt.toISOString().split("T")[0]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
