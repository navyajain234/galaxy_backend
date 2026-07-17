import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { NODE_REGISTRY } from "@/config/nodeRegistry";

const server = new McpServer({
  name: "Galaxy AI Backend",
  version: "1.0.0",
});

// Expose Node Registry as an MCP resource
server.resource(
  "node-registry",
  new ResourceTemplate("galaxy://nodes", { list: undefined }),
  async (uri, { }) => {
    return {
      contents: [{
        uri: uri.href,
        text: JSON.stringify(NODE_REGISTRY, null, 2),
        mimeType: "application/json"
      }]
    };
  }
);

import { tasks } from "@trigger.dev/sdk/v3";

// Expose available workflows as a tool
server.tool(
  "list-workflows",
  "List available workflows for a user",
  {
    userId: z.string().describe("The user ID to list workflows for")
  },
  async ({ userId }) => {
    const workflows = await prisma.workflow.findMany({
      where: { userId },
      select: { id: true, name: true, createdAt: true, updatedAt: true }
    });
    
    return {
      content: [{ type: "text", text: JSON.stringify(workflows, null, 2) }]
    };
  }
);

// Tool to run a workflow
server.tool(
  "run-workflow",
  "Trigger a new run for a specific workflow",
  {
    workflowId: z.string().describe("The ID of the workflow to run"),
    userId: z.string().describe("The user ID requesting the run"),
    inputValues: z.record(z.string()).optional().describe("Optional key-value pairs for the workflow inputs (e.g. prompt)")
  },
  async ({ workflowId, userId, inputValues }) => {
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId, userId },
    });

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    const nodes = (workflow.nodes as any[]) || [];
    const edges = (workflow.edges as any[]) || [];

    // Extract default inputs from Request-Inputs node
    const inputNode = nodes.find((n) => n.type === "RequestInputsNode");
    let inputs = inputNode?.data?.fields || [];

    // Merge provided values
    if (inputValues && Array.isArray(inputs)) {
      inputs = inputs.map((field: any) => ({
        ...field,
        value: inputValues[field.id] !== undefined ? inputValues[field.id] : field.value
      }));
      if (inputNode) {
        inputNode.data = { ...inputNode.data, fields: inputs };
      }
    }

    // Create the database Run record
    const run = await prisma.run.create({
      data: {
        workflowId,
        userId,
        status: "PENDING",
        scope: "FULL",
      },
      include: {
        nodeExecutions: true,
      },
    });

    // Trigger the Trigger.dev orchestrator task
    await tasks.trigger("workflow-orchestrator", {
      runId: run.id,
      workflowId,
      nodes,
      edges,
      inputs,
    });

    return {
      content: [{ type: "text", text: JSON.stringify({ message: "Workflow triggered successfully", runId: run.id }, null, 2) }]
    };
  }
);

// Tool to get run status
server.tool(
  "get-run-status",
  "Query the status and outputs of a specific run",
  {
    runId: z.string().describe("The ID of the run to check")
  },
  async ({ runId }) => {
    const run = await prisma.run.findUnique({
      where: { id: runId },
      include: { nodeExecutions: true }
    });

    if (!run) {
      throw new Error("Run not found");
    }

    const responseNode = run.nodeExecutions.find(n => n.nodeType === "Response");
    const finalOutput = responseNode ? responseNode.outputData : null;

    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({
          runId: run.id,
          status: run.status,
          error: run.error,
          finalOutput,
          completedAt: run.completedAt
        }, null, 2) 
      }]
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Galaxy MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main()", error);
  process.exit(1);
});
