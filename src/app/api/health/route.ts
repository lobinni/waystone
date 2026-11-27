import { databaseStatus } from "@/db";

export const dynamic = "force-dynamic";

/**
 * Health of the deployment. The application itself only needs the contract, so a missing database is reported as
 * `not-configured` and still answers 200; a configured database that cannot be reached answers 500.
 */
export async function GET() {
  const database = await databaseStatus();
  if (database === "down") return Response.json({ ok: false, database }, { status: 500 });
  return Response.json({ ok: true, database });
}
