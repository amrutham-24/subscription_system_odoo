import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const lower = prompt.toLowerCase();

    // Intelligent semantic intent analysis
    let triggerEvent = "invoice.overdue";
    let triggerLabel = "Invoice Overdue";
    let triggerDesc = "Triggered when an invoice passes due date";

    if (lower.includes("fail") || lower.includes("payment")) {
      triggerEvent = "payment.failed";
      triggerLabel = "Payment Failed";
      triggerDesc = "Triggered when a charge attempt fails";
    } else if (lower.includes("new customer") || lower.includes("signup") || lower.includes("onboard")) {
      triggerEvent = "customer.created";
      triggerLabel = "New Customer Signup";
      triggerDesc = "Triggered when a customer account is created";
    } else if (lower.includes("churn") || lower.includes("risk")) {
      triggerEvent = "churn_risk.high";
      triggerLabel = "High Churn Risk Detected";
      triggerDesc = "Triggered when customer engagement drops";
    } else if (lower.includes("renew") || lower.includes("subscription")) {
      triggerEvent = "subscription.renewed";
      triggerLabel = "Subscription Renewed";
      triggerDesc = "Triggered on recurring billing renewal";
    }

    // Condition extraction
    let conditionLabel = "Check Invoice Amount";
    let conditionField = "amount";
    let conditionOp = ">";
    let conditionVal: string | number = 100;
    let conditionDesc = "Evaluate if amount > $100";

    if (lower.includes("enterprise") || lower.includes("pro")) {
      conditionLabel = "Check Customer Plan";
      conditionField = "plan";
      conditionOp = "==";
      conditionVal = lower.includes("enterprise") ? "Enterprise" : "Growth Pro";
      conditionDesc = `Verify customer plan is ${conditionVal}`;
    }

    // Action 1: Discount or Special offer
    const hasDiscount = lower.includes("discount") || lower.includes("coupon") || lower.includes("retention");
    const discountPercent = lower.match(/(\d+)%/)?.[1] ? parseInt(lower.match(/(\d+)%/)?.[1]!) : 15;

    // Action 2: Slack or Webhook
    const hasSlack = lower.includes("slack") || lower.includes("notify team") || lower.includes("alert");
    const slackChannel = lower.includes("churn") ? "#retention-team" : "#billing-alerts";

    // Build the dynamic React Flow nodes
    const nodes: any[] = [
      {
        id: "ai-node-1",
        type: "triggerNode",
        position: { x: 260, y: 40 },
        data: {
          label: triggerLabel,
          category: "trigger",
          event: triggerEvent,
          description: triggerDesc,
        },
      },
      {
        id: "ai-node-2",
        type: "conditionNode",
        position: { x: 260, y: 180 },
        data: {
          label: conditionLabel,
          category: "condition",
          field: conditionField,
          operator: conditionOp,
          value: conditionVal,
          description: conditionDesc,
        },
      },
    ];

    const edges: any[] = [
      { id: "e-ai-1-2", source: "ai-node-1", target: "ai-node-2" },
    ];

    if (hasDiscount) {
      nodes.push({
        id: "ai-node-3",
        type: "actionNode",
        position: { x: 100, y: 320 },
        data: {
          label: `Apply ${discountPercent}% Retention Coupon`,
          category: "action",
          actionType: "apply_discount",
          percent: discountPercent,
          description: `Automatically inject ${discountPercent}% discount into upcoming invoice`,
        },
      });
      edges.push({ id: "e-ai-2-3", source: "ai-node-2", target: "ai-node-3", label: "True" });
    }

    if (hasSlack || !hasDiscount) {
      nodes.push({
        id: "ai-node-4",
        type: "actionNode",
        position: { x: 420, y: 320 },
        data: {
          label: `Post to ${slackChannel}`,
          category: "action",
          actionType: "slack_notify",
          channel: slackChannel,
          description: "Send automated message to internal team channel",
        },
      });
      edges.push({ id: "e-ai-2-4", source: "ai-node-2", target: "ai-node-4", label: "True" });
    }

    // Final follow-up email node
    nodes.push({
      id: "ai-node-5",
      type: "actionNode",
      position: { x: 260, y: 460 },
      data: {
        label: "Send Personalized Customer Email",
        category: "action",
        actionType: "send_email",
        template: lower.includes("onboard") ? "welcome_series_day1" : "recovery_courtesy_notice",
        description: "Send automated personalized email to customer primary contact",
      },
    });

    if (hasDiscount) {
      edges.push({ id: "e-ai-3-5", source: "ai-node-3", target: "ai-node-5" });
    } else {
      edges.push({ id: "e-ai-4-5", source: "ai-node-4", target: "ai-node-5" });
    }

    const workflowName = `AI Generated: ${triggerLabel} Automation`;
    const workflowDescription = `Synthesized from prompt: "${prompt}"`;

    return NextResponse.json({
      success: true,
      workflow: {
        name: workflowName,
        description: workflowDescription,
        triggerEvent,
        nodes,
        edges,
      },
    });
  } catch (error) {
    console.error("AI workflow generation error:", error);
    return NextResponse.json({ error: "Failed to generate workflow" }, { status: 500 });
  }
}
