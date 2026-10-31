"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Mail, MoreHorizontal } from "lucide-react";

export const EmailDraftNode = memo(({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-emerald-600 !border-white !w-2.5 !h-2.5"
      />

      <div
        className={`w-56 rounded-xl border bg-white p-3.5 shadow-sm transition-all ${
          selected
            ? "border-emerald-600 ring-2 ring-emerald-500/20 shadow-md"
            : "border-emerald-200 hover:border-emerald-400"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Mail className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {data.title || "Auto Draft Sales Email"}
              </p>
              <p className="text-[11px] text-slate-500 leading-tight">
                {data.sublabel || data.label || "Gmail Drafts"}
              </p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-emerald-600 !border-white !w-2.5 !h-2.5"
      />
    </div>
  );
});

EmailDraftNode.displayName = "EmailDraftNode";
