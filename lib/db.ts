import { drizzle } from "drizzle-orm/neon-serverless"
import * as schema from "@/drizzle/schema";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { config } from "dotenv";
import ws from "ws"

config({ path: ".env" }); // or .env.local

if (process.env.NODE_ENV === "development") {
    neonConfig.webSocketConstructor = ws;
}

// const sql = neon(process.env.DATABASE_URL!);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})
export const db = drizzle(pool, { schema });
