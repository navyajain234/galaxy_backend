import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyApiKey } from "@/lib/unkey";

export async function GET(req: Request, { params }: { params: Promise<{ runId: string }> }) {
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

    const { runId } = await params;

    const run = await prisma.run.findUnique({
      where: { id: runId, userId: ownerId },
      include: {
        nodeExecutions: true
      }
    });

    if (!run) {
      return NextResponse.json({ error: "Run not found or unauthorized" }, { status: 404 });
    }

    // Determine outputs (e.g. from ResponseNode)
    let finalOutput = null;
    const responseNode = run.nodeExecutions.find(ex => ex.nodeType === "Response" || ex.nodeType === "ResponseNode");
    
    if (run.status === "SUCCESS" && responseNode) {
       finalOutput = responseNode.outputData;
    }

    return NextResponse.json({
      runId: run.id,
      status: run.status,
      workflowId: run.workflowId,
      startedAt: run.startedAt,
      completedAt: run.completedAt,
      error: run.error,
      creditCost: run.creditCost,
      output: finalOutput
    });
  } catch (e: any) {
    console.error("Public API run status error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
