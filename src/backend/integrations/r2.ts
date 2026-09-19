import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const r2AccountId = process.env.R2_ACCOUNT_ID;
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const r2BucketName = process.env.R2_BUCKET_NAME || 'talentlens-private-documents';

const isR2Configured = Boolean(r2AccountId && r2AccessKeyId && r2SecretAccessKey);

const r2Client = isR2Configured
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: r2AccessKeyId!,
        secretAccessKey: r2SecretAccessKey!,
      },
    })
  : null;

export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  maxSizeBytes: number = 10 * 1024 * 1024 // 10MB
): Promise<{ presignedUrl: string; key: string }> {
  const allowedMimeTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png'];
  if (!allowedMimeTypes.includes(contentType)) {
    throw new Error(`Unsupported MIME type: ${contentType}. Allowed: PDF, DOCX, PNG.`);
  }

  if (r2Client) {
    const command = new PutObjectCommand({
      Bucket: r2BucketName,
      Key: key,
      ContentType: contentType,
      ContentLength: maxSizeBytes,
    });
    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 });
    return { presignedUrl, key };
  }

  // Fallback mock presigned URL for development
  return {
    presignedUrl: `http://localhost:3000/api/v1/documents/mock-upload?key=${encodeURIComponent(key)}`,
    key,
  };
}

export async function verifyR2Object(key: string): Promise<boolean> {
  if (!r2Client) return true; // Mock mode
  try {
    const command = new HeadObjectCommand({ Bucket: r2BucketName, Key: key });
    await r2Client.send(command);
    return true;
  } catch {
    return false;
  }
}
