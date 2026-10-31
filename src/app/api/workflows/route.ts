import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await getCurrentAuth();
    const org = auth?.organization ?? (await prisma.organization.findFirst());
    if (!org) return NextResponse.json([], { status: 200 });

    const workflows = await prisma.workflow.findMany({
      where: { organizationId: org.id },
      include: {
        versions: {
          orderBy: { version: "desc" },
          take: 1,
        },
        executions: {
          orderBy: { startedAt: "desc" },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(workflows);
  } catch (error) {
    console.error("Workflows GET error:", error);
    return NextResponse.json({ error: "Failed to fetch workflows" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getCurrentAuth();
    const org = auth?.organization ?? (await prisma.organization.findFirst());
    if (!org) return NextResponse.json({ error: "No organization found" }, { status: 400 });

    const { name, description, triggerEvent, nodes, edges } = await request.json();

    if (!name || !triggerEvent) {
      return NextResponse.json({ error: "Name and triggerEvent are required" }, { status: 400 });
    }

    const workflow = await prisma.workflow.create({
      data: {
        organizationId: org.id,
        name,
        description: description || null,
        triggerEvent,
        active: true,
        versions: {
          create: {
            version: 1,
            nodesJson: JSON.stringify(nodes || []),
            edgesJson: JSON.stringify(edges || []),
          },
        },
      },
      include: {
        versions: true,
      },
    });

    return NextResponse.json(workflow, { status: 201 });
  } catch (error) {
    console.error("Workflows POST error:", error);
    return NextResponse.json({ error: "Failed to create workflow" }, { status: 500 });
  }
}
