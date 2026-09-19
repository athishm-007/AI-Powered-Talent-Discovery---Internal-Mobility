import { z } from 'zod';

export const UploadDocumentResponseSchema = z.object({
  document_id: z.string().uuid(),
  presigned_url: z.string().url(),
  r2_object_key: z.string(),
  expires_in_seconds: z.number().int(),
});
export type UploadDocumentResponse = z.infer<typeof UploadDocumentResponseSchema>;

export const ConfirmDocumentUploadSchema = z.object({
  document_id: z.string().uuid(),
  file_name: z.string(),
  mime_type: z.string(),
  r2_object_key: z.string(),
});
export type ConfirmDocumentUploadInput = z.infer<typeof ConfirmDocumentUploadSchema>;

export const DocumentMetadataSchema = z.object({
  id: z.string().uuid(),
  profile_id: z.string().uuid(),
  file_name: z.string(),
  mime_type: z.string(),
  parsed_at: z.string().nullable().optional(),
});
export type DocumentMetadata = z.infer<typeof DocumentMetadataSchema>;
