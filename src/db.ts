import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "./schema"; 

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

// Pass the schema to the drizzle instance
export const db = drizzle(sql, { schema });