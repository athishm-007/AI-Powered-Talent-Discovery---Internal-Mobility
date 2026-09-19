import { NextRequest } from 'next/server';
import { handleGenerateExecutiveSummary } from '@/backend/controllers/insights.controller';

export async function POST(req: NextRequest) {
  return handleGenerateExecutiveSummary(req);
}
