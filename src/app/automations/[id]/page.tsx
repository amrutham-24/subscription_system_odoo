import { prisma } from "@/lib/prisma";
import { WorkflowBuilder } from "@/components/automations/WorkflowBuilder";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function WorkflowEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const workflow = await prisma.workflow.findUnique({
    where: { id },
    include: {
      versions: {
        orderBy: { version: "desc" },
        take: 1,
      },
    },
  });

  if (!workflow) {
    notFound();
  }

  const latestVersion = workflow.versions[0];
  const initialNodes = latestVersion ? JSON.parse(latestVersion.nodesJson) : [];
  const initialEdges = latestVersion ? JSON.parse(latestVersion.edgesJson) : [];

  return (
    <WorkflowBuilder
      workflowId={workflow.id}
      initialName={workflow.name}
      initialDescription={workflow.description || undefined}
      initialTriggerEvent={workflow.triggerEvent}
      initialNodes={initialNodes}
      initialEdges={initialEdges}
    />
  );
}
