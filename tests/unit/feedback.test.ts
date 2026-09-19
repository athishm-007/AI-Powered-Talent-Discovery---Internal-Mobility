import { describe, it, expect } from 'vitest';
import { calculateDistinctUserFeedbackNetting } from '../../src/backend/services/feedback.math';

describe('Module 4: Feedback & Outcomes Distinct-User Netting', () => {
  it('should correctly compute net positive percentage per target based on distinct user latest vote', () => {
    const rawVotes = [
      { userId: 'u1', isHelpful: true },
      { userId: 'u1', isHelpful: false }, // u1 updated to false
      { userId: 'u2', isHelpful: true },
      { userId: 'u3', isHelpful: true },
      { userId: 'u4', isHelpful: true },
    ];

    const result = calculateDistinctUserFeedbackNetting(rawVotes);

    // Distinct users: 4 (u1=false, u2=true, u3=true, u4=true) -> 3 positive / 4 total = 75%
    expect(result.totalDistinctUsers).toBe(4);
    expect(result.positiveCount).toBe(3);
    expect(result.negativeCount).toBe(1);
    expect(result.netPositivePercentage).toBe(75.0);
  });
});
