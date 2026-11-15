import { getServerAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, ShieldCheck, Calendar, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await getServerAuthSession();
  const userId = (session?.user as any)?.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: { select: { complaints: true } },
    },
  });

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Citizen Profile &amp; Verification
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Manage your verified citizen credentials and reporting history.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">
              Account Identification
            </CardTitle>
            <CardDescription className="text-xs">
              Personal credentials registered on CivicLens
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#172554] text-white font-bold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-slate-900">{user.name}</p>
                <Badge variant={user.role === "ADMIN" ? "default" : "teal"}>
                  {user.role === "ADMIN" ? "Administrator" : "Resident Citizen"}
                </Badge>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center text-slate-600 gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center text-slate-600 gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>Member since {formatDate(user.createdAt)}</span>
              </div>
              <div className="flex items-center text-slate-600 gap-2">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
                <span>Bcrypt Hash Password Encrypted</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">
              Civic Participation Metric
            </CardTitle>
            <CardDescription className="text-xs">
              Community contributions and municipal reporting engagement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-teal-200 bg-teal-50/40 p-4 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                Total Civic Reports Filed
              </span>
              <p className="text-4xl font-extrabold text-[#172554] mt-1">
                {user._count.complaints}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Every report filed directly benefits local neighborhood safety and cleanliness.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
