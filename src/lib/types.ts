import { getUpcomingSessions } from "./actions";

/**
 * This creates a dynamic TypeScript type based on the data returned by our server action.
 * It's a robust way to ensure type safety between the server and client components.
 * It represents a single session object with its related instructor and participant data.
 */
export type SessionWithDetails = Awaited<ReturnType<typeof getUpcomingSessions>>[number];
