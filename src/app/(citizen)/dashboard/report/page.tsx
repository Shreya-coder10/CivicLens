import { ComplaintForm } from "@/components/complaints/complaint-form";

export const metadata = {
  title: "Report a Civic Issue – CivicLens",
  description: "File an official municipal grievance with Amazon Bedrock GenAI assistance",
};

export default function ReportIssuePage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Report a Community Civic Issue
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Complete the form below or use our GenAI Assistant to transform informal notes into a structured municipal complaint.
        </p>
      </div>

      <ComplaintForm />
    </div>
  );
}
