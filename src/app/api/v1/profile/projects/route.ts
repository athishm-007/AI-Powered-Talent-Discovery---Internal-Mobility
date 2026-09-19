import { NextRequest } from 'next/server';
import { handleAddProject } from '@/backend/controllers/profile.controller';

export async function POST(req: NextRequest) {
  return handleAddProject(req);
}
