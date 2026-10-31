"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Mail, Percent, MessageSquare, Terminal } from "lucide-react";

export const ActionNode = memo(({ data, selected }: { data: any; selected?: boolean }) => {
  const getIcon = () => {
    switch (data.actionType) {
      case "apply_discount":
        return <Percent className="h-4 w-4" />;
      case "slack_notify":
        return <MessageSquare className="h-4 w-4" />;
      case "send_email":
        return <Mail className="h-4 w-4" />;
      default:
        return <Terminal className="h-4 w-4" />;
    }
  };

  return (
    <div
      className={`min-w-[240px] rounded-xl border bg-slate-900/90 p-4 shadow-xl backdrop-blur-md transition-all ${
        selected ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-indigo-500/30"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-slate-400"
      />

      <div className="flex items-center gap-2 pb-2 border-b border-indigo-500/20">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
          {getIcon()}
        </div>
        <div className="flex-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
            Action Step
          </span>
          <h4 className="text-sm font-medium text-slate-100">{data.label || "Execute Action"}</h4>
        </div>
      </div>

      <div className="mt-2 text-xs text-slate-400">
        {data.actionType === "apply_discount" && (
          <span>Applies {data.percent || 15}% Discount Coupon</span>
        )}
        {data.actionType === "slack_notify" && (
          <span>Sends alert to {data.channel || "#billing-alerts"}</span>
        )}
        {data.actionType === "send_email" && (
          <span>Sends template: {data.template || "custom"}</span>
        )}
        {!["apply_discount", "slack_notify", "send_email"].includes(data.actionType) && (
          <span>{data.description || "Performs automated action"}</span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-indigo-400"
      />
    </div>
  );
});

ActionNode.displayName = "ActionNode";
