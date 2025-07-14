import { SessionDetailsClient } from "./SessionDetailsClient";

/**
 * This is the wrapper Page Server Component.
 * FIXED: Updated to properly type `params` as a Promise, and awaited it correctly.
 */
export default async function SessionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: sessionId } = await params;

  return <SessionDetailsClient sessionId={sessionId} />;
}
