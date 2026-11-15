import { neon, NeonQueryFunction } from "@neondatabase/serverless";

function getDatabaseUrl(): string | null {
  const url = process.env.DATABASE_URL;
  if (!url || url.includes("ep-placeholder") || url.includes("localhost:5432")) {
    return null;
  }
  return url;
}

export function isDbConfigured(): boolean {
  return getDatabaseUrl() !== null;
}

/**
 * Returns a Neon SQL execution function or null if not yet configured.
 */
export function getDb(): NeonQueryFunction<false, false> | null {
  const connectionString = getDatabaseUrl();
  if (!connectionString) {
    return null;
  }
  return neon(connectionString);
}

/**
 * Executes a SQL query safely, handling cases where database is not yet configured
 */
export async function query<T = any>(
  sqlQuery: string,
  params: any[] = []
): Promise<T[]> {
  const sql = getDb();
  if (!sql) {
    return [];
  }
  try {
    const rows = await (sql as any)(sqlQuery, params);
    return rows as T[];
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

/**
 * Initializes NeonDB database tables and indexes automatically
 */
export async function ensureTablesExist(): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;

  try {
    // 1. Users Table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(32) NOT NULL DEFAULT 'CITIZEN',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Complaints Table
    await sql`
      CREATE TABLE IF NOT EXISTS complaints (
        id VARCHAR(64) PRIMARY KEY,
        reference_id VARCHAR(64) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        ai_summary TEXT,
        category VARCHAR(64) NOT NULL,
        severity VARCHAR(32) NOT NULL DEFAULT 'MEDIUM',
        status VARCHAR(32) NOT NULL DEFAULT 'SUBMITTED',
        address TEXT NOT NULL,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Complaint Images Table
    await sql`
      CREATE TABLE IF NOT EXISTS complaint_images (
        id VARCHAR(64) PRIMARY KEY,
        complaint_id VARCHAR(64) NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
        s3_key TEXT NOT NULL,
        url TEXT NOT NULL,
        original_filename VARCHAR(255) NOT NULL,
        mime_type VARCHAR(64) NOT NULL,
        file_size INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 4. Complaint History Table (Audit Trail)
    await sql`
      CREATE TABLE IF NOT EXISTS complaint_history (
        id VARCHAR(64) PRIMARY KEY,
        complaint_id VARCHAR(64) NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
        previous_status VARCHAR(32) NOT NULL,
        new_status VARCHAR(32) NOT NULL,
        remarks TEXT,
        changed_by VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 5. Admin Remarks Table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_remarks (
        id VARCHAR(64) PRIMARY KEY,
        complaint_id VARCHAR(64) NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
        admin_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        remark TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 6. Helpful Indexes for Performance
    await sql`CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_complaints_created ON complaints(created_at);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_complaints_user ON complaints(user_id);`;

    return true;
  } catch (error) {
    console.error("Failed to initialize database tables:", error);
    return false;
  }
}
