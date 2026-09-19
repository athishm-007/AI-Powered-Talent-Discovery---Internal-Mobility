'use client';

import React, { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { OutcomeType } from '@/models/feedback';

export interface OutcomesLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  defaultOutcomeType?: OutcomeType;
  targetTitle?: string;
  onSuccess?: () => void;
}

export const OutcomesLogModal: React.FC<OutcomesLogModalProps> = ({
  isOpen,
  onClose,
  targetId,
  defaultOutcomeType = 'applied',
  targetTitle = 'Role Opportunity',
  onSuccess,
}) => {
  const [outcomeType, setOutcomeType] = useState<OutcomeType>(defaultOutcomeType);
  const [stage, setStage] = useState('interest');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/v1/outcomes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outcome_type: outcomeType,
          target_id: targetId,
          details: { stage, notes },
        }),
      });

      if (res.ok) {
        showToast(`Career outcome logged for ${targetTitle}. HR admin updated.`);
        onSuccess?.();
        onClose();
      } else {
        showToast('Failed to log outcome.', 'error');
      }
    } catch {
      showToast('Network error occurred.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={`Log Career Outcome for ${targetTitle}`}>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-medium text-slate-300 mb-1">Outcome Type</label>
          <select
            value={outcomeType}
            onChange={(e) => setOutcomeType(e.target.value as OutcomeType)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="applied">Express Interest / Applied</option>
            <option value="promoted">Promoted to Role</option>
            <option value="moved">Internal Mobility Move</option>
            <option value="completed_course">Completed Course / Certification</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-slate-300 mb-1">Stage / Details</label>
          <input
            type="text"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            placeholder="e.g. interest, interviewed, completed"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-300 mb-1">Additional Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Optional details or achievements..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
            Log Outcome
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
