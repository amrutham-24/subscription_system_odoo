import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const payload = body.payload || {
      customerId: "cust_demo",
      customerName: "Acme Enterprise Corp",
      amount: 299.0,
      plan: "Enterprise",
      email: "billing@acme.com",
    };

    const workflow = await prisma.workflow.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
    });

    if (!workflow || !workflow.versions[0]) {
      return NextResponse.json({ error: "Workflow or version not found" }, { status: 404 });
    }

    const nodes: any[] = JSON.parse(workflow.versions[0].nodesJson || "[]");
    const edges: any[] = JSON.parse(workflow.versions[0].edgesJson || "[]");

    // Start execution run
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId: id,
        status: "RUNNING",
        triggerEvent: workflow.triggerEvent,
        payloadJson: JSON.stringify(payload),
      },
    });

    const nodeResults: any[] = [];
    let executionStatus = "SUCCESS";

    // 1. Process Trigger Node
    const triggerNode = nodes.find((n) => n.type === "triggerNode" || n.data?.category === "trigger") || nodes[0];
    if (triggerNode) {
      nodeResults.push({
        nodeId: triggerNode.id,
        nodeType: "trigger",
        status: "SUCCESS",
        output: {
          matchedEvent: workflow.triggerEvent,
          timestamp: new Date().toISOString(),
          payload,
        },
      });
    }

    // 2. Process Condition & Action Nodes following edges
    for (const node of nodes) {
      if (node.id === triggerNode?.id) continue;

      const isCondition = node.type === "conditionNode" || node.data?.category === "condition";
      const isAction = node.type === "actionNode" || node.data?.category === "action";

      if (isCondition) {
        // Evaluate condition
        const field = node.data?.field || "amount";
        const op = node.data?.operator || ">";
        const targetVal = node.data?.value ?? 100;
        const actualVal = payload[field] ?? 299;

        let passed = true;
        if (op === ">") passed = Number(actualVal) > Number(targetVal);
        else if (op === "<") passed = Number(actualVal) < Number(targetVal);
        else if (op === "==") passed = String(actualVal).toLowerCase() === String(targetVal).toLowerCase();

        nodeResults.push({
          nodeId: node.id,
          nodeType: "condition",
          status: passed ? "SUCCESS" : "SKIPPED",
          output: {
            field,
            operator: op,
            targetVal,
            actualVal,
            conditionResult: passed ? "PASSED" : "FAILED",
          },
        });
      } else if (isAction) {
        const actionType = node.data?.actionType || "send_email";
        let actionDetails = {};

        if (actionType === "apply_discount") {
          actionDetails = {
            discountPercent: node.data?.percent || 15,
            appliedCouponCode: `BRIGHT_${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          };
        } else if (actionType === "slack_notify") {
          actionDetails = {
            channel: node.data?.channel || "#billing-alerts",
            message: `⚠️ Alert: High-priority trigger '${workflow.triggerEvent}' executed for ${payload.customerName} ($${payload.amount})`,
            dispatched: true,
          };
        } else if (actionType === "send_email") {
          actionDetails = {
            to: payload.email || "billing@acme.com",
            subject: "Update Regarding Your Subscription Billing",
            template: node.data?.template || "dunning_courtesy_recovery",
            status: "SENT",
          };
        } else {
          actionDetails = { customAction: actionType, executed: true };
        }

        nodeResults.push({
          nodeId: node.id,
          nodeType: "action",
          status: "SUCCESS",
          output: actionDetails,
        });
      }
    }

    // Persist all node results
    await prisma.$transaction(async (tx) => {
      for (const res of nodeResults) {
        await tx.workflowExecutionNode.create({
          data: {
            executionId: execution.id,
            nodeId: res.nodeId,
            nodeType: res.nodeType,
            status: res.status,
            outputJson: JSON.stringify(res.output),
          },
        });
      }

      await tx.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: executionStatus,
          completedAt: new Date(),
        },
      });
    });

    return NextResponse.json({
      success: true,
      executionId: execution.id,
      status: executionStatus,
      nodeResults,
    });
  } catch (error) {
    console.error("Execution error:", error);
    return NextResponse.json({ error: "Workflow execution failed" }, { status: 500 });
  }
}
