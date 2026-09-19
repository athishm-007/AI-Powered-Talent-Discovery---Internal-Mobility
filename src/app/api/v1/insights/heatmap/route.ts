import { NextRequest } from 'next/server';
import { handleGetSkillsHeatmap } from '@/backend/controllers/insights.controller';

export async function GET(req: NextRequest) {
  return handleGetSkillsHeatmap(req);
}
