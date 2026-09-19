import { NextRequest } from 'next/server';
import { handleGetWorkforceSupplyDemand } from '@/backend/controllers/insights.controller';

export async function GET(req: NextRequest) {
  return handleGetWorkforceSupplyDemand(req);
}
