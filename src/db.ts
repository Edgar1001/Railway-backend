import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";

// Use DATABASE_URL directly instead of individual variables
console.log("Connecting to PostgreSQL with DATABASE_URL:");

console.log({
  connectionString: process.env.DATABASE_URL ? "******" : "NOT SET",  // Masking the actual connection string for logs
});

// Create the pool using DATABASE_URL environment variable
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // PostgreSQL connection string from environment
});

// Test the connection
(async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL connected:", result.rows[0]);
  } catch (error) {
    console.error("❌ PostgreSQL connection error:", error);
  }
})();
