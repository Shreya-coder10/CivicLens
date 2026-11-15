"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface UploadedImage {
  s3Key: string;
  url: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxFiles?: number;
}

export function ImageUploader({
  images,
  onChange,
  maxFiles = 4,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxFiles) {
      toast.error(`You can upload a maximum of ${maxFiles} photographs per report.`);
      return;
    }

    setUploading(true);
    const newUploads: UploadedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate size (<10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds the 10MB limit.`);
        continue;
      }

      // Validate MIME type
      const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!allowed.includes(file.type)) {
        toast.error(`File "${file.name}" is not a supported format (JPG, PNG, WebP).`);
        continue;
      }

      try {
        // Step 1: Request S3 Presigned URL from Next.js server endpoint
        const res = await fetch("/api/uploads/presigned", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            fileSize: file.size,
          }),
        });

        const data = await res.json();

        if (res.ok && data.uploadUrl) {
          // Step 2: Upload directly from browser to Amazon S3 using the authorized presigned URL
          const s3Res = await fetch(data.uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": file.type,
            },
            body: file,
          });

          if (!s3Res.ok) {
            throw new Error(`S3 direct upload failed with status ${s3Res.status}`);
          }

          newUploads.push({
            s3Key: data.s3Key,
            url: data.publicUrl,
            originalFilename: file.name,
            mimeType: file.type,
            fileSize: file.size,
          });
          toast.success(`Uploaded "${file.name}" to Amazon S3`);
        } else {
          // If S3 is not yet configured with real AWS credentials in local development,
          // create a local ObjectURL preview so local demo workflows remain smooth.
          console.warn("S3 not configured or presigned URL unavailable:", data.error);
          const localPreviewUrl = URL.createObjectURL(file);
          newUploads.push({
            s3Key: `local-demo/${Date.now()}-${file.name}`,
            url: localPreviewUrl,
            originalFilename: file.name,
            mimeType: file.type,
            fileSize: file.size,
          });
          toast.info(`Local preview attached for "${file.name}" (S3 offline mode)`);
        }
      } catch (err: any) {
        console.error("Upload error for file:", file.name, err);
        toast.error(`Failed to upload ${file.name}: ${err.message}`);
      }
    }

    onChange([...images, ...newUploads]);
    setUploading(false);
    // Reset file input
    e.target.value = "";
  };

  const handleRemove = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Upload Zone */}
      <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/60 p-6 text-center hover:bg-slate-50 transition-colors">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={uploading || images.length >= maxFiles}
          onChange={handleFileSelect}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />

        <div className="flex flex-col items-center space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-800">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <UploadCloud className="h-5 w-5" />
            )}
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-slate-800">
              {uploading
                ? "Authorizing & uploading to Amazon S3..."
                : "Click or drag photos to attach"}
            </p>
            <p className="text-xs text-slate-500">
              Supports JPG, PNG, and WebP (up to 10MB each, max {maxFiles} images)
            </p>
          </div>
        </div>
      </div>

      {/* Previews Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="group relative h-28 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm"
            >
              <img
                src={img.url}
                alt={img.originalFilename}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="rounded-full bg-rose-600 p-1.5 text-white hover:bg-rose-700 shadow"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-black/60 px-1.5 py-0.5 text-[10px] text-white truncate">
                {img.originalFilename}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
