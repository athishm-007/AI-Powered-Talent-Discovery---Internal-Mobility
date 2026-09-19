import { MIN_FEEDBACK_SAMPLES, SMOOTHING_FACTOR_M, SCALING_FACTOR_K } from '../../lib/constants';

export interface UserSignal {
  userId: string;
  helpfulCount: number;
  unhelpfulCount: number;
}

export function calculateFeedbackModifierFromSignals(signals: UserSignal[]): number {
  let distinctPosUsers = 0;
  let distinctNegUsers = 0;

  for (const sig of signals) {
    if (sig.helpfulCount > sig.unhelpfulCount) {
      distinctPosUsers++;
    } else if (sig.unhelpfulCount > sig.helpfulCount) {
      distinctNegUsers++;
    } // Ties (helpfulCount === unhelpfulCount) yield net 0 signal
  }

  const totalDistinctUsers = distinctPosUsers + distinctNegUsers;
  if (totalDistinctUsers < MIN_FEEDBACK_SAMPLES) {
    return 1.0;
  }

  const rawModifier = 1.0 + SCALING_FACTOR_K * ((distinctPosUsers - distinctNegUsers) / (totalDistinctUsers + SMOOTHING_FACTOR_M));
  return Math.min(1.5, Math.max(0.5, rawModifier)); // Clamped [0.5, 1.5]
}

export function calculateDistinctUserFeedbackNetting(rawVotes: { userId: string; isHelpful: boolean }[]): {
  totalDistinctUsers: number;
  positiveCount: number;
  negativeCount: number;
  netPositivePercentage: number;
} {
  const userLatestVoteMap = new Map<string, boolean>();
  for (const vote of rawVotes) {
    userLatestVoteMap.set(vote.userId, vote.isHelpful);
  }

  let positiveCount = 0;
  let negativeCount = 0;

  userLatestVoteMap.forEach((isHelpful) => {
    if (isHelpful) positiveCount++;
    else negativeCount++;
  });

  const totalDistinctUsers = userLatestVoteMap.size;
  const netPositivePercentage = totalDistinctUsers > 0
    ? Math.round((positiveCount / totalDistinctUsers) * 1000) / 10
    : 0;

  return {
    totalDistinctUsers,
    positiveCount,
    negativeCount,
    netPositivePercentage,
  };
}

