import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await getCurrentAuth();
    const org = auth?.organization ?? (await prisma.organization.findFirst());
    if (!org) return NextResponse.json([], { status: 200 });

    const subscriptions = await prisma.subscription.findMany({
      where: { organizationId: org.id },
      include: {
        customer: true,
        plan: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const plans = await prisma.plan.findMany({
      where: { organizationId: org.id },
    });

    return NextResponse.json({ subscriptions, plans });
  } catch (error) {
    console.error("Subscriptions GET error:", error);
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getCurrentAuth();
    const org = auth?.organization ?? (await prisma.organization.findFirst());
    if (!org) return NextResponse.json({ error: "No organization found" }, { status: 400 });

    const { customerId, planId } = await request.json();

    if (!customerId || !planId) {
      return NextResponse.json({ error: "customerId and planId are required" }, { status: 400 });
    }

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const now = new Date();
    const daysToAdd = plan.interval === "YEARLY" ? 365 : 30;
    const periodEnd = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

    const subscription = await prisma.subscription.create({
      data: {
        organizationId: org.id,
        customerId,
        planId,
        status: "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
      include: {
        customer: true,
        plan: true,
      },
    });

    // Also automatically generate the initial invoice
    const invCount = await prisma.invoice.count({ where: { organizationId: org.id } });
    const invoiceNumber = `INV-2026-${String(invCount + 1).padStart(3, "0")}`;
    const tax = plan.price * 0.08;

    await prisma.invoice.create({
      data: {
        organizationId: org.id,
        customerId,
        subscriptionId: subscription.id,
        number: invoiceNumber,
        subtotal: plan.price,
        tax,
        discount: 0,
        total: plan.price + tax,
        status: "PAID",
        dueDate: now,
        paidAt: now,
      },
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error("Subscriptions POST error:", error);
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status, planId } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Subscription ID required" }, { status: 400 });
    }

    const dataToUpdate: any = {};
    if (status) dataToUpdate.status = status;
    if (planId) dataToUpdate.planId = planId;
    if (status === "CANCELED") dataToUpdate.canceledAt = new Date();

    const updated = await prisma.subscription.update({
      where: { id },
      data: dataToUpdate,
      include: { customer: true, plan: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Subscription update error:", error);
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
  }
}
