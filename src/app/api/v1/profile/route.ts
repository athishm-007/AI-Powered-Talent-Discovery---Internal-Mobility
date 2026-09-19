import { NextRequest } from 'next/server';
import { handleGetProfile, handleUpdateProfile } from '@/backend/controllers/profile.controller';

export async function GET(req: NextRequest) {
  return handleGetProfile(req);
}

export async function PATCH(req: NextRequest) {
  return handleUpdateProfile(req);
}
