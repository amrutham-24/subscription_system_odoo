import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const workflow = await prisma.workflow.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { version: "desc" },
          take: 1,
        },
        executions: {
          orderBy: { startedAt: "desc" },
          take: 10,
          include: {
            nodeResults: {
              orderBy: { executedAt: "asc" },
            },
          },
        },
      },
    });

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    return NextResponse.json(workflow);
  } catch (error) {
    console.error("Workflow GET error:", error);
    return NextResponse.json({ error: "Failed to fetch workflow" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, description, active, triggerEvent, nodes, edges } = await request.json();

    const workflow = await prisma.workflow.findUnique({
      where: { id },
      include: { versions: { orderBy: { version: "desc" }, take: 1 } },
    });

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    const currentVersion = workflow.versions[0]?.version || 1;
    const newVersion = currentVersion + 1;

    const updated = await prisma.$transaction(async (tx) => {
      const wf = await tx.workflow.update({
        where: { id },
        data: {
          name: name ?? workflow.name,
          description: description ?? workflow.description,
          active: active ?? workflow.active,
          triggerEvent: triggerEvent ?? workflow.triggerEvent,
        },
      });

      if (nodes && edges) {
        await tx.workflowVersion.create({
          data: {
            workflowId: id,
            version: newVersion,
            nodesJson: JSON.stringify(nodes),
            edgesJson: JSON.stringify(edges),
          },
        });
      }

      return wf;
    });

    return NextResponse.json({ success: true, workflow: updated });
  } catch (error) {
    console.error("Workflow PUT error:", error);
    return NextResponse.json({ error: "Failed to update workflow" }, { status: 500 });
  }
}
