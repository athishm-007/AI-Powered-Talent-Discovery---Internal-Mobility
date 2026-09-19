import { NextRequest } from 'next/server';
import { handleGetRoadmap, handleGenerateRoadmap } from '@/backend/controllers/roadmap.controller';

export async function GET(req: NextRequest) {
  return handleGetRoadmap(req);
}

export async function POST(req: NextRequest) {
  return handleGenerateRoadmap(req);
}
