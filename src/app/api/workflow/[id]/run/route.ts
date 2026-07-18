import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { tasks } from "@trigger.dev/sdk/v3";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workflow = await prisma.workflow.findUnique({
      where: { id, userId },
    });

    if (!workflow) {
      console.log("404 ERROR! workflow not found for ID:", id, "userId:", userId);
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    const body = await req.json();
    const { scope, nodeIds, values } = body; // SINGLE or PARTIAL run

    let nodes = (workflow.nodes as any[]) || [];
    let edges = (workflow.edges as any[]) || [];

    // Extract default inputs from Request-Inputs node
    const inputNode = nodes.find((n) => n.type === "RequestInputsNode");
    let inputs = inputNode?.data?.fields || [];

    // Merge provided values from the UI playground
    if (values && Array.isArray(inputs)) {
      inputs = inputs.map((field: any) => ({
        ...field,
        value: values[field.id] !== undefined ? values[field.id] : field.value
      }));
      // Update the node data so that the injected values flow to the rest of the graph
      if (inputNode) {
        inputNode.data = { ...inputNode.data, fields: inputs };
      }
    }

    // Scoped run: execute only the requested nodes. Edges crossing the
    // boundary are resolved by injecting the parent's last stored output
    // (or Request-Inputs field value) directly into the target node's data.
    if (Array.isArray(nodeIds) && nodeIds.length > 0) {
      const idSet = new Set<string>(nodeIds);
      const nodeById = new Map(nodes.map((n) => [n.id, n]));
      const subNodes = nodes
        .filter((n) => idSet.has(n.id))
        .map((n) => ({ ...n, data: { ...(n.data || {}) } }));

      if (subNodes.length === 0) {
        return NextResponse.json({ error: "No matching nodes to run." }, { status: 400 });
      }

      const boundaryEdges = edges.filter((e) => idSet.has(e.target) && !idSet.has(e.source));
      for (const e of boundaryEdges) {
        const parent = nodeById.get(e.source);
        if (!parent) continue;

        let value: any = null;
        if (parent.type === "RequestInputsNode") {
          const field = (parent.data?.fields || []).find((f: any) => f.id === e.sourceHandle);
          value = field?.value ?? null;
        } else {
          value = parent.data?.response ?? parent.data?.result ?? null;
        }
        if (value == null || value === "") continue;

        const target = subNodes.find((n) => n.id === e.target);
        if (!target) continue;
        const th = e.targetHandle || "";
        if (th) {
          if (["videos"].includes(th)) {
            target.data[th] = [...(target.data[th] || []), value];
          } else {
            target.data[th] = value;
          }
        }
      }

      nodes = subNodes;
      edges = edges.filter((e) => idSet.has(e.source) && idSet.has(e.target));
    }

    // Cycle detection check (DAG check)
    const checkCycle = (): boolean => {
      const adj: Record<string, string[]> = {};
      edges.forEach((edge) => {
        if (!adj[edge.source]) adj[edge.source] = [];
        adj[edge.source].push(edge.target);
      });

      const visited = new Set<string>();
      const recStack = new Set<string>();

      const dfs = (node: string): boolean => {
        visited.add(node);
        recStack.add(node);

        const neighbors = adj[node] || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            if (dfs(neighbor)) return true;
          } else if (recStack.has(neighbor)) {
            return true;
          }
        }

        recStack.delete(node);
        return false;
      };

      for (const node of nodes) {
        if (!visited.has(node.id)) {
          if (dfs(node.id)) return true;
        }
      }
      return false;
    };

    if (checkCycle()) {
      return NextResponse.json({ error: "Invalid workflow: Graph contains cycles." }, { status: 400 });
    }

    // Create the database Run record
    const run = await prisma.run.create({
      data: {
        workflowId: id,
        userId,
        status: "PENDING",
        scope: scope ?? "FULL",
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
      const handle = await tasks.trigger("workflow-orchestrator", {
        runId: run.id,
        workflowId: id,
        nodes,
        edges,
        inputs,
      });

      // We can import auth from trigger.dev or just use it if already imported
      const { auth: triggerAuth } = await import("@trigger.dev/sdk/v3");
      const publicToken = await triggerAuth.createPublicToken({
        scopes: { read: { runs: [handle.id] } }
      });

      return NextResponse.json({ ...run, triggerRunId: handle.id, triggerToken: publicToken });
    } finally {
      if (originalVercel !== undefined) process.env.VERCEL = originalVercel;
      if (originalVercelEnv !== undefined) process.env.VERCEL_ENV = originalVercelEnv;
      if (originalVercelUrl !== undefined) process.env.VERCEL_URL = originalVercelUrl;
      if (originalVercelGitCommitRef !== undefined) process.env.VERCEL_GIT_COMMIT_REF = originalVercelGitCommitRef;
    }
  } catch (e: any) {
    console.error("Run trigger API error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
