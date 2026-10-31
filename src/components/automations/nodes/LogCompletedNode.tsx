"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { CheckSquare } from "lucide-react";

export const LogCompletedNode = memo(({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-blue-600 !border-white !w-2.5 !h-2.5"
      />

      <div
        className={`flex items-center gap-2 rounded-xl border bg-white px-5 py-2.5 shadow-sm transition-all ${
          selected
            ? "border-blue-600 ring-2 ring-blue-500/20 shadow-md"
            : "border-blue-200 hover:border-blue-400"
        }`}
      >
        <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-600 text-white">
          <CheckSquare className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs font-bold text-slate-800">
          {data.label || "Log Completed"}
        </span>
      </div>
    </div>
  );
});

LogCompletedNode.displayName = "LogCompletedNode";
