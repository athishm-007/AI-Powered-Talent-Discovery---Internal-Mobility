'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

export interface FeedbackButtonsProps {
  itemType: 'match' | 'gap' | 'resource' | 'roadmap';
  itemId: string;
}

export const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({ itemType, itemId }) => {
  const [submitted, setSubmitted] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [pendingHelpful, setPendingHelpful] = useState(true);
  const [reason, setReason] = useState('');
  const { showToast } = useToast();

  const handleFeedbackClick = (isHelpful: boolean) => {
    setPendingHelpful(isHelpful);
    setShowReason(true);
  };

  const submitFeedbackPayload = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_type: itemType,
          item_id: itemId,
          is_helpful: pendingHelpful,
          reason,
        }),
      });

      if (res.ok) {
        setSubmitted(pendingHelpful);
        setShowReason(false);
        showToast('Feedback submitted! Recommendation algorithms re-weighted.');
      } else {
        showToast('Failed to record feedback.', 'error');
      }
    } catch {
      showToast('Network error recorded.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted !== null) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
        <Check className="w-3.5 h-3.5" />
        <span>Feedback recorded</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Helpful recommendation?</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFeedbackClick(true)}
          className="p-1.5 h-auto text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"
          title="Mark as helpful"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFeedbackClick(false)}
          className="p-1.5 h-auto text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
          title="Mark as not helpful"
        >
          <ThumbsDown className="w-3.5 h-3.5" />
        </Button>
      </div>

      {showReason && (
        <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs">
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Optional reason for feedback..."
            className="bg-slate-950 border border-slate-800 px-2 py-1 rounded text-slate-200 flex-1 w-full focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          <Button variant="primary" size="sm" onClick={submitFeedbackPayload} isLoading={isSubmitting} className="py-1 text-xs">
            Submit
          </Button>
        </div>
      )}
    </div>
  );
};
