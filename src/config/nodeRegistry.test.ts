import { describe, it, expect } from 'vitest';
import { NODE_REGISTRY } from './nodeRegistry';

describe('Node Registry', () => {
  it('contains all required node definitions', () => {
    const types = NODE_REGISTRY.map(n => n.type);
    
    // Check for required nodes based on documentation
    expect(types).toContain('GptImageNode');
    expect(types).toContain('KlingNode');
    expect(types).toContain('OpenRouterNode');
    expect(types).toContain('MergeVideoNode');
    expect(types).toContain('MergeAVNode');
    expect(types).toContain('ExtractAudioNode');
  });

  it('each node has required properties', () => {
    NODE_REGISTRY.forEach(node => {
      expect(node.type).toBeDefined();
      expect(node.name).toBeDefined();
      expect(node.baseCost).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(node.inputs)).toBe(true);
      expect(Array.isArray(node.outputs)).toBe(true);
    });
  });
  
  it('MergeVideoNode has correct inputs', () => {
    const mergeNode = NODE_REGISTRY.find(n => n.type === 'MergeVideoNode');
    expect(mergeNode).toBeDefined();
    
    const v1 = mergeNode!.inputs.find(i => i.name === 'video1');
    const v2 = mergeNode!.inputs.find(i => i.name === 'video2');
    expect(v1).toBeDefined();
    expect(v2).toBeDefined();
  });
});
