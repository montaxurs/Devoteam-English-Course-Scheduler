import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getSessionDetails } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Users, BarChart3, Info } from "lucide-react";
import { ParticipantList } from "@/components/(custom)/sessions/ParticipantList";
import { BookingButton } from "@/components/(custom)/sessions/BookingButton";

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true
  });
}

export default async function SessionDetailsPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  
  // FIX: The warning is resolved by using params.id directly.
  // The 'await' is not needed for props in Server Components.
  const session = await getSessionDetails(params.id);

  if (!session) {
    notFound();
  }

  const isBookedByUser = session.participants.some(p => p.userId === userId);
  const isFull = session.participants.length >= session.capacity;
  const availableSpots = session.capacity - session.participants.length;

  const proficiencyColors = {
    beginner: "bg-blue-100 text-blue-800 border-blue-200",
    intermediate: "bg-green-100 text-green-800 border-green-200",
    advanced: "bg-purple-100 text-purple-800 border-purple-200",
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div>
          <Badge variant="outline" className={`${proficiencyColors[session.proficiencyLevel]} mb-2`}>
            {session.proficiencyLevel.charAt(0).toUpperCase() + session.proficiencyLevel.slice(1)}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{session.title}</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          {session.description || "No description provided for this session."}
        </p>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Info className="w-5 h-5" /> Session Details</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-semibold">Date</p>
                <p>{formatDate(session.startTime)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-semibold">Time</p>
                <p>{formatTime(session.startTime)} - {formatTime(session.endTime)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-semibold">Created By</p>
                <p>{session.creator?.name || 'N/A'}</p>
              </div>
            </div>
             <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-semibold">Level</p>
                <p className="capitalize">{session.proficiencyLevel}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Book Your Spot</CardTitle>
            <CardDescription>
              {isFull ? "This session is currently full." : `${availableSpots} of ${session.capacity} spots available.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingButton 
              sessionId={session.id}
              isFull={isFull}
              isBookedByUser={isBookedByUser}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Participants ({session.participants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {session.participants.length > 0 ? (
              <ParticipantList participants={session.participants} />
            ) : (
              <p className="text-sm text-muted-foreground">Be the first to join!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
