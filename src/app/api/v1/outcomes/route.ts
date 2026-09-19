import { NextRequest } from 'next/server';
import { handleLogOutcome } from '@/backend/controllers/outcomes.controller';

export async function POST(req: NextRequest) {
  return handleLogOutcome(req);
}
