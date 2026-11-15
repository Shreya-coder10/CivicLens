import { SignJWT, jwtVerify } from "jose";
import { UserRole } from "@/types";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "civiclens-super-secure-production-secret-12345";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface TokenPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  [key: string]: any;
}

/**
 * Sign a standalone JWT token with HMAC-SHA256
 */
export async function signJwt(
  payload: TokenPayload,
  expiresIn: string = "30d"
): Promise<string> {
  const jwt = await new SignJWT({
    id: payload.id,
    name: payload.name,
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .setSubject(payload.id)
    .sign(secretKey);

  return jwt;
}

/**
 * Verify a standalone JWT string
 */
export async function verifyJwt(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return {
      id: (payload.id as string) || (payload.sub as string),
      name: payload.name as string,
      email: payload.email as string,
      role: (payload.role as UserRole) || "CITIZEN",
      ...payload,
    };
  } catch (err: any) {
    return null;
  }
}
