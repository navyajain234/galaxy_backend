import { describe, it, expect, vi, beforeEach } from 'vitest';
import { openRouterTask } from './subtasks';
import prisma from '@/lib/prisma';

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  default: {
    nodeExecution: {
      update: vi.fn(),
    }
  },
}));

vi.mock('@trigger.dev/sdk/v3', () => ({
  task: vi.fn((opts) => opts),
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

// Mock fetch for OpenRouter API
global.fetch = vi.fn();

describe('Subtasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('openRouterTask succeeds and updates nodeExecution', async () => {
    const dbId = 'ne-1';
    
    // Mock successful fetch response
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Mocked AI Response' } }]
      })
    } as any);

    const runFn = (openRouterTask as any).run;
    
    const result = await runFn({
      dbId,
      model: 'openrouter/auto',
      prompt: 'Hello'
    });

    expect(result.response).toBe('Mocked AI Response');
    expect(prisma.nodeExecution.update).toHaveBeenCalledWith({
      where: { id: dbId },
      data: expect.objectContaining({ status: 'SUCCESS' })
    });
  });

  it('openRouterTask fails gracefully and updates nodeExecution', async () => {
    const dbId = 'ne-2';
    
    // Mock failed fetch response
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request'
    } as any);

    const runFn = (openRouterTask as any).run;
    
    await expect(runFn({
      dbId,
      model: 'openrouter/auto',
      prompt: 'Hello'
    })).rejects.toThrow('OpenRouter failed: OpenRouter API error: 400 Bad Request');

    expect(prisma.nodeExecution.update).toHaveBeenCalledWith({
      where: { id: dbId },
      data: expect.objectContaining({ status: 'FAILED' })
    });
  });
});
