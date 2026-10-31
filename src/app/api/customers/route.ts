import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await getCurrentAuth();
    const org = auth?.organization ?? (await prisma.organization.findFirst());
    if (!org) return NextResponse.json([], { status: 200 });

    const customers = await prisma.customer.findMany({
      where: { organizationId: org.id },
      include: {
        subscriptions: {
          include: { plan: true },
          take: 1,
        },
        invoices: {
          take: 3,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Customers GET error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getCurrentAuth();
    const org = auth?.organization ?? (await prisma.organization.findFirst());
    if (!org) return NextResponse.json({ error: "No organization found" }, { status: 400 });

    const { name, email, company, phone, churnRisk } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: {
        organizationId: org.id,
        name,
        email: email.toLowerCase().trim(),
        company: company || null,
        phone: phone || null,
        churnRisk: churnRisk || "LOW",
        status: "ACTIVE",
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("Customers POST error:", error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
