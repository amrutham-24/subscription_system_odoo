"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Table, MoreHorizontal } from "lucide-react";

export const DataNode = memo(({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-blue-600 !border-white !w-2.5 !h-2.5"
      />

      <div
        className={`w-52 rounded-xl border bg-white p-3.5 shadow-sm transition-all ${
          selected
            ? "border-blue-600 ring-2 ring-blue-500/20 shadow-md"
            : "border-blue-200 hover:border-blue-400"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <Table className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {data.title || "Data"}
              </p>
              <p className="text-[11px] text-slate-500 leading-tight">
                {data.sublabel || data.label || "Add to Google Sheets"}
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
        className="!bg-blue-600 !border-white !w-2.5 !h-2.5"
      />
    </div>
  );
});

DataNode.displayName = "DataNode";
