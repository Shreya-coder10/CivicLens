"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  complaintFormSchema,
  ComplaintFormInput,
} from "@/lib/validations/complaint.schema";
import { submitComplaintAction } from "@/actions/complaint.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AIComplaintAssistant } from "@/components/ai/ai-complaint-assistant";
import { ImageUploader, UploadedImage } from "@/components/complaints/image-uploader";
import { LocationPicker } from "@/components/maps/location-picker";
import { AIEnhanceResult } from "@/types";
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertTriangle, Send } from "lucide-react";
import Link from "next/link";

export function ComplaintForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [newComplaintId, setNewComplaintId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ComplaintFormInput>({
    resolver: zodResolver(complaintFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "ROADS_AND_POTHOLES",
      severity: "MEDIUM",
      address: "",
      latitude: null,
      longitude: null,
      aiSummary: null,
      images: [],
    },
  });

  const selectedCategory = watch("category");
  const selectedSeverity = watch("severity");
  const attachedImages = watch("images") || [];
  const coords = {
    lat: watch("latitude") || 12.9716,
    lng: watch("longitude") || 77.5946,
  };

  const handleApplyAISuggestion = (suggestion: AIEnhanceResult) => {
    setValue("title", suggestion.title, { shouldValidate: true });
    setValue("description", suggestion.description, { shouldValidate: true });
    setValue("category", suggestion.suggestedCategory, { shouldValidate: true });
    setValue("severity", suggestion.suggestedSeverity, { shouldValidate: true });
    setValue("aiSummary", suggestion.shortSummary);
  };

  const onSubmit = async (data: ComplaintFormInput) => {
    setSubmitting(true);
    try {
      const res = await submitComplaintAction(data);
      if (res.success && res.referenceId) {
        setSubmittedRef(res.referenceId);
        setNewComplaintId(res.id || null);
        toast.success(`Complaint filed successfully! Reference: ${res.referenceId}`);
      } else {
        toast.error(res.error || "Failed to submit complaint");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedRef) {
    return (
      <Card className="border-teal-200 bg-teal-50/30 text-center py-12 px-6">
        <CardContent className="space-y-4 max-w-md mx-auto">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-[#0D9488]">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Complaint Submitted Successfully!
          </h2>
          <p className="text-sm text-slate-600">
            Your civic report has been securely registered in the municipal database and routed for administrative review.
          </p>
          <div className="rounded-lg border border-teal-200 bg-white p-4 shadow-sm">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
              Complaint Reference Number
            </span>
            <p className="text-2xl font-mono font-bold text-[#172554] mt-1">
              {submittedRef}
            </p>
            <span className="text-[11px] text-slate-400">
              Save this reference ID to track real-time resolution updates.
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            {newComplaintId && (
              <Link href={`/issues/${newComplaintId}`}>
                <Button className="w-full sm:w-auto bg-[#172554] hover:bg-[#1e3a8a] text-white">
                  Track Resolution Progress
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              onClick={() => {
                setSubmittedRef(null);
                router.refresh();
              }}
              className="w-full sm:w-auto"
            >
              File Another Report
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* 1. GenAI Assistant Panel */}
      <AIComplaintAssistant onApplySuggestion={handleApplyAISuggestion} />

      {/* 2. Core Details Card */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">
            Complaint Specifications
          </CardTitle>
          <CardDescription>
            Provide accurate details to expedite municipal inspection and field crew dispatch.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-slate-800">
              Issue Title <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Deep Pothole Cluster on Main Road"
              {...register("title")}
              className={errors.title ? "border-rose-400 focus-visible:ring-rose-500" : ""}
            />
            {errors.title && (
              <p className="text-xs text-rose-500">{errors.title.message}</p>
            )}
          </div>

          {/* Category & Severity Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Category */}
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-slate-800">
                Issue Category <span className="text-rose-500">*</span>
              </Label>
              <select
                id="category"
                {...register("category")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="ROADS_AND_POTHOLES">Roads &amp; Potholes</option>
                <option value="GARBAGE_AND_WASTE">Garbage &amp; Waste Management</option>
                <option value="WATER_SUPPLY_AND_LEAKAGE">Water Supply &amp; Leakage</option>
                <option value="STREETLIGHTS_AND_ELECTRICITY">Streetlights &amp; Electricity</option>
                <option value="DRAINAGE_AND_SANITATION">Drainage &amp; Sanitation</option>
                <option value="PUBLIC_INFRASTRUCTURE">Public Infrastructure</option>
                <option value="OTHER">Other Community Issue</option>
              </select>
            </div>

            {/* Severity */}
            <div className="space-y-1.5">
              <Label htmlFor="severity" className="text-slate-800">
                Severity Level <span className="text-rose-500">*</span>
              </Label>
              <select
                id="severity"
                {...register("severity")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="LOW">Low (Minor inconvenience)</option>
                <option value="MEDIUM">Medium (General disruption)</option>
                <option value="HIGH">High (Active hazard / Traffic risk)</option>
                <option value="CRITICAL">Critical (Immediate life safety / Public emergency)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-slate-800">
              Detailed Description <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="description"
              rows={5}
              placeholder="Describe the problem, dimensions, duration, and safety hazards in detail..."
              {...register("description")}
              className={errors.description ? "border-rose-400 focus-visible:ring-rose-500" : ""}
            />
            {errors.description && (
              <p className="text-xs text-rose-500">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 3. Location Card with Interactive Map */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">
            Geographic Location &amp; Landmark
          </CardTitle>
          <CardDescription>
            Specify the street address and click on the map to pin the exact coordinates for the field crew.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-slate-800">
              Address / Landmark <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="address"
              placeholder="e.g., 4th Cross, Opposite BDA Complex, Sector 2"
              {...register("address")}
              className={errors.address ? "border-rose-400 focus-visible:ring-rose-500" : ""}
            />
            {errors.address && (
              <p className="text-xs text-rose-500">{errors.address.message}</p>
            )}
          </div>

          <div>
            <Label className="text-slate-800 block mb-1.5">
              Pin Location on Community Map (Optional)
            </Label>
            <LocationPicker
              value={watch("latitude") && watch("longitude") ? { lat: watch("latitude")!, lng: watch("longitude")! } : null}
              onChange={(c) => {
                setValue("latitude", c.lat);
                setValue("longitude", c.lng);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. Photographic Evidence (Amazon S3) */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">
            Photographic Evidence
          </CardTitle>
          <CardDescription>
            Photographs are directly uploaded to secure Amazon S3 storage with presigned authorizations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUploader
            images={attachedImages as UploadedImage[]}
            onChange={(imgs) => setValue("images", imgs)}
            maxFiles={4}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="bg-[#172554] hover:bg-[#1e3a8a] text-white min-w-[160px]"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-teal-400" />
              Submitting Report...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4 text-teal-400" />
              File Official Complaint
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
