import { NextRequest } from 'next/server';
import { handleSubmitFeedback } from '@/backend/controllers/feedback.controller';

export async function POST(req: NextRequest) {
  return handleSubmitFeedback(req);
}
