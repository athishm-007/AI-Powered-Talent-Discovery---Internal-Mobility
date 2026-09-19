import { NextRequest } from 'next/server';
import { handleAssistantChat, handleGetAssistantSession } from '@/backend/controllers/assistant.controller';

export async function GET(req: NextRequest) {
  return handleGetAssistantSession(req);
}

export async function POST(req: NextRequest) {
  return handleAssistantChat(req);
}
