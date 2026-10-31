"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { GitBranch } from "lucide-react";

export const ConditionNode = memo(({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <div
      className={`min-w-[250px] rounded-xl border bg-slate-900/90 p-4 shadow-xl backdrop-blur-md transition-all ${
        selected ? "border-amber-500 ring-2 ring-amber-500/20" : "border-amber-500/30"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-slate-400"
      />

      <div className="flex items-center gap-2 pb-2 border-b border-amber-500/20">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
          <GitBranch className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
            Condition Rule
          </span>
          <h4 className="text-sm font-medium text-slate-100">{data.label || "Check Rule"}</h4>
        </div>
      </div>

      <div className="mt-2 text-xs font-mono bg-slate-950/60 p-2 rounded border border-white/5 text-amber-200/90">
        {data.field || "amount"} {data.operator || ">"} {String(data.value ?? 100)}
      </div>

      <div className="flex justify-between items-center mt-3 text-[10px] font-semibold uppercase px-1">
        <span className="text-emerald-400">True Branch</span>
        <span className="text-rose-400">False Branch</span>
      </div>

      <Handle
        type="source"
        id="true"
        position={Position.Bottom}
        style={{ left: "25%" }}
        className="!bg-emerald-400"
      />
      <Handle
        type="source"
        id="false"
        position={Position.Bottom}
        style={{ left: "75%" }}
        className="!bg-rose-400"
      />
    </div>
  );
});

ConditionNode.displayName = "ConditionNode";
