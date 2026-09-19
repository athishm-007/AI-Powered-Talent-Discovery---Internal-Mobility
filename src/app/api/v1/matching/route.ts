import { NextRequest } from 'next/server';
import { handleGetMatches } from '@/backend/controllers/matching.controller';

export async function GET(req: NextRequest) {
  return handleGetMatches(req);
}
