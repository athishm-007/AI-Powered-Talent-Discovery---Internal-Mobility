import { NextRequest } from 'next/server';
import { handleAddLearning } from '@/backend/controllers/profile.controller';

export async function POST(req: NextRequest) {
  return handleAddLearning(req);
}
