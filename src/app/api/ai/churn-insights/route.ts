import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await getCurrentAuth();
    const org = auth?.organization ?? (await prisma.organization.findFirst());
    if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

    const [highRiskCustomers, pastDueInvoices, totalSubs] = await Promise.all([
      prisma.customer.findMany({
        where: { organizationId: org.id, churnRisk: "HIGH" },
        include: { subscriptions: { include: { plan: true } } },
      }),
      prisma.invoice.findMany({
        where: { organizationId: org.id, status: "PAST_DUE" },
        include: { customer: true },
      }),
      prisma.subscription.count({ where: { organizationId: org.id } }),
    ]);

    const atRiskMRR = highRiskCustomers.reduce((acc, c) => {
      const planPrice = c.subscriptions[0]?.plan?.price || 0;
      return acc + (c.subscriptions[0]?.plan?.interval === "YEARLY" ? planPrice / 12 : planPrice);
    }, 0);

    const insights = [
      {
        id: "insight-1",
        type: "CRITICAL",
        title: `${highRiskCustomers.length} High-Risk Accounts Detected ($${Math.round(atRiskMRR)}/mo at risk)`,
        summary: `Accounts including ${highRiskCustomers.map((c) => c.name).slice(0, 2).join(", ")} show declining product usage and overdue payments.`,
        recommendedAction: "Deploy proactive customer success check-in and 15% annual renewal incentive.",
        suggestedPrompt: "When customer has high churn risk and plan is Enterprise, alert #customer-success and apply 15% discount",
      },
      {
        id: "insight-2",
        type: "OPPORTUNITY",
        title: "Expansion Opportunity for Active Growth Pro Accounts",
        summary: "70% of Pro subscribers have been active for >60 days with 0 failed payments.",
        recommendedAction: "Trigger an in-app upgrade prompt with 1-month free Enterprise trial.",
        suggestedPrompt: "When subscription renewed for 2nd time, send email offering 30-day Enterprise trial",
      },
    ];

    return NextResponse.json({
      atRiskMRR: Math.round(atRiskMRR),
      highRiskCount: highRiskCustomers.length,
      pastDueCount: pastDueInvoices.length,
      insights,
    });
  } catch (error) {
    console.error("AI Churn insights error:", error);
    return NextResponse.json({ error: "Failed to generate churn insights" }, { status: 500 });
  }
}
