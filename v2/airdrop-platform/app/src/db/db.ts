import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";
import { env } from "process";

let db: PostgresJsDatabase<typeof schema>;

export function initDb(testDb?: PostgresJsDatabase<typeof schema>) {
  if (testDb) {
    db = testDb;
    return db;
  }

  const dbUrl = env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL is not set");

  const client = postgres(dbUrl, { prepare: true });
  db = drizzle(client, { schema });

  return db;
}

export function getDb() {
  if (!db) {
    db = initDb();
  }
  return db;
}

export type db = typeof db;
