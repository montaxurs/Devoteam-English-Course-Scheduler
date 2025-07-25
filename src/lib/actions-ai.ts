"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { AiBookingsTable, AiSessionsTable } from "@/schema";
import { and, eq, gte } from "drizzle-orm";
import { AiSessionFormValues } from "./schemas";

/**
 * ============================================================================
 * AI SESSION MANAGEMENT & LISTING ACTIONS (UPDATED FOR 'sessionDate')
 * ============================================================================
 */

/**
 * Combines the date and time from a session object into a full Date object.
 * @param session The AI session object from the database.
 * @returns A full Date object representing the session's start time.
 */
function getFullSessionDate(session: { sessionDate: string; startTime: string }): Date {
    return new Date(`${session.sessionDate}T${session.startTime}`);
}


/**
 * Fetches all scheduled AI sessions with a start date in the future.
 * @returns A promise that resolves to an array of upcoming AI sessions.
 */
export async function getUpcomingAiSessions() {
  const sessions = await db.query.AiSessionsTable.findMany({
    where: and(
      eq(AiSessionsTable.status, 'scheduled'),
      // Query based on the new sessionDate column
      gte(AiSessionsTable.sessionDate, new Date().toISOString().split('T')[0])
    ),
    with: {
      creator: true,
    },
  });

  const sessionsWithFullDate = sessions.map(session => {
    const fullDate = getFullSessionDate(session);
    return {
      ...session,
      // Overwrite `startTime` with the full ISO string for client-side use
      startTime: fullDate.toISOString(),
    };
  });

  // Sort sessions by their actual date and time
  sessionsWithFullDate.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  
  return sessionsWithFullDate;
}


/**
 * Fetches all AI session bookings for the currently authenticated user.
 * @returns A promise that resolves to an array of the user's AI bookings.
 */
export async function getMyBookedAiSessions() {
  const { userId } = await auth();
  if (!userId) return [];

  const bookings = await db.query.AiBookingsTable.findMany({
    where: eq(AiBookingsTable.userId, userId),
    with: {
      session: {
        with: {
          creator: true,
        },
      },
    },
  });

  const processedBookings = bookings.map(booking => {
    if (!booking.session) return null;

    const fullDate = getFullSessionDate(booking.session);
    
    // Filter out sessions that have already passed
    if (fullDate < new Date()) {
        return null;
    }
    
    return {
      ...booking,
      session: {
        ...booking.session,
        startTime: fullDate.toISOString(), 
      },
      type: 'ai' as const, 
    };
  }).filter(Boolean);

  return processedBookings;
}


/**
 * Creates a new AI session in the database.
 */
export async function createAiSession(values: AiSessionFormValues) {
  const { userId } = await auth();
  if (!userId) {
    return { error: "You must be logged in." };
  }

  const { startTime, ...restOfValues } = values;
  const startDate = new Date(startTime);

  // Extract the date, time, and day of the week from the form input
  const sessionDateForDb = startDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
  const startTimeForDb = startDate.toTimeString().split(" ")[0]; // "HH:mm:ss"
  const dayOfWeekForDb = startDate.getDay() === 2 ? "Tuesday" : "Friday";

  try {
    await db.insert(AiSessionsTable).values({
      ...restOfValues,
      sessionDate: sessionDateForDb,
      startTime: startTimeForDb,
      dayOfWeek: dayOfWeekForDb,
      creatorId: userId,
    });
    revalidatePath("/ai-courses"); 
    return { success: "AI Session created successfully!" };
  } catch (e) {
    return { error: "An unexpected error occurred." };
  }
}

// ... (The rest of the functions: cancelAiBooking, getAiSessionDetails, createAiBooking remain the same as your latest version)
/**
 * Cancels a user's booking for an AI session.
 */
export async function cancelAiBooking(bookingId: string) {
    const { userId } = await auth();
    if (!userId) { return { error: "You must be logged in." }; }
    try {
        const booking = await db.query.AiBookingsTable.findFirst({
            where: and(eq(AiBookingsTable.id, bookingId), eq(AiBookingsTable.userId, userId))
        });
        if (!booking) { return { error: "Booking not found." }; }
        await db.delete(AiBookingsTable).where(eq(AiBookingsTable.id, bookingId));
        revalidatePath("/my-schedule");
        revalidatePath(`/ai-sessions/${booking.aiSessionId}`);
        return { success: "Booking cancelled." };
    } catch (e) {
        return { error: "An unexpected error occurred." };
    }
}

/**
 * Fetches all details for a single AI session.
 */
export async function getAiSessionDetails(sessionId: string) {
    const session = await db.query.AiSessionsTable.findFirst({
        where: eq(AiSessionsTable.id, sessionId),
        with: {
            creator: true,
            participants: { with: { user: true } },
            materials: true,
        },
    });
    return session;
}

/**
 * Creates a booking for an AI session.
 */
export async function createAiBooking(sessionId: string) {
    const { userId } = await auth();
    if (!userId) { throw new Error("You must be logged in."); }

    const session = await db.query.AiSessionsTable.findFirst({
        where: eq(AiSessionsTable.id, sessionId),
        with: { participants: true },
    });

    if (!session) return { error: "Session not found." };
    const isAlreadyBooked = session.participants.some(p => p.userId === userId);
    if (isAlreadyBooked) return { error: "You are already booked." };
    if (session.participants.length >= session.capacity) return { error: "Session is full." };

    try {
        await db.insert(AiBookingsTable).values({
            aiSessionId: sessionId,
            userId: userId,
        });
        revalidatePath(`/ai-sessions/${sessionId}`);
        revalidatePath('/my-schedule');
        return { success: "Session booked!" };
    } catch (e) {
        return { error: "An unexpected error occurred." };
    }
}
