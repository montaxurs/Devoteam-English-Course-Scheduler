"use server";

import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { SessionsTable, AiSessionsTable, CourseMaterialsTable, AiCourseMaterialsTable } from "@/schema";

/**
 * Fetches all English and AI sessions created by the currently authenticated user.
 * This is used to populate the session dropdown in the material form.
 */
export async function getAllMyCreatedSessions() {
  const { userId } = await auth();
  if (!userId) return { englishSessions: [], aiSessions: [] };

  const englishSessions = await db.query.SessionsTable.findMany({
    where: eq(SessionsTable.creatorId, userId),
    orderBy: (sessions, { desc }) => [desc(sessions.startTime)],
  });

  const aiSessions = await db.query.AiSessionsTable.findMany({
    where: eq(AiSessionsTable.creatorId, userId),
    // Note: Can't sort by startTime as it's a 'time' type. 
    // We can add sorting by sessionDate if needed in the future.
  });

  return { englishSessions, aiSessions };
}

/**
 * Fetches all course materials associated with sessions created by the current user.
 * This is used to display the list of materials on the management page.
 */
export async function getAllMyCourseMaterials() {
    const { userId } = await auth();
    if (!userId) return { myEnglishMaterials: [], myAiMaterials: [] };

    // Fetch all English materials and their parent session details
    const allEnglishMaterials = await db.query.CourseMaterialsTable.findMany({
        with: {
            session: {
                columns: {
                    creatorId: true,
                    title: true,
                }
            }
        }
    });
    
    // Fetch all AI materials and their parent session details
    const allAiMaterials = await db.query.AiCourseMaterialsTable.findMany({
        with: {
            session: {
                columns: {
                    creatorId: true,
                    title: true,
                }
            }
        }
    });

    // Filter the results on the server to only include materials created by the current user
    const myEnglishMaterials = allEnglishMaterials.filter(m => m.session?.creatorId === userId);
    const myAiMaterials = allAiMaterials.filter(m => m.session?.creatorId === userId);

    return { myEnglishMaterials, myAiMaterials };
}
