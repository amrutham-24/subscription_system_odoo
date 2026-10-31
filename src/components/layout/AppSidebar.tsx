"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  BarChart2,
  Repeat,
  Users,
  FileText,
  Package,
  FileSpreadsheet,
  Settings,
  ShieldCheck,
  Crown,
  ChevronRight,
  LogOut,
  ExternalLink,
  Zap,
} from "lucide-react";

interface AppSidebarProps {
  currentPath?: string;
}

export function AppSidebar({ currentPath }: AppSidebarProps) {
  const pathname = usePathname() || currentPath || "/dashboard";
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: Home },
    { label: "Analytics", href: "/dashboard", icon: BarChart2 },
    { label: "Subscriptions", href: "/subscriptions", icon: Repeat },
    { label: "Customers", href: "/customers", icon: Users },
    { label: "Invoices", href: "/billing", icon: FileText },
    { label: "Automations", href: "/automations", icon: Zap, badge: "AI" },
    { label: "Products", href: "/subscriptions", icon: Package },
    { label: "Reports", href: "/billing", icon: FileSpreadsheet },
    { label: "Settings", href: "/dashboard", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white p-5 flex flex-col justify-between shrink-0 min-h-screen">
      <div className="space-y-6">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
              Brightloop
            </span>
            <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
              Admin Workspace
            </span>
          </div>
        </div>

        {/* Switch to Customer Portal Banner */}
        <Link
          href="/portal"
          className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70 text-blue-800 hover:from-blue-100 hover:to-indigo-100 transition-all text-xs font-semibold shadow-xs"
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Customer Portal</span>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard" || pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? "text-white" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-blue-50 text-blue-600 border border-blue-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        {/* Pro Plan Upgrade Card */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 flex items-center justify-between hover:bg-slate-100/80 transition-colors cursor-pointer">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Crown className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Pro Plan</p>
              <p className="text-[11px] text-slate-500">Manage plan</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </div>

        {/* User Profile & Sign Out */}
        <div className="flex items-center justify-between pt-1 px-1">
          <div className="flex items-center gap-2.5">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
              alt="Alex Vance"
              className="h-9 w-9 rounded-full object-cover border border-slate-200"
            />
            <div className="truncate max-w-[110px]">
              <p className="text-xs font-bold text-slate-900 truncate">Alex Vance</p>
              <p className="text-[11px] text-slate-500 truncate">admin@brightloop.io</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
