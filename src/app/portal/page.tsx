import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentAuth } from "@/lib/auth";
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ShieldCheck,
  LogOut,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default async function CustomerPortalPage() {
  const auth = await getCurrentAuth();

  // If not authenticated, redirect to login
  if (!auth) {
    redirect("/login");
  }

  // Find customer matching this user's email, or fallback to first customer for demo purposes
  let customer = await prisma.customer.findFirst({
    where: {
      email: auth.user.email,
    },
    include: {
      subscriptions: {
        include: {
          plan: {
            include: {
              product: true,
            },
          },
        },
      },
      invoices: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!customer) {
    customer = await prisma.customer.findFirst({
      include: {
        subscriptions: {
          include: {
            plan: {
              include: {
                product: true,
              },
            },
          },
        },
        invoices: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }

  const activeSubscription = customer?.subscriptions[0];
  const invoices = customer?.invoices || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Brightloop</span>
              <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                Customer Portal
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {customer?.company || customer?.name || "Client Workspace"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick link to switch back to Admin View */}
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-lg transition-all"
          >
            <span>Switch to Admin View</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <div className="h-4 w-px bg-slate-200" />

          {/* User profile */}
          <div className="flex items-center gap-2 text-xs">
            <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {auth.user.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="font-semibold text-slate-800 leading-tight">{auth.user.name}</p>
              <p className="text-[10px] text-slate-500">{auth.role}</p>
            </div>
          </div>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">Welcome back, {customer?.name || auth.user.name}</h1>
              <Sparkles className="h-4 w-4 text-amber-300" />
            </div>
            <p className="text-xs text-blue-100 max-w-lg">
              Manage your subscription plans, inspect billing invoices, and download receipts directly without contacting support.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-2.5 border border-white/20 text-xs flex items-center gap-3">
            <div>
              <p className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">Account Status</p>
              <p className="font-bold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Subscriber
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Active Subscription Card */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Current Subscription</h2>
              <p className="text-xs text-slate-500">Plan details, recurring billing frequency, and renewal date</p>
            </div>
            <Link
              href="/subscriptions"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Browse All Plans <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {activeSubscription ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {activeSubscription.status}
                    </span>
                    <span className="text-xs text-slate-400">ID: {activeSubscription.id.substring(0, 10)}...</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">
                    {activeSubscription.plan?.name || "Growth Pro Tier"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activeSubscription.plan?.description || "Access to all features, priority support, and multi-user seats."}
                  </p>
                </div>

                <div className="border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 space-y-1">
                  <p className="text-xs text-slate-400 font-medium">Recurring Price</p>
                  <p className="text-2xl font-black text-slate-900">
                    ${activeSubscription.plan?.price?.toFixed(2) || "99.00"}
                    <span className="text-xs font-normal text-slate-500"> / {activeSubscription.plan?.interval?.toLowerCase() || "month"}</span>
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Renews {new Date(activeSubscription.currentPeriodEnd).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex flex-col gap-2">
                  <button
                    className="w-full text-center py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    Change Tier
                  </button>
                  <button
                    className="w-full text-center py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all"
                  >
                    Pause Subscription
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <AlertCircle className="h-8 w-8 text-amber-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No active subscription found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You currently don't have an ongoing subscription. Select a plan to activate services.
              </p>
              <Link
                href="/subscriptions"
                className="inline-block py-2 px-4 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-sm hover:bg-blue-700"
              >
                Choose a Plan
              </Link>
            </div>
          )}
        </div>

        {/* Section 2: Invoices & Billing History */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Invoices & Payment History</h2>
            <p className="text-xs text-slate-500">View and settle invoices issued to your account</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Taxes</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.length > 0 ? (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-800 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        {inv.number}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        ${inv.total.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        ${inv.tax.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === "PAID"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : inv.status === "PAST_DUE"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {inv.status === "PAID" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {inv.status === "PAID" ? (
                          <button
                            type="button"
                            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                          >
                            Receipt
                          </button>
                        ) : (
                          <Link
                            href="/billing"
                            className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold px-3 py-1 rounded-lg shadow-sm"
                          >
                            <CreditCard className="h-3 w-3" />
                            Pay Now
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
