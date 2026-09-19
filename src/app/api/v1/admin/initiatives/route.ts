import { NextRequest } from 'next/server';
import { handleGetAllInitiatives, handleCreateInitiative } from '@/backend/controllers/initiative.controller';

export async function GET(req: NextRequest) {
  return handleGetAllInitiatives(req);
}

export async function POST(req: NextRequest) {
  return handleCreateInitiative(req);
}
