import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * The website reads every number from the contract, so the database is optional infrastructure: it is only used by
 * the health endpoint. A missing DATABASE_URL therefore never breaks a build, a page or a deploy — the health route
 * reports that the database is not configured instead of the whole application failing to start.
 */
const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __waystonePostgresPool?: Pool;
};

export const pool: Pool | null = databaseUrl
  ? (globalForDb.__waystonePostgresPool ??= new Pool({ connectionString: databaseUrl }))
  : null;

export const db = pool ? drizzle(pool) : null;

/** "not-configured" | "up" | "down" — what the health endpoint reports. */
export async function databaseStatus(): Promise<"not-configured" | "up" | "down"> {
  if (!db) return "not-configured";
  try {
    const { sql } = await import("drizzle-orm");
    await db.execute(sql`select 1`);
    return "up";
  } catch {
    return "down";
  }
}
