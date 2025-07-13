"use server";

import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { BookingsTable, CourseMaterialsTable, SessionsTable, UsersTable } from "@/schema";
import { and, eq, gte, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { sessionFormSchema, type SessionFormValues, materialFormSchema, type MaterialFormValues } from "./schemas";

// --- USER SYNC ---
export async function syncUser() {
  const user = await currentUser();
  if (!user) return;
  const existingUser = await db.query.UsersTable.findFirst({ where: eq(UsersTable.id, user.id) });
  if (existingUser) return;
  await db.insert(UsersTable).values({
    id: user.id,
    email: user.emailAddresses[0].emailAddress,
    name: `${user.firstName} ${user.lastName}`.trim() || user.emailAddresses[0].emailAddress,
    imageUrl: user.imageUrl,
  });
}

// --- SESSION & BOOKING ACTIONS ---
export async function createSession(payload: SessionFormValues) {
  const { userId } = await auth();
  if (!userId) { throw new Error("You must be logged in."); }
  const validatedFields = sessionFormSchema.safeParse(payload);
  if (!validatedFields.success) { return { error: "Invalid fields." }; }
  const { title, description, proficiencyLevel, startTime, endTime, capacity } = validatedFields.data;
  try {
    await db.insert(SessionsTable).values({
      title, description, proficiencyLevel,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      capacity,
      creatorId: userId,
    });
  } catch (error) {
    console.error("Database Insert Error:", error);
    return { error: "Database Error: Failed to create session." };
  }
  revalidatePath("/manage-sessions");
  redirect("/manage-sessions");
}

export async function getUpcomingSessions() {
  return await db.query.SessionsTable.findMany({
    where: gte(SessionsTable.startTime, new Date()),
    with: {
      creator: { columns: { name: true, imageUrl: true } },
      participants: { columns: { userId: true } },
    },
    orderBy: (sessions, { asc }) => [asc(sessions.startTime)],
  });
}

export async function getSessionDetails(sessionId: string) {
  return await db.query.SessionsTable.findFirst({
    where: eq(SessionsTable.id, sessionId),
    with: {
      creator: true,
      participants: { with: { user: true } },
    },
  });
}

export async function createBooking(sessionId: string) {
  const { userId } = await auth();
  if (!userId) { throw new Error("You must be logged in."); }
  const session = await db.query.SessionsTable.findFirst({
    where: eq(SessionsTable.id, sessionId),
    with: { participants: true },
  });
  if (!session) { return { error: "Session not found." }; }
  if (session.participants.some(p => p.userId === userId)) { return { error: "You have already booked this session." }; }
  if (session.participants.length >= session.capacity) { return { error: "This session is already full." }; }
  try {
    await db.insert(BookingsTable).values({ sessionId, userId });
    revalidatePath(`/sessions/${sessionId}`);
    revalidatePath('/my-schedule');
    return { success: "Session booked successfully!" };
  } catch (e) {
    return { error: "An unexpected error occurred." };
  }
}

export async function getMyBookedSessions() {
  const { userId } = await auth();
  if (!userId) return [];
  return await db.query.BookingsTable.findMany({
    where: eq(BookingsTable.userId, userId),
    with: {
      session: {
        with: {
          creator: { columns: { name: true } }
        }
      },
    },
    orderBy: (bookings, { desc }) => [desc(bookings.createdAt)],
  });
}

export async function cancelBooking(bookingId: string) {
  const { userId } = await auth();
  if (!userId) { throw new Error("You must be logged in."); }
  const booking = await db.query.BookingsTable.findFirst({
    where: and(eq(BookingsTable.id, bookingId), eq(BookingsTable.userId, userId)),
  });
  if (!booking) { return { error: "Booking not found." }; }
  try {
    await db.delete(BookingsTable).where(eq(BookingsTable.id, bookingId));
    revalidatePath("/my-schedule");
    revalidatePath(`/sessions/${booking.sessionId}`);
    return { success: "Booking cancelled." };
  } catch (e) {
    return { error: "An unexpected error occurred." };
  }
}

// --- MANAGEMENT ACTIONS ---
export async function getMyCreatedSessions() {
  const { userId } = await auth();
  if (!userId) return [];
  return await db.query.SessionsTable.findMany({
    where: eq(SessionsTable.creatorId, userId),
    with: {
      participants: { columns: { userId: true } },
    },
    orderBy: (sessions, { desc }) => [desc(sessions.startTime)],
  });
}

export async function createCourseMaterial(values: MaterialFormValues) {
  const { userId } = await auth();
  if (!userId) { throw new Error("You must be logged in."); }
  const validatedFields = materialFormSchema.safeParse(values);
  if (!validatedFields.success) { return { error: "Invalid fields." }; }
  const { title, type, url, sessionId, file } = validatedFields.data;
  let materialUrl = url;
  if (type === 'file' && file) {
    materialUrl = `https://fake-storage.com/${file.name}`; // Placeholder for real upload
  }
  if (!materialUrl) { return { error: "A URL or a file is required." }; }
  try {
    await db.insert(CourseMaterialsTable).values({ title, type, url: materialUrl, sessionId });
  } catch (error) {
    return { error: "Database Error: Failed to create material." };
  }
  revalidatePath("/manage-materials");
  return { success: "Material added successfully!" };
}

export async function deleteCourseMaterial(materialId: string) {
    const { userId } = await auth();
    if (!userId) { throw new Error("You must be logged in."); }
    try {
        await db.delete(CourseMaterialsTable).where(eq(CourseMaterialsTable.id, materialId));
    } catch (error) {
        return { error: "Database Error: Failed to delete material." };
    }
    revalidatePath("/manage-materials");
    return { success: "Material deleted." };
}
