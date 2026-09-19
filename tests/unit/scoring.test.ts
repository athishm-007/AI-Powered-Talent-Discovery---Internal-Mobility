import { describe, it, expect } from 'vitest';
import { calculateHybridMatchScore } from '../../src/backend/services/matching.service';

describe('Module 2: Hybrid Role Matching Algorithm', () => {
  it('should correctly compute weighted hybrid score with w1=0.35, w2=0.30, w3=0.20, w4=0.15', () => {
    const score = calculateHybridMatchScore({
      coverageScore: 90,     // 90 * 0.35 = 31.50
      vectorSimilarity: 80,  // 80 * 0.30 = 24.00
      transferableScore: 85, // 85 * 0.20 = 17.00
      experienceScore: 95,   // 95 * 0.15 = 14.25
    });

    // 31.50 + 24.00 + 17.00 + 14.25 = 86.75
    expect(score).toBe(86.75);
  });

  it('should cap scores between 0 and 100', () => {
    const maxScore = calculateHybridMatchScore({
      coverageScore: 100,
      vectorSimilarity: 100,
      transferableScore: 100,
      experienceScore: 100,
    });
    expect(maxScore).toBe(100);

    const minScore = calculateHybridMatchScore({
      coverageScore: 0,
      vectorSimilarity: 0,
      transferableScore: 0,
      experienceScore: 0,
    });
    expect(minScore).toBe(0);
  });
});
