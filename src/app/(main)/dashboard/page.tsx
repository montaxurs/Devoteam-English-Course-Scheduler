import { getUpcomingSessions } from "@/lib/actions";
import { DashboardClient } from "./DashboardClient";

// This is now a Server Component
export default async function DashboardPage() {
  // 1. Fetch data on the server using our server action
  const sessions = await getUpcomingSessions();

  // 2. Pass the fetched data to the client component for interactive rendering
  return <DashboardClient initialSessions={sessions} />;
}
