import { NextRequest } from 'next/server';
import { handleLogin, handleRegister } from '@/backend/controllers/auth.controller';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  if (action === 'register') {
    return handleRegister(req);
  }

  return handleLogin(req);
}
