import { SupabaseClient } from '@supabase/supabase-js';
import { createDocumentRepository } from '../repositories/document.repository';
import { generatePresignedUploadUrl, verifyR2Object } from '../integrations/r2';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export function createDocumentService(userClient: SupabaseClient, adminClient: SupabaseClient) {
  const userDocRepo = createDocumentRepository(userClient);
  const adminDocRepo = createDocumentRepository(adminClient);

  return {
    async getPresignedUploadUrl(userId: string, fileName: string, contentType: string) {
      const documentId = crypto.randomUUID();
      const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const r2Key = `${userId}/${documentId}/${sanitized}`;

      const { presignedUrl } = await generatePresignedUploadUrl(r2Key, contentType);
      return { documentId, presignedUrl, r2ObjectKey: r2Key };
    },

    async confirmUpload(userId: string, documentId: string, fileName: string, mimeType: string, r2ObjectKey: string) {
      // Verify prefix matches caller's userId
      if (!r2ObjectKey.startsWith(`${userId}/${documentId}/`)) {
        throw new Error('R2 Object key prefix mismatch. Access denied.');
      }

      const exists = await verifyR2Object(r2ObjectKey);
      if (!exists) {
        throw new Error('Uploaded document object verification failed.');
      }

      return userDocRepo.confirmDocument({
        id: documentId,
        profile_id: userId,
        file_name: fileName,
        mime_type: mimeType,
        r2_object_key: r2ObjectKey,
      });
    },

    async parseDocumentText(documentId: string, fileBuffer: Buffer, mimeType: string) {
      let extractedText = '';

      if (mimeType === 'application/pdf') {
        const parsed = await pdfParse(fileBuffer);
        extractedText = parsed.text;
      } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const parsed = await mammoth.extractRawText({ buffer: fileBuffer });
        extractedText = parsed.value;
      } else {
        extractedText = fileBuffer.toString('utf-8');
      }

      return adminDocRepo.updateExtractedText(documentId, extractedText);
    },
  };
}
