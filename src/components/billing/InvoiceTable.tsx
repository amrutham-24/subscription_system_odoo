"use client";

import React, { useState } from "react";
import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Invoice {
  id: string;
  number: string;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  dueDate: string;
  customer: { name: string; email: string };
  subscription?: { plan: { name: string } } | null;
}

export function InvoiceTable({ initialInvoices }: { initialInvoices: Invoice[] }) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [payingId, setPayingId] = useState<string | null>(null);
  const router = useRouter();

  const handlePay = async (id: string) => {
    setPayingId(id);
    try {
      const res = await fetch(`/api/invoices/${id}/pay`, {
        method: "POST",
      });
      if (res.ok) {
        setInvoices((prev) =>
          prev.map((inv) => (inv.id === id ? { ...inv, status: "PAID" } : inv))
        );
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
            <th className="pb-3 font-semibold">Invoice #</th>
            <th className="pb-3 font-semibold">Customer</th>
            <th className="pb-3 font-semibold">Associated Plan</th>
            <th className="pb-3 font-semibold">Subtotal</th>
            <th className="pb-3 font-semibold">Tax (8%)</th>
            <th className="pb-3 font-semibold">Total</th>
            <th className="pb-3 font-semibold">Status</th>
            <th className="pb-3 font-semibold">Due Date</th>
            <th className="pb-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {invoices.map((inv) => (
            <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="py-3 font-mono font-bold text-slate-900">{inv.number}</td>
              <td className="py-3 font-bold text-slate-900">{inv.customer.name}</td>
              <td className="py-3 text-slate-500">
                {inv.subscription?.plan?.name || "Standard Subscription"}
              </td>
              <td className="py-3 text-slate-600 font-mono">${inv.subtotal.toFixed(2)}</td>
              <td className="py-3 text-slate-500 font-mono">${inv.tax.toFixed(2)}</td>
              <td className="py-3 text-blue-600 font-bold font-mono">${inv.total.toFixed(2)}</td>
              <td className="py-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    inv.status === "PAID"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : inv.status === "PAST_DUE"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {inv.status}
                </span>
              </td>
              <td className="py-3 font-mono text-slate-500">{inv.dueDate}</td>
              <td className="py-3 text-right">
                {inv.status !== "PAID" ? (
                  <button
                    onClick={() => handlePay(inv.id)}
                    disabled={payingId === inv.id}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {payingId === inv.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <CreditCard className="h-3 w-3" />
                    )}
                    Simulate Payment
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Settled
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
