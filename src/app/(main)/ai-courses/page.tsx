import { getUpcomingAiSessions } from "@/lib/actions-ai";
import { AiCoursesClient } from "./AiCoursesClient"; // Import the new client component

// Define the type for the data fetched on the server
// UPDATE: Added 'sessionDate' to match the data structure from the server action
type UpcomingAiSession = {
    id: string;
    title: string;
    description: string | null;
    durationInMinutes: number;
    capacity: number;
    minCapacity: number;
    startTime: string;
    sessionDate: string; // This field is now required
    creator: {
        name: string | null;
        imageUrl: string | null;
    } | null;
};

// This is the Server Component that fetches live data
export default async function AiCoursesPage() {
    // 1. Fetch all currently scheduled and bookable AI sessions from the database.
    const scheduledSessions = await getUpcomingAiSessions() as UpcomingAiSession[];

    // 2. Define the special "Coming Soon" course as a separate object.
    const comingSoonCourse = {
        id: "prompt-eng-102",
        title: "Prompt Engineering 102",
        description: "Learn how to do prompts properly with Gemini to get the most out of large language models.",
        creator: "Bedioui Samy",
        status: 'coming_soon'
    };
    
    // 3. Render the Client Component and pass the fetched data as props.
    return (
        <AiCoursesClient 
            scheduledSessions={scheduledSessions}
            comingSoonCourse={comingSoonCourse}
        />
    );
}
