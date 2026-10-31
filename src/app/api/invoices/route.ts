import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await getCurrentAuth();
    const org = auth?.organization ?? (await prisma.organization.findFirst());
    if (!org) return NextResponse.json([], { status: 200 });

    const invoices = await prisma.invoice.findMany({
      where: { organizationId: org.id },
      include: {
        customer: true,
        subscription: { include: { plan: true } },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Invoices GET error:", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}
