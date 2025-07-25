import { AiSessionDetailsClient } from "@/app/(main)/ai-sessions/[id]/AiSessionDetailsClient";

/**
 * This is the wrapper Page Server Component for the AI Session Details page.
 * It follows the Next.js 15 pattern for handling dynamic route parameters.
 */
export default async function AiSessionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Awaiting the params object to safely access its properties.
  const { id: sessionId } = await params;

  // Render the client component and pass the sessionId to it.
  // The client component will handle all data fetching and rendering logic.
  return <AiSessionDetailsClient sessionId={sessionId} />;
}
