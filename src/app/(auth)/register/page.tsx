"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validations/auth.schema";
import { registerUser } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShieldAlert, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    try {
      const res = await registerUser(data);
      if (res.success) {
        toast.success("Account created successfully! Logging you in...");
        // Auto sign in
        const signInRes = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInRes?.ok) {
          router.push("/dashboard");
          router.refresh();
        } else {
          router.push("/login");
        }
      } else {
        toast.error(res.error || "Registration failed");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#172554] text-white">
              <ShieldAlert className="h-6 w-6 text-teal-400" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#172554]">
              Civic<span className="text-[#0D9488]">Lens</span>
            </span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Create your citizen account
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Join your neighbors to report infrastructure issues and track municipal fixes.
          </p>
        </div>

        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-base text-slate-900">
              Registration Form
            </CardTitle>
            <CardDescription className="text-xs">
              All citizen passwords are encrypted using industry-standard bcrypt hashing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Aarav Sharma"
                  {...register("name")}
                  className={errors.name ? "border-rose-400" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-rose-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className={errors.email ? "border-rose-400" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-rose-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 chars with uppercase, lowercase & number"
                  {...register("password")}
                  className={errors.password ? "border-rose-400" : ""}
                />
                {errors.password && (
                  <p className="text-xs text-rose-500">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#172554] hover:bg-[#1e3a8a] text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-teal-400" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Citizen Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="pt-0 flex justify-center text-xs text-slate-500">
            Already registered?{" "}
            <Link
              href="/login"
              className="ml-1 font-semibold text-teal-700 hover:underline"
            >
              Sign in here
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
