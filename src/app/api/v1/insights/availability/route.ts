import { NextRequest } from 'next/server';
import { handleGetTalentAvailability } from '@/backend/controllers/insights.controller';

export async function GET(req: NextRequest) {
  return handleGetTalentAvailability(req);
}
