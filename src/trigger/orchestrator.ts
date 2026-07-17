import { task } from "@trigger.dev/sdk/v3";
import prisma from "@/lib/prisma";
import { NODE_REGISTRY } from "@/config/nodeRegistry";
import {
  gptImageTask,
  klingTask,
  openRouterTask,
  mergeVideoTask,
  mergeAVTask,
  extractAudioTask
} from "./subtasks";

const taskMap: Record<string, any> = {
  "GptImageNode": gptImageTask,
  "KlingNode": klingTask,
  "OpenRouterNode": openRouterTask,
  "MergeVideoNode": mergeVideoTask,
  "MergeAVNode": mergeAVTask,
  "ExtractAudioNode": extractAudioTask,
};

interface OrchestratorPayload {
  runId: string;
  workflowId: string;
  nodes: any[];
  edges: any[];
  inputs: Record<string, any>;
  webhookUrl?: string;
}

export const workflowOrchestrator = task({
  id: "workflow-orchestrator",
  run: async (payload: OrchestratorPayload) => {
    const { runId, nodes, edges } = payload;
    
    console.log(`Starting orchestrator for run ${runId}`);
    
    // Fetch run to get userId
    const dbRun = await prisma.run.findUnique({ where: { id: runId } });
    if (!dbRun) throw new Error("Run not found");
    const userId = dbRun.userId;

    // 1. Calculate Total Cost
    let totalCost = 0;
    for (const node of nodes) {
      const def = NODE_REGISTRY.find(d => d.type === node.type);
      if (def) totalCost += def.baseCost;
    }

    // 2. Pre-flight Check & Prisma Transaction
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: "placeholder@clerk.dev", // We don't have the email in the payload, but it's required by schema.
        credits: 100,
      }
    });
    
    if (user.credits < totalCost) {
      await prisma.run.update({
        where: { id: runId },
        data: { status: "FAILED", error: `Insufficient credits. Required: ${totalCost}, Available: ${user.credits}` }
      });
      return { success: false, error: "Insufficient credits" };
    }

    // Deduct credits upfront and set to RUNNING
    if (totalCost > 0) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { credits: { decrement: totalCost } }
        }),
        prisma.creditTransaction.create({
          data: {
            userId,
            amount: -totalCost,
            type: "DEDUCTION",
            description: `Workflow run cost`,
            referenceId: runId
          }
        })
      ]);
    }
    
    await prisma.run.update({
      where: { id: runId },
      data: { status: "RUNNING", creditCost: totalCost }
    });

    // 3. Topological Sorter (Layers)
    const inDegree: Record<string, number> = {};
    const children: Record<string, string[]> = {};
    nodes.forEach(n => {
      inDegree[n.id] = 0;
      children[n.id] = [];
    });
    
    edges.forEach(e => {
      inDegree[e.target] = (inDegree[e.target] || 0) + 1;
      if (!children[e.source]) children[e.source] = [];
      children[e.source].push(e.target);
    });

    const layers: any[][] = [];
    const queue = nodes.filter(n => inDegree[n.id] === 0);
    
    if (queue.length === 0 && nodes.length > 0) {
      await prisma.run.update({ where: { id: runId }, data: { status: "FAILED", error: "Cyclic loop detected" } });
      return { success: false, error: "Cyclic loop" };
    }

    let processedCount = 0;
    while (queue.length > 0) {
      const currentLayer = [...queue];
      layers.push(currentLayer);
      queue.length = 0; // clear queue

      for (const node of currentLayer) {
        processedCount++;
        for (const child of (children[node.id] || [])) {
          inDegree[child]--;
          if (inDegree[child] === 0) {
            queue.push(nodes.find(n => n.id === child)!);
          }
        }
      }
    }

    if (processedCount < nodes.length) {
      await prisma.run.update({ where: { id: runId }, data: { status: "FAILED", error: "Cyclic loop detected" } });
      return { success: false, error: "Cyclic loop" };
    }

    // 4. Execution Loop
    const nodeResults: Record<string, any> = {};

    const resolveInputs = (nodeId: string, nodeData: any) => {
      const incomingEdges = edges.filter(e => e.target === nodeId);
      const resolved = { ...nodeData };

      incomingEdges.forEach(edge => {
        const parentOutput = nodeResults[edge.source];
        if (parentOutput == null) return;
        
        let value: any = undefined;

        // RequestInputsNode stores its data with a `fields` array
        if (parentOutput && Array.isArray(parentOutput.fields)) {
           const field = parentOutput.fields.find((f: any) => f.id === edge.sourceHandle);
           value = field ? field.value : null;
        } else if (typeof parentOutput === "object" && edge.sourceHandle) {
           // First try the exact sourceHandle key
           if (edge.sourceHandle in parentOutput) {
             value = parentOutput[edge.sourceHandle];
           } else {
             // Fallback: try known output keys
             value = parentOutput.result ?? parentOutput.response ?? parentOutput.url ?? parentOutput.videoUrl ?? parentOutput.imageUrl ?? parentOutput.audioUrl ?? Object.values(parentOutput)[0];
           }
        } else if (typeof parentOutput === "object") {
           value = parentOutput.result ?? parentOutput.response ?? parentOutput.url ?? parentOutput.videoUrl ?? parentOutput.imageUrl ?? parentOutput.audioUrl ?? Object.values(parentOutput)[0];
        } else {
           value = parentOutput;
        }
        
        if (value == null) return;

        if (edge.targetHandle) {
          if (["videos"].includes(edge.targetHandle)) {
            if (!Array.isArray(resolved[edge.targetHandle])) resolved[edge.targetHandle] = [];
            resolved[edge.targetHandle].push(value);
          } else {
            resolved[edge.targetHandle] = value;
          }
        }
      });
      return resolved;
    };

    let hasFailure = false;
    let errorMessage = "";
    
    const { batch } = await import("@trigger.dev/sdk/v3");

    for (const layer of layers) {
      const batchItems: Array<{ id: string; payload: any; dbId: string; nodeObj: any }> = [];
      const instantResults: Array<{ nodeObj: any; resolvedInputs: any }> = [];

      for (const nodeObj of layer) {
        const resolvedInputs = resolveInputs(nodeObj.id, nodeObj.data || {});
        const nodeDef = NODE_REGISTRY.find(d => d.type === nodeObj.type);
        const nodeName = nodeDef?.name || nodeObj.type;

        if (nodeObj.type === "RequestInputsNode" || nodeObj.type === "ResponseNode") {
          instantResults.push({ nodeObj, resolvedInputs });
          continue;
        }

        // Validate resolvedInputs against node definition schema
        if (nodeDef) {
          const { z } = await import("zod");
          const schemaMap: Record<string, z.ZodTypeAny> = {};
          nodeDef.inputs.forEach(input => {
            schemaMap[input.name] = input.schema;
          });
          const nodeSchema = z.object(schemaMap);
          const validation = nodeSchema.safeParse(resolvedInputs);
          
          if (!validation.success) {
            hasFailure = true;
            const issues = validation.error.issues || validation.error.errors || [];
            errorMessage = issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(", ");
            
            await prisma.nodeExecution.create({
              data: {
                runId,
                nodeId: nodeObj.id,
                nodeType: nodeName,
                status: "FAILED",
                error: errorMessage,
                inputsUsed: resolvedInputs,
                creditCost: nodeDef.baseCost || 0
              }
            });
            break;
          }
          
          // Use validated data which includes default values and transformations
          Object.assign(resolvedInputs, validation.data);
        }

        const subtask = taskMap[nodeObj.type];
        if (!subtask) {
          hasFailure = true;
          errorMessage = `No subtask mapped for node type: ${nodeObj.type}`;
          break;
        }

        const dbExecution = await prisma.nodeExecution.create({
          data: {
            runId,
            nodeId: nodeObj.id,
            nodeType: nodeName,
            status: "PENDING",
            inputsUsed: resolvedInputs,
            creditCost: nodeDef?.baseCost || 0
          }
        });

        batchItems.push({
          id: subtask.id,
          payload: { dbId: dbExecution.id, ...resolvedInputs },
          dbId: dbExecution.id,
          nodeObj
        });
      }

      if (hasFailure) break;

      // Import metadata here or at the top. Wait, it's better to import at the top.
      const { metadata } = await import("@trigger.dev/sdk/v3");
      
      // Sync metadata before batch (shows nodes as PENDING)
      const currentExecs = await prisma.nodeExecution.findMany({ where: { runId } });
      await metadata.set("nodeExecutions", currentExecs as any);

      // Process instant nodes
      for (const { nodeObj, resolvedInputs } of instantResults) {
        const nodeDef = NODE_REGISTRY.find(d => d.type === nodeObj.type);
        const nodeName = nodeDef?.name || nodeObj.type;
        nodeResults[nodeObj.id] = resolvedInputs;
        await prisma.nodeExecution.create({
          data: {
            runId,
            nodeId: nodeObj.id,
            nodeType: nodeName,
            status: "SUCCESS",
            inputsUsed: resolvedInputs,
            outputData: resolvedInputs,
            completedAt: new Date()
          }
        });
      }

      // Execute batch for this layer
      if (batchItems.length > 0) {
        try {
          const batchResult = await batch.triggerAndWait(
            batchItems.map(item => ({ id: item.id, payload: item.payload }))
          );

          let i = 0;
          for (const item of batchItems) {
            const result = batchResult.runs[i++];
            if (result.ok) {
              nodeResults[item.nodeObj.id] = result.output;
            } else {
              hasFailure = true;
              errorMessage = (result.error as any)?.message || "Subtask failed";
              await prisma.nodeExecution.update({
                where: { id: item.dbId },
                data: { status: "FAILED", error: errorMessage }
              });
            }
          }
        } catch (error: any) {
          hasFailure = true;
          errorMessage = error.message;
          for (const item of batchItems) {
            await prisma.nodeExecution.update({
              where: { id: item.dbId },
              data: { status: "FAILED", error: errorMessage }
            });
          }
        }
        
        // Sync metadata after batch finishes
        const afterBatchExecs = await prisma.nodeExecution.findMany({ where: { runId } });
        await metadata.set("nodeExecutions", afterBatchExecs as any);
      }

      if (hasFailure) {
        break; // Stop executing further layers
      }
    }

    await prisma.run.update({
      where: { id: runId },
      data: {
        status: hasFailure ? "FAILED" : "SUCCESS",
        error: hasFailure ? errorMessage : null,
        completedAt: new Date()
      }
    });
    
    // Outbound Webhook
    if (payload.webhookUrl) {
      try {
        console.log(`Emitting webhook to ${payload.webhookUrl} for run ${runId}`);
        await fetch(payload.webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            runId,
            status: hasFailure ? "FAILED" : "SUCCESS",
            error: hasFailure ? errorMessage : null,
            results: nodeResults
          })
        });
      } catch (webhookErr) {
        console.error(`Failed to emit webhook for run ${runId}`, webhookErr);
      }
    }
    
    return { success: !hasFailure, results: nodeResults };
  }
});

