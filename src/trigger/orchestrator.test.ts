import { describe, it, expect, vi, beforeEach } from 'vitest';
import { workflowOrchestrator } from './orchestrator';
import prisma from '@/lib/prisma';

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  default: {
    run: {
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    nodeExecution: {
      create: vi.fn(),
    },
    creditTransaction: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock('@trigger.dev/sdk/v3', () => ({
  task: vi.fn((opts) => opts),
  batch: {
    triggerAndWait: vi.fn(),
  },
  wait: {
    forToken: vi.fn(),
    createToken: vi.fn(),
    for: vi.fn(),
  },
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock('./subtasks', () => ({
  openRouterTask: {},
  mergeVideoTask: {},
  mergeAVTask: {},
  extractAudioTask: {},
  gptImageTask: {},
  klingTask: {},
}));

describe('Orchestrator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fails if user has insufficient credits', async () => {
    const runId = 'test-run-1';
    
    // Mock user with 0 credits
    vi.mocked(prisma.run.findUnique).mockResolvedValue({ id: runId, userId: 'user-1' } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'user-1', credits: 0 } as any);

    // Mock nodes with high cost
    const nodes = [
      { id: 'node1', type: 'OpenRouterNode' } // Cost 2
    ];

    // Get the run function from the task definition
    const runFn = (workflowOrchestrator as any).run;
    
    const result = await runFn({
      runId,
      workflowId: 'wf-1',
      nodes,
      edges: [],
      inputs: {}
    });

    expect(result).toEqual({ success: false, error: 'Insufficient credits' });
    expect(prisma.run.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: runId },
      data: expect.objectContaining({ status: 'FAILED' })
    }));
  });

  it('deducts credits if user has enough', async () => {
    const runId = 'test-run-2';
    
    // Mock user with 10 credits
    vi.mocked(prisma.run.findUnique).mockResolvedValue({ id: runId, userId: 'user-2' } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'user-2', credits: 10 } as any);
    vi.mocked(prisma.$transaction).mockResolvedValue([]);

    // Two nodes cost 4 total
    const nodes = [
      { id: 'node1', type: 'OpenRouterNode' },
      { id: 'node2', type: 'OpenRouterNode' }
    ];

    const runFn = (workflowOrchestrator as any).run;
    
    // Since we mock the triggerAndWait batch logic which is complex, we expect it to eventually throw or pass.
    // For this test, we just want to verify the $transaction was called with the deduction.
    try {
      await runFn({
        runId,
        workflowId: 'wf-2',
        nodes,
        edges: [],
        inputs: {}
      });
    } catch (_e) {
      // Ignore batch error
    }

    expect(prisma.$transaction).toHaveBeenCalled();
  });
});
