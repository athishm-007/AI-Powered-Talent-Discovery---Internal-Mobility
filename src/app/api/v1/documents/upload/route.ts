import { NextRequest } from 'next/server';
import { handleRequestUploadUrl } from '@/backend/controllers/document.controller';

export async function POST(req: NextRequest) {
  return handleRequestUploadUrl(req);
}
