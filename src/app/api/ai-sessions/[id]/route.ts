import { NextResponse } from 'next/server';
import { getAiSessionDetails } from '@/lib/actions-ai';

/**
 * API route handler for fetching a single AI session's details.
 * @param req The incoming request object.
 * @param context The context object containing route parameters.
 * @returns A NextResponse object with the session data or an error message.
 */
export async function GET(
  req: Request,
  context: { params: { id: string } } // Updated context type for clarity
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Use the existing server action to fetch the data
    const session = await getAiSessionDetails(id);

    if (!session) {
      return NextResponse.json({ error: 'AI Session not found' }, { status: 404 });
    }

    return NextResponse.json(session);
    
  } catch (error) {
    console.error('[AI_SESSION_GET_API_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
