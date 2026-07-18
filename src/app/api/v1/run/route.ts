import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyApiKey } from "@/lib/unkey";
import { tasks } from "@trigger.dev/sdk/v3";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid Authorization header" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const { valid, error, ownerId } = await verifyApiKey(token);

    if (!valid || !ownerId) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { workflowId, inputs, webhookUrl } = body;

    if (!workflowId) {
      return NextResponse.json({ error: "workflowId is required" }, { status: 400 });
    }

    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId, userId: ownerId },
    });

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found or unauthorized" }, { status: 404 });
    }

    const nodes = (workflow.nodes as any[]) || [];
    const edges = (workflow.edges as any[]) || [];

    // Inject requested inputs into the RequestInputsNode
    const inputNode = nodes.find((n) => n.type === "RequestInputsNode");
    let actualInputs = inputs || {};
    
    if (inputNode) {
       // Merge incoming inputs into the node's data.
       actualInputs = { ...(inputNode.data?.fields || {}), ...actualInputs };
    }

    // Create the database Run record
    const run = await prisma.run.create({
      data: {
        workflowId,
        userId: ownerId,
        status: "PENDING",
        scope: "FULL",
      },
      include: {
        nodeExecutions: true,
      },
    });

    // Hide Vercel env vars from Trigger SDK to bypass branch environment matching
    const originalVercel = process.env.VERCEL;
    const originalVercelEnv = process.env.VERCEL_ENV;
    const originalVercelUrl = process.env.VERCEL_URL;
    const originalVercelGitCommitRef = process.env.VERCEL_GIT_COMMIT_REF;
    delete process.env.VERCEL;
    delete process.env.VERCEL_ENV;
    delete process.env.VERCEL_URL;
    delete process.env.VERCEL_GIT_COMMIT_REF;

    try {
      // Trigger the Trigger.dev orchestrator task
      await tasks.trigger("workflow-orchestrator", {
        runId: run.id,
        workflowId,
        nodes,
        edges,
        inputs: actualInputs,
        webhookUrl
      });
    } finally {
      if (originalVercel !== undefined) process.env.VERCEL = originalVercel;
      if (originalVercelEnv !== undefined) process.env.VERCEL_ENV = originalVercelEnv;
      if (originalVercelUrl !== undefined) process.env.VERCEL_URL = originalVercelUrl;
      if (originalVercelGitCommitRef !== undefined) process.env.VERCEL_GIT_COMMIT_REF = originalVercelGitCommitRef;
    }

    if (webhookUrl) {
       console.log(`Webhook requested for run ${run.id} to ${webhookUrl}`);
    }

    return NextResponse.json({
      runId: run.id,
      status: "PENDING"
    });
  } catch (e: any) {
    console.error("Public API run trigger error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
