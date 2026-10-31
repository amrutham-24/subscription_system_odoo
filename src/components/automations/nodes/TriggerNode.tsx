"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Play } from "lucide-react";

export const TriggerNode = memo(({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <div className="relative">
      <div
        className={`flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-white shadow-md transition-all ${
          selected ? "ring-4 ring-emerald-500/30 scale-105" : ""
        }`}
      >
        <Play className="h-3.5 w-3.5 fill-white text-white" />
        <span className="text-xs font-bold tracking-wide">
          {data.label || "Trigger"}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-emerald-600 !border-white !w-2.5 !h-2.5"
      />
    </div>
  );
});

TriggerNode.displayName = "TriggerNode";
