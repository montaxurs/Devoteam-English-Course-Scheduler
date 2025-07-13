import Link from "next/link";
import { getMyBookedSessions } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight, CalendarPlus } from "lucide-react";
import { CancelBookingButton } from "@/components/(custom)/my-schedule/CancelBookingButton";

// Define the type for the data we expect from our action
type BookedSession = Awaited<ReturnType<typeof getMyBookedSessions>>[number];

const proficiencyColors = {
  beginner: "bg-blue-100 text-blue-800 border-blue-200",
  intermediate: "bg-green-100 text-green-800 border-green-200",
  advanced: "bg-purple-100 text-purple-800 border-purple-200",
};

function BookedSessionCard({ booking }: { booking: BookedSession }) {
  const { session } = booking;
  if (!session) return null;

  const formattedDate = new Date(session.startTime).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
  const formattedTime = new Date(session.startTime).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="outline" className={`${proficiencyColors[session.proficiencyLevel]} mb-2`}>
              {session.proficiencyLevel}
            </Badge>
            <CardTitle>{session.title}</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              {/* FIX: Use the 'creator' relation instead of 'instructor' */}
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
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{formattedTime}</span>
          </div>
        </div>
        <CancelBookingButton bookingId={booking.id} />
      </CardContent>
    </Card>
  );
}

export default async function MySchedulePage() {
  const myBookings = await getMyBookedSessions();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            My Upcoming Sessions
          </h1>
          <p className="text-muted-foreground">
            Here are all the sessions you've booked.
          </p>
        </div>
      </div>

      {myBookings.length > 0 ? (
        <div className="space-y-4">
          {myBookings.map((booking) => (
            <BookedSessionCard key={booking.id} booking={booking} />
          ))}
        </div>
      ) : (
        <div className="flex h-80 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center">
          <CalendarPlus className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Upcoming Sessions</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven't booked any sessions yet.
          </p>
          <Link href="/dashboard" className="mt-6">
            <Button>Find a Session</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
