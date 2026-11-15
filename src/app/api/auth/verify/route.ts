import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { verifyJwt } from "@/lib/jwt";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 1. Check Bearer token in Authorization header
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7).trim();
      const verified = await verifyJwt(token);
      if (verified) {
        return NextResponse.json({
          valid: true,
          user: {
            id: verified.id,
            name: verified.name,
            email: verified.email,
            role: verified.role,
          },
        });
      }
    }

    // 2. Check NextAuth JWT session from cookies
    const session = await getServerAuthSession();
    if (session?.user) {
      return NextResponse.json({
        valid: true,
        user: {
          id: (session.user as any).id,
          name: session.user.name,
          email: session.user.email,
          role: (session.user as any).role,
        },
      });
    }

    return NextResponse.json(
      {
        valid: false,
        error: "Unauthorized: Invalid or missing JWT token.",
      },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        valid: false,
        error: error.message || "Failed to verify token",
      },
      { status: 401 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    if (body?.token) {
      const verified = await verifyJwt(body.token);
      if (verified) {
        return NextResponse.json({
          valid: true,
          user: {
            id: verified.id,
            name: verified.name,
            email: verified.email,
            role: verified.role,
          },
        });
      }
    }
  } catch {}

  // Fallback to GET handler logic (header or cookies)
  return GET(req);
}
