import { prisma } from "@/lib/prisma";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Receipt, DollarSign, CheckCircle2, Clock } from "lucide-react";
import { InvoiceTable } from "@/components/billing/InvoiceTable";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const org = await prisma.organization.findFirst();

  const invoices = org
    ? await prisma.invoice.findMany({
        where: { organizationId: org.id },
        include: {
          customer: true,
          subscription: { include: { plan: true } },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const totalBilled = invoices.reduce((acc, inv) => acc + inv.total, 0);
  const paidInvoices = invoices.filter((i) => i.status === "PAID");
  const pastDueInvoices = invoices.filter((i) => i.status === "PAST_DUE");

  const formattedInvoices = invoices.map((inv) => ({
    id: inv.id,
    number: inv.number,
    subtotal: inv.subtotal,
    tax: inv.tax,
    total: inv.total,
    status: inv.status,
    dueDate: inv.dueDate.toISOString().split("T")[0],
    customer: { name: inv.customer.name, email: inv.customer.email },
    subscription: inv.subscription ? { plan: { name: inv.subscription.plan.name } } : null,
  }));

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
      <AppSidebar currentPath="/billing" />

      <main className="flex-1 p-8 overflow-y-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
              <Receipt className="h-6 w-6 text-blue-600" />
              Invoices & Billing Operations
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Automated invoice generation, tax calculations, and simulated payment settlements
            </p>
          </div>
        </div>

        {/* 3 Overview Mini-Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="saas-card p-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Invoiced Volume
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-slate-900">${totalBilled.toFixed(2)}</h3>
              <span className="text-xs text-slate-500">{invoices.length} invoices generated</span>
            </div>
          </div>

          <div className="saas-card p-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Settled Collections
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-emerald-600">
                ${paidInvoices.reduce((acc, i) => acc + i.total, 0).toFixed(2)}
              </h3>
              <span className="text-xs text-emerald-600 font-bold">
                {paidInvoices.length} paid
              </span>
            </div>
          </div>

          <div className="saas-card p-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Overdue Dunning Balance
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-rose-600">
                ${pastDueInvoices.reduce((acc, i) => acc + i.total, 0).toFixed(2)}
              </h3>
              <span className="text-xs text-rose-600 font-bold">
                {pastDueInvoices.length} past due
              </span>
            </div>
          </div>
        </div>

        {/* Invoices List Table */}
        <div className="saas-card p-6">
          <InvoiceTable initialInvoices={formattedInvoices} />
        </div>
      </main>
    </div>
  );
}
