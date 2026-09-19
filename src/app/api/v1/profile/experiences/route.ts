import { NextRequest } from 'next/server';
import { handleAddExperience } from '@/backend/controllers/profile.controller';

export async function POST(req: NextRequest) {
  return handleAddExperience(req);
}
