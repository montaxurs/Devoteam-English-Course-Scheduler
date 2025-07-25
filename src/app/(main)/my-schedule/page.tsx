import Link from "next/link";
import { getMyBookedSessions } from "@/lib/actions";
import { getMyBookedAiSessions } from "@/lib/actions-ai";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight, CalendarPlus, BrainCircuit } from "lucide-react";
import { CancelBookingButton } from "@/components/(custom)/my-schedule/CancelBookingButton";
import { CancelAiBookingButton } from "@/components/(custom)/my-schedule/CancelAiBookingButton";

// FIX: Define non-nullable types for our bookings.
// This tells TypeScript that after we fetch and filter, we won't have any null values.
type EnglishBooking = NonNullable<Awaited<ReturnType<typeof getMyBookedSessions>>[number]>;
type AiBooking = NonNullable<Awaited<ReturnType<typeof getMyBookedAiSessions>>[number]>;
type CombinedBooking = EnglishBooking | AiBooking;

// Card for English Sessions
const proficiencyColors: { [key: string]: string } = {
  beginner: "bg-blue-100 text-blue-800 border-blue-200",
  intermediate: "bg-green-100 text-green-800 border-green-200",
  advanced: "bg-purple-100 text-purple-800 border-purple-200",
};

function EnglishSessionCard({ booking }: { booking: EnglishBooking }) {
  const { session } = booking;
  // This check is good practice, though our filter should prevent this from being hit.
  if (!session) return null;

  return (
    <Card className="border-l-4 border-blue-500">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="outline" className={`${proficiencyColors[session.proficiencyLevel]} mb-2`}>
              {session.proficiencyLevel}
            </Badge>
            <CardTitle>{session.title}</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              <User className="h-4 w-4" /> With {session.creator?.name || 'N/A'}
            </CardDescription>
          </div>
          <Link href={`/sessions/${session.id}`}>
            <Button variant="secondary" size="sm">
              View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{new Date(session.startTime).toLocaleDateString()}</span></div>
          <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>{new Date(session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div>
        </div>
        <CancelBookingButton bookingId={booking.id} />
      </CardContent>
    </Card>
  );
}

// Card for AI Sessions
function AiSessionCard({ booking }: { booking: AiBooking }) {
  const { session } = booking;
  if (!session) return null;

  return (
    <Card className="border-l-4 border-purple-500">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="default" className="mb-2 bg-purple-600 hover:bg-purple-700">
              <BrainCircuit className="mr-1.5 h-3 w-3" />
              AI Course
            </Badge>
            <CardTitle>{session.title}</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              <User className="h-4 w-4" /> With {session.creator?.name || 'N/A'}
            </CardDescription>
          </div>
          <Link href={`/ai-sessions/${session.id}`}>
            <Button variant="secondary" size="sm">
              View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{new Date(session.startTime).toLocaleDateString()}</span></div>
          <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>{new Date(session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', timeZone: 'Africa/Tunis'})}</span></div>
        </div>
        <CancelAiBookingButton bookingId={booking.id} />
      </CardContent>
    </Card>
  );
}

// Main Page Component
export default async function MySchedulePage() {
  const [englishBookings, aiBookings] = await Promise.all([
    getMyBookedSessions(),
    getMyBookedAiSessions(),
  ]);

  // FIX: Filter out any invalid bookings and use a type-safe sort
  const allMyBookings = [...englishBookings, ...aiBookings]
    .filter((booking): booking is CombinedBooking => !!booking?.session) // This removes nulls and ensures .session exists
    .sort((a, b) => {
      // Now it's safe to access .session without '@ts-ignore'
      const dateA = new Date(a.session.startTime);
      const dateB = new Date(b.session.startTime);
      return dateA.getTime() - dateB.getTime();
    });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">My Upcoming Sessions</h1>
          <p className="text-muted-foreground">Here are all the English and AI sessions you’ve booked.</p>
        </div>
      </div>

      {allMyBookings.length > 0 ? (
        <div className="space-y-4">
          {allMyBookings.map((booking) => {
            // Because of our filter, 'booking' is guaranteed to be safe to use here.
            if (booking.type === 'english') {
              return <EnglishSessionCard key={`eng-${booking.id}`} booking={booking} />;
            }
            if (booking.type === 'ai') {
              return <AiSessionCard key={`ai-${booking.id}`} booking={booking} />;
            }
            return null;
          })}
        </div>
      ) : (
        <div className="flex h-80 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center">
          <CalendarPlus className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Upcoming Sessions</h3>
          <p className="mt-2 text-sm text-muted-foreground">You haven’t booked any sessions yet.</p>
          <Link href="/dashboard" className="mt-6">
            <Button>Find a Session</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
