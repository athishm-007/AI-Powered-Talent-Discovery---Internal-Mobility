import { NextRequest } from 'next/server';
import { handleGetAllRoles, handleCreateRole } from '@/backend/controllers/role.controller';

export async function GET(req: NextRequest) {
  return handleGetAllRoles(req);
}

export async function POST(req: NextRequest) {
  return handleCreateRole(req);
}
