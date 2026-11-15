import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION || "us-east-1";
const bucketName = process.env.S3_BUCKET_NAME || "civiclens-complaint-attachments";

// Initialize S3 client using environment credentials or AWS IAM Role credential chain
export function getS3Client(): S3Client | null {
  try {
    // If running in AWS Amplify with IAM Role attached, default credential provider will find it
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      return new S3Client({
        region,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });
    }

    // Default credential chain (IAM role, ECS container metadata, or AWS SSO)
    return new S3Client({ region });
  } catch (error) {
    console.error("Failed to initialize AWS S3 client:", error);
    return null;
  }
}

export function isS3Configured(): boolean {
  return Boolean(
    process.env.S3_BUCKET_NAME &&
      (process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION) &&
      (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_EXECUTION_ENV || process.env.AWS_ROLE_ARN)
  );
}

export interface PresignedUrlResult {
  uploadUrl: string;
  s3Key: string;
  publicUrl: string;
}

export async function createPresignedUploadUrl(
  filename: string,
  contentType: string,
  userId: string
): Promise<PresignedUrlResult> {
  const s3 = getS3Client();
  if (!s3) {
    throw new Error("AWS S3 client could not be initialized");
  }

  // Generate unique object key: complaints/{userId}/{timestamp}-{random}-{filename}
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const randomSuffix = Math.random().toString(36).substring(2, 9);
  const s3Key = `complaints/${userId}/${timestamp}-${randomSuffix}-${sanitizedFilename}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
    ContentType: contentType,
  });

  // URL valid for 10 minutes
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 600 });
  const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`;

  return {
    uploadUrl,
    s3Key,
    publicUrl,
  };
}
