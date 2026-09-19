import { NextRequest } from 'next/server';
import { handleGetGapAnalysis } from '@/backend/controllers/gap.controller';

export async function GET(req: NextRequest) {
  return handleGetGapAnalysis(req);
}
