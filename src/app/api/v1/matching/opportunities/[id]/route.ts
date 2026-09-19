import { NextRequest } from 'next/server';
import { handleGetMatchDetail } from '@/backend/controllers/matching.controller';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return handleGetMatchDetail(req, params.id);
}
