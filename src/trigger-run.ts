import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { PrismaClient } from '@prisma/client';
import { tasks } from '@trigger.dev/sdk/v3';

const prisma = new PrismaClient();

async function main() {
  const workflow = await prisma.workflow.findFirst({
    orderBy: { updatedAt: 'desc' }
  });

  if (!workflow) {
    console.log("No workflows found!");
    return;
  }

  const nodes = (workflow.nodes as any[]) || [];
  const edges = (workflow.edges as any[]) || [];

  const run = await prisma.run.create({
    data: {
      workflowId: workflow.id,
      userId: workflow.userId,
      status: 'PENDING',
      scope: 'FULL'
    }
  });

  console.log("Created Run ID:", run.id, "for Workflow:", workflow.id);

  const inputNode = nodes.find((n) => n.type === 'RequestInputsNode');
  const inputs = inputNode?.data?.fields || [];

  await tasks.trigger("workflow-orchestrator", {
    runId: run.id,
    workflowId: workflow.id,
    nodes,
    edges,
    inputs,
  });

  console.log("Triggered workflow-orchestrator task.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
