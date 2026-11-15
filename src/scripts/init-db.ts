import { ensureTablesExist, isDbConfigured } from "../lib/db";

async function main() {
  console.log("🚀 Initializing NeonDB database schema...");

  if (!isDbConfigured()) {
    console.error("❌ DATABASE_URL is not set or contains placeholder. Please set your NeonDB connection string in .env");
    process.exit(1);
  }

  const success = await ensureTablesExist();
  if (success) {
    console.log("✅ NeonDB tables and indexes created successfully!");
  } else {
    console.error("❌ Failed to initialize database tables.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
