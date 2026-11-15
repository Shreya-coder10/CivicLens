"use server";

import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth.schema";

export async function registerUser(formData: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const validated = registerSchema.safeParse(formData);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0]?.message || "Invalid input data",
      };
    }

    const { name, email, password } = validated.data;
    const normalizedEmail = email.toLowerCase().trim();
    const sql = getDb();

    if (!sql) {
      // In offline demo mode without active DB
      return {
        success: true,
        user: {
          id: `usr_${Date.now()}`,
          name: name.trim(),
          email: normalizedEmail,
          role: "CITIZEN",
        },
      };
    }

    // Check duplicate
    const existing = await sql`
      SELECT id FROM users WHERE LOWER(email) = ${normalizedEmail} LIMIT 1;
    `;

    if (existing && existing.length > 0) {
      return {
        success: false,
        error: "An account with this email address already exists.",
      };
    }

    // Hash password securely with bcrypt
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `usr_${Math.random().toString(36).substring(2, 10)}`;

    // Save user with CITIZEN role
    await sql`
      INSERT INTO users (id, name, email, password_hash, role)
      VALUES (${userId}, ${name.trim()}, ${normalizedEmail}, ${passwordHash}, 'CITIZEN');
    `;

    return {
      success: true,
      user: {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
        role: "CITIZEN",
      },
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during registration. Please check your database connection.",
    };
  }
}
