import { NextRequest } from 'next/server';
import { handleDemoLogin } from '@/backend/controllers/auth.controller';

export async function POST(req: NextRequest) {
  return handleDemoLogin(req);
}
