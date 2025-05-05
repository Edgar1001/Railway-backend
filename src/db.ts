import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";

console.log("Connecting to PostgreSQL with:");
console.log({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD ? "******" : "NOT SET", // hide actual password
  port: process.env.PGPORT,
});

export const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
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
