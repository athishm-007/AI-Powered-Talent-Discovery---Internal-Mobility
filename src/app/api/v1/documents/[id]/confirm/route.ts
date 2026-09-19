import { NextRequest } from 'next/server';
import { handleConfirmUpload } from '@/backend/controllers/document.controller';

export async function POST(req: NextRequest) {
  return handleConfirmUpload(req);
}
