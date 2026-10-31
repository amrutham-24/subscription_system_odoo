"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
  BackgroundVariant,
} from "@xyflow/react";
import Link from "next/link";
import {
  Play,
  Share2,
  Sparkles,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  Copy,
  Check,
  Table,
  MessageSquare,
  Mail,
  Bot,
  Settings,
  Layers,
  Zap,
  BarChart2,
  Users,
  Link2,
  Database,
  Code2,
  UploadCloud,
  CheckCircle2,
  Loader2,
  Hand,
  MousePointer,
  ZoomIn,
  ZoomOut,
  Info,
} from "lucide-react";

import { TriggerNode } from "./nodes/TriggerNode";
import { AiLogicNode } from "./nodes/AiLogicNode";
import { DataNode } from "./nodes/DataNode";
import { SlackAlertNode } from "./nodes/SlackAlertNode";
import { EmailDraftNode } from "./nodes/EmailDraftNode";
import { LogCompletedNode } from "./nodes/LogCompletedNode";

interface WorkflowBuilderProps {
  workflowId: string;
  initialName: string;
  initialDescription?: string;
  initialTriggerEvent: string;
  initialNodes: Node[];
  initialEdges: Edge[];
}

export function WorkflowBuilder({
  workflowId,
  initialName,
  initialDescription,
  initialTriggerEvent,
  initialNodes,
  initialEdges,
}: WorkflowBuilderProps) {
  // Setup default nodes matching Image 1 if initialNodes is empty or basic
  const defaultNodes: Node[] = [
    {
      id: "node-trigger",
      type: "triggerNode",
      position: { x: 380, y: 30 },
      data: { label: "Trigger" },
    },
    {
      id: "node-ai-logic",
      type: "aiLogicNode",
      position: { x: 330, y: 110 },
      data: { title: "AI Logic", sublabel: "Analyze Lead Message" },
    },
    {
      id: "node-data-1",
      type: "dataNode",
      position: { x: 90, y: 230 },
      data: { title: "Data", sublabel: "Add to Google Sheets" },
    },
    {
      id: "node-slack-1",
      type: "slackNode",
      position: { x: 310, y: 230 },
      data: { title: "Send Slack Alert to #sales", sublabel: "Support from {[Name]} - {[Agent]}" },
    },
    {
      id: "node-email-1",
      type: "emailNode",
      position: { x: 580, y: 230 },
      data: { title: "Auto Draft Sales Email", sublabel: "Gmail Drafts" },
    },
    {
      id: "node-data-2",
      type: "dataNode",
      position: { x: 90, y: 340 },
      data: { title: "Add to Notion", sublabel: "Add to Google Sheets" },
    },
    {
      id: "node-slack-2",
      type: "slackNode",
      position: { x: 310, y: 340 },
      data: { title: "Notify Support in Slack", sublabel: "Support from {[Name]} - {[Agent]}" },
    },
    {
      id: "node-email-2",
      type: "emailNode",
      position: { x: 580, y: 340 },
      data: { title: "Add to Notion", sublabel: "Support DB" },
    },
    {
      id: "node-log-complete",
      type: "logCompletedNode",
      position: { x: 360, y: 490 },
      data: { label: "Log Completed" },
    },
  ];

  const defaultEdges: Edge[] = [
    { id: "e-trig-ai", source: "node-trigger", target: "node-ai-logic" },
    { id: "e-ai-data1", source: "node-ai-logic", target: "node-data-1", style: { stroke: "#818cf8" } },
    { id: "e-ai-slack1", source: "node-ai-logic", target: "node-slack-1", style: { stroke: "#818cf8" } },
    { id: "e-ai-email1", source: "node-ai-logic", target: "node-email-1", style: { stroke: "#818cf8" } },
    { id: "e-data1-data2", source: "node-data-1", target: "node-data-2", style: { stroke: "#cbd5e1" } },
    { id: "e-slack1-slack2", source: "node-slack-1", target: "node-slack-2", style: { stroke: "#cbd5e1" } },
    { id: "e-email1-email2", source: "node-email-1", target: "node-email-2", style: { stroke: "#cbd5e1" } },
    { id: "e-data2-log", source: "node-data-2", target: "node-log-complete", style: { stroke: "#cbd5e1" } },
    { id: "e-slack2-log", source: "node-slack-2", target: "node-log-complete", style: { stroke: "#cbd5e1" } },
    { id: "e-email2-log", source: "node-email-2", target: "node-log-complete", style: { stroke: "#cbd5e1" } },
  ];

  const [nodes, setNodes] = useState<Node[]>(
    initialNodes && initialNodes.length > 0 ? initialNodes : defaultNodes
  );
  const [edges, setEdges] = useState<Edge[]>(
    initialEdges && initialEdges.length > 0 ? initialEdges : defaultEdges
  );

  const [selectedNode, setSelectedNode] = useState<Node | null>(
    nodes.find((n) => n.id === "node-ai-logic") || nodes[1] || null
  );
  const [workflowName, setWorkflowName] = useState(initialName || "Marketing Lead Manager");
  const [isSaving, setIsSaving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Accordion state in Toolbox
  const [objectBlocksOpen, setObjectBlocksOpen] = useState(true);
  const [processingBlocksOpen, setProcessingBlocksOpen] = useState(true);

  // AI Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Inspector prompt and model
  const [selectedModel, setSelectedModel] = useState("GPT-4o-mini");
  const [nodePrompt, setNodePrompt] = useState(
    "Summarize the message and detect if it's sales, support, or general. Return JSON with fields: 'type', 'score', and 'summary'."
  );

  const nodeTypes = useMemo(
    () => ({
      triggerNode: TriggerNode,
      aiLogicNode: AiLogicNode,
      dataNode: DataNode,
      slackNode: SlackAlertNode,
      emailNode: EmailDraftNode,
      logCompletedNode: LogCompletedNode,
      // Fallback for previous node types
      conditionNode: AiLogicNode,
      actionNode: SlackAlertNode,
    }),
    []
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            style: { stroke: "#818cf8", strokeWidth: 2 },
          },
          eds
        )
      ),
    []
  );

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node);
  }, []);

  const addBlock = (type: string) => {
    const id = `node-${Date.now()}`;
    const x = 300 + Math.random() * 60;
    const y = 200 + Math.random() * 60;

    let newNode: Node;
    if (type === "trigger") {
      newNode = { id, type: "triggerNode", position: { x, y }, data: { label: "Trigger" } };
    } else if (type === "aiLogic") {
      newNode = { id, type: "aiLogicNode", position: { x, y }, data: { title: "AI Logic", sublabel: "Classify & Route" } };
    } else if (type === "data") {
      newNode = { id, type: "dataNode", position: { x, y }, data: { title: "Data", sublabel: "Add to Notion" } };
    } else if (type === "slack") {
      newNode = { id, type: "slackNode", position: { x, y }, data: { title: "Send Slack Alert to #team", sublabel: "Customer event notification" } };
    } else if (type === "email") {
      newNode = { id, type: "emailNode", position: { x, y }, data: { title: "Auto Draft Sales Email", sublabel: "Gmail Drafts" } };
    } else {
      newNode = { id, type: "logCompletedNode", position: { x, y }, data: { label: "Log Completed" } };
    }

    setNodes((nds) => [...nds, newNode]);
    setSelectedNode(newNode);
  };

  const handleTestFlow = async () => {
    setIsExecuting(true);
    try {
      await fetch(`/api/workflows/${workflowId}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: {
            type: "sales",
            score: 8.9,
            summary: "Interested in enterprise plan for team expansion.",
          },
        }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (data.success && data.workflow) {
        setNodes(data.workflow.nodes);
        setEdges(data.workflow.edges);
        setWorkflowName(data.workflow.name);
        setIsAiModalOpen(false);
        setAiPrompt("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleCopyJson = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative h-screen w-full flex bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
      {/* 1. Far Left Slim Icon Rail matching Image 1 */}
      <aside className="w-14 border-r border-slate-200 bg-white flex flex-col items-center justify-between py-4 shrink-0 z-20">
        <div className="flex flex-col items-center gap-5">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/30"
          >
            <div className="h-3.5 w-3.5 rounded-full bg-white" />
          </Link>

          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Share2 className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700">
            <Zap className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700">
            <Layers className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700">
            <BarChart2 className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700">
            <Users className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button className="text-slate-400 hover:text-slate-700">
            <Settings className="h-4 w-4" />
          </button>
          <button className="text-slate-400 hover:text-slate-700">
            <Link2 className="h-4 w-4" />
          </button>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
            alt="User"
            className="h-8 w-8 rounded-full object-cover border border-slate-200"
          />
        </div>
      </aside>

      {/* Main Workspace Area (Toolbox + Canvas + Topbar + Inspector) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* 2. Top Header Bar matching Image 1 */}
        <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0 z-10">
          {/* Breadcrumbs and status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Link href="/automations" className="hover:text-slate-900">
                Flows
              </Link>
              <span>/</span>
              <span className="font-bold text-slate-900">{workflowName}</span>
            </div>

            <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-600 border border-amber-200">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span>Draft • Autosaved 2m ago</span>
            </div>
          </div>

          {/* Search nodes input */}
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-400 w-72 shadow-sm">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search nodes, variables, or connection"
              className="w-full bg-transparent text-slate-700 placeholder-slate-400 focus:outline-none text-xs"
            />
          </div>

          {/* Actions on right */}
          <div className="flex items-center gap-3">
            {/* Collaborator Avatars */}
            <div className="flex items-center -space-x-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600 border-2 border-white">
                ME
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600 border-2 border-white">
                EL
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white border-2 border-white">
                EM
              </span>
            </div>

            {/* Generate with Assist */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-slate-500" />
              <span>Generate with Assist</span>
            </button>

            {/* Test Flow */}
            <button
              onClick={handleTestFlow}
              disabled={isExecuting}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isExecuting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5 text-slate-600" />
              )}
              <span>Test Flow</span>
            </button>

            {/* Publish Flow (Primary Blue) */}
            <button
              onClick={() => setIsSaving(true)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Publish Flow</span>
            </button>
          </div>
        </header>

        {/* Workspace Canvas Row */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* 3. Left Toolbox matching Image 1 */}
          <aside className="w-56 border-r border-slate-200 bg-white p-4 flex flex-col justify-between shrink-0 z-10 overflow-y-auto">
            <div className="space-y-4">
              {/* Toolbox Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Toolbox</h3>
                  <p className="text-[10px] text-slate-400">Drag & drop block to edit flow.</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <Layers className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Accordion 1: Object Blocks */}
              <div>
                <button
                  onClick={() => setObjectBlocksOpen(!objectBlocksOpen)}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-800 pb-2 cursor-pointer"
                >
                  <span>Object Blocks</span>
                  {objectBlocksOpen ? (
                    <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </button>

                {objectBlocksOpen && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* Trigger Block */}
                    <button
                      onClick={() => addBlock("trigger")}
                      className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/50 transition-all cursor-pointer text-emerald-600"
                    >
                      <Play className="h-4 w-4 mb-1" />
                      <span className="text-[11px] font-semibold text-slate-800">Trigger</span>
                    </button>

                    {/* AI Logic Block */}
                    <button
                      onClick={() => addBlock("aiLogic")}
                      className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/50 transition-all cursor-pointer text-purple-600"
                    >
                      <Sparkles className="h-4 w-4 mb-1" />
                      <span className="text-[11px] font-semibold text-slate-800">AI Logic</span>
                    </button>

                    {/* Data Node Block */}
                    <button
                      onClick={() => addBlock("data")}
                      className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 transition-all cursor-pointer text-blue-600"
                    >
                      <Table className="h-4 w-4 mb-1" />
                      <span className="text-[11px] font-semibold text-slate-800">Data Node</span>
                    </button>

                    {/* Action Node Block */}
                    <button
                      onClick={() => addBlock("slack")}
                      className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer text-slate-600"
                    >
                      <MessageSquare className="h-4 w-4 mb-1" />
                      <span className="text-[11px] font-semibold text-slate-800">Action Node</span>
                    </button>

                    {/* AI Node Block */}
                    <button
                      onClick={() => addBlock("aiLogic")}
                      className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer text-slate-600"
                    >
                      <Bot className="h-4 w-4 mb-1" />
                      <span className="text-[11px] font-semibold text-slate-800">AI Node</span>
                    </button>

                    {/* System Node Block */}
                    <button
                      onClick={() => addBlock("email")}
                      className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer text-slate-600"
                    >
                      <Settings className="h-4 w-4 mb-1" />
                      <span className="text-[11px] font-semibold text-slate-800">System Node</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Accordion 2: Processing Blocks */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setProcessingBlocksOpen(!processingBlocksOpen)}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-800 pb-2 cursor-pointer"
                >
                  <span>Processing Blocks</span>
                  {processingBlocksOpen ? (
                    <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </button>

                {processingBlocksOpen && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => addBlock("aiLogic")}
                      className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer text-slate-600"
                    >
                      <Play className="h-4 w-4 mb-1" />
                      <span className="text-[11px] font-semibold text-slate-800">Analyze</span>
                    </button>
                    <button
                      onClick={() => addBlock("email")}
                      className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer text-slate-600"
                    >
                      <Code2 className="h-4 w-4 mb-1" />
                      <span className="text-[11px] font-semibold text-slate-800">Send</span>
                    </button>
                    <button
                      onClick={() => addBlock("data")}
                      className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer text-slate-600"
                    >
                      <Database className="h-4 w-4 mb-1" />
                      <span className="text-[11px] font-semibold text-slate-800">Update</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* 4. Canvas in center */}
          <div className="flex-1 h-full relative bg-[#ffffff]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              defaultViewport={{ x: 50, y: 30, zoom: 0.95 }}
            >
              <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e2e8f0" />
            </ReactFlow>

            {/* Bottom Canvas Floating Toolbar matching Image 1 */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-md z-10 text-xs font-medium text-slate-600">
              <button className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-100">
                <span>100%</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              <span className="text-slate-300">|</span>
              <button className="p-1 rounded hover:bg-slate-100 text-blue-600">
                <MousePointer className="h-3.5 w-3.5" />
              </button>
              <button className="p-1 rounded hover:bg-slate-100 text-slate-400">
                <Hand className="h-3.5 w-3.5" />
              </button>
              <span className="text-slate-300">|</span>
              <button className="p-1 rounded hover:bg-slate-100 text-slate-400">
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <button className="p-1 rounded hover:bg-slate-100 text-slate-400">
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* 5. Right Inspector Drawer matching Image 1 */}
          <aside className="w-80 border-l border-slate-200 bg-white p-5 flex flex-col justify-between shrink-0 z-10 overflow-y-auto">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-50 text-purple-600 border border-purple-200">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Analyze Lead Message
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Model Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Model
                </label>
                <div className="relative">
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 appearance-none pr-8 focus:outline-none focus:border-blue-500 shadow-sm"
                  >
                    <option value="GPT-4o-mini">GPT-4o-mini</option>
                    <option value="GPT-4o">GPT-4o</option>
                    <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                    <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                  </select>
                  <Info className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Prompt Textarea */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Prompt
                </label>
                <textarea
                  value={nodePrompt}
                  onChange={(e) => setNodePrompt(e.target.value)}
                  className="w-full h-24 rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm resize-none leading-relaxed"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  AI will classify this message as sales, support, or general and return a structured JSON object.
                </p>
              </div>

              {/* Output Preview */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-600">
                    Output Preview
                  </label>
                  <button
                    onClick={handleCopyJson}
                    className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <pre className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-[11px] font-mono text-slate-800 leading-relaxed overflow-x-auto shadow-inner">
{`{
  "type": "sales",
  "score": 8.9,
  "summary": "Interested in
  enterprise plan for team
  expansion."
}`}
                </pre>
              </div>

              {/* Action Buttons: Test Node & Optimize */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleTestFlow}
                  className="rounded-xl bg-blue-600 p-2 text-xs font-bold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer text-center"
                >
                  Test Node
                </button>
                <button
                  onClick={() => alert("AI optimization applied!")}
                  className="rounded-xl border border-blue-200 bg-blue-50 p-2 text-xs font-bold text-blue-600 hover:bg-blue-100 transition-all cursor-pointer text-center"
                >
                  Optimize
                </button>
              </div>

              {/* Save as Template */}
              <button
                onClick={() => alert("Workflow saved as reusable template")}
                className="w-full rounded-xl bg-blue-600 p-2 text-xs font-bold text-white hover:bg-blue-700 transition-all cursor-pointer shadow-sm shadow-blue-500/20"
              >
                Save as Template
              </button>

              {/* Suggested Flow Banner */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-800">Suggested Flow</span>
                  <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                </div>
                <div className="rounded-xl border border-dashed border-purple-300 bg-purple-50/40 p-2.5 text-[11px] font-medium leading-relaxed">
                  <span className="text-purple-600">Typeform</span> →{" "}
                  <span className="text-purple-600">Analyze Lead Message (AI)</span> →{" "}
                  <span className="text-blue-600">Add to Google Sheets</span> →{" "}
                  <span className="text-amber-600">Send Slack Alert</span> →{" "}
                  <span className="text-emerald-600">Auto Draft Email</span>.
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Insert this structure into your canvas or adjust steps to fit your workflow.
                </p>
                <button
                  onClick={() => alert("Suggested flow inserted into canvas!")}
                  className="w-full mt-2 rounded-xl border border-emerald-300 bg-white p-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"
                >
                  Insert to Canvas
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* AI Generate Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-600">
                <Sparkles className="h-5 w-5" />
                <h3 className="text-sm font-bold text-slate-900">Generate Flow with AI Assist</h3>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. When a new customer lead arrives from Typeform, analyze the intent with AI, alert the sales Slack channel, and draft a response email..."
              className="w-full h-28 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none shadow-sm"
            />

            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setAiPrompt(
                      "When an Enterprise customer payment fails, apply 15% discount coupon and alert #sales on Slack"
                    )
                  }
                  className="text-[11px] text-blue-600 hover:underline cursor-pointer font-medium"
                >
                  Dunning Flow Example
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsAiModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAiGenerate}
                  disabled={isAiGenerating || !aiPrompt.trim()}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                >
                  {isAiGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Synthesizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Synthesize Flow
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
