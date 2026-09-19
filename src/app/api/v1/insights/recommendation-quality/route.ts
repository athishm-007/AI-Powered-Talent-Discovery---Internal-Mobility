import { NextRequest } from 'next/server';
import { handleGetRecommendationQuality } from '@/backend/controllers/insights.controller';

export async function GET(req: NextRequest) {
  return handleGetRecommendationQuality(req);
}
