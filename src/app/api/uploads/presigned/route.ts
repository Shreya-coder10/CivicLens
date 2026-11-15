import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { createPresignedUploadUrl, isS3Configured } from "@/lib/aws/s3";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to upload files." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { filename, contentType, fileSize } = body;

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "Filename and contentType are required." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(contentType.toLowerCase())) {
      return NextResponse.json(
        { error: "Unsupported file format. Please upload JPG, PNG, or WebP." },
        { status: 400 }
      );
    }

    if (fileSize && fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds maximum permitted limit (10MB)." },
        { status: 400 }
      );
    }

    if (!isS3Configured()) {
      // In local mode without active AWS S3 bucket, provide descriptive notice
      return NextResponse.json(
        {
          error:
            "Amazon S3 is not configured. Please supply S3_BUCKET_NAME and AWS credentials in environment variables.",
          isConfigured: false,
        },
        { status: 503 }
      );
    }

    const userId = (session.user as any).id || "unknown";
    const presigned = await createPresignedUploadUrl(
      filename,
      contentType,
      userId
    );

    return NextResponse.json(presigned);
  } catch (error: any) {
    console.error("Presigned URL error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate presigned upload URL." },
      { status: 500 }
    );
  }
}
