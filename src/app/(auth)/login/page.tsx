"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShieldAlert, Loader2, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.success("Signed in successfully!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (role: "citizen" | "admin") => {
    if (role === "admin") {
      setValue("email", "admin@civiclens.gov");
      setValue("password", "Admin@CivicLens2026!");
      toast.info("Filled initial administrator demonstration credentials");
    } else {
      setValue("email", "aarav.sharma@example.com");
      setValue("password", "Citizen@123!");
      toast.info("Filled sample citizen demonstration credentials");
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
            Sign in to your account
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Access citizen reporting history, tracking updates, or administrative triage.
          </p>
        </div>

        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-base text-slate-900">
              Account Credentials
            </CardTitle>
            <CardDescription className="text-xs">
              Enter your registered email and password to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
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
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Demo Quick-Fill Bar */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 text-center">
                Demonstration One-Click Credentials
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoFill("citizen")}
                  className="text-xs border-slate-200 hover:bg-slate-50"
                >
                  <UserCheck className="mr-1.5 h-3.5 w-3.5 text-teal-600" />
                  Fill Citizen Demo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoFill("admin")}
                  className="text-xs border-indigo-200 text-indigo-900 bg-indigo-50/40 hover:bg-indigo-100"
                >
                  <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-indigo-600" />
                  Fill Admin Demo
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0 flex justify-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="ml-1 font-semibold text-teal-700 hover:underline"
            >
              Register here
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
