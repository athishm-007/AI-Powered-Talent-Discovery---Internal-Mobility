import { NextRequest } from 'next/server';
import { handleUpdateRoadmapItemStatus } from '@/backend/controllers/roadmap.controller';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return handleUpdateRoadmapItemStatus(req, params.id);
}
