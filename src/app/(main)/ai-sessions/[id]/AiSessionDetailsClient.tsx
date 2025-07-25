"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Users, Info, Paperclip, Link as LinkIcon, File as FileIcon, Loader2, BrainCircuit } from "lucide-react";
import { ParticipantList } from "@/components/(custom)/sessions/ParticipantList";
import { AiBookingButton } from "../../../../components/(custom)/ai-sessions/AiBookingButton";
import type { SelectAiSession } from "@/schema";

// Define the detailed type for the AI session data we expect from our API
type AiSessionDetails = SelectAiSession & {
    creator: { name: string | null } | null;
    participants: { userId: string; user: { id: string; name: string; imageUrl: string | null } }[];
    materials: { id: string; title: string; type: "file" | "link"; url: string }[];
};

// Helper function to combine and format the date and time
function formatFullDateTime(dateStr: string, timeStr: string): string {
    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/Tunis'
    });
}


export function AiSessionDetailsClient({ sessionId }: { sessionId: string }) {
  const { userId } = useAuth();
  const [session, setSession] = React.useState<AiSessionDetails | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/ai-sessions/${sessionId}`);
        if (!response.ok) {
          if (response.status === 404) notFound();
          throw new Error('Failed to fetch session details');
        }
        const data = await response.json();
        setSession(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!session) {
    return notFound();
  }

  const isBookedByUser = session.participants.some(p => p.userId === userId);
  const isFull = session.participants.length >= session.capacity;
  const availableSpots = session.capacity - session.participants.length;

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">

        <div className="relative h-[350px] w-full">
          <img 
          src="/istockphoto-1933417108-2048x2048.jpg"
          alt="AI Background" 
          className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
      
        <div>
          <Badge variant="default" className="mb-4 w-fit bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
            <BrainCircuit className="mr-2 h-4 w-4" /> AI Course
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{session.title}</h1>
        </div>
        <p className="text-lg text-muted-foreground">{session.description || "No description provided."}</p>
        
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Info className="w-5 h-5" /> Session Details</CardTitle></CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
            {/* UPDATE: Display the combined and formatted date and time */}
            <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-muted-foreground" /><div><p className="font-semibold">Date & Time</p><p>{formatFullDateTime(session.sessionDate, session.startTime)}</p></div></div>
            <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-muted-foreground" /><div><p className="font-semibold">Duration</p><p>{session.durationInMinutes} minutes</p></div></div>
            <div className="flex items-center gap-3"><User className="w-5 h-5 text-muted-foreground" /><div><p className="font-semibold">Instructor</p><p>{session.creator?.name || 'N/A'}</p></div></div>
            <div className="flex items-center gap-3"><Users className="w-5 h-5 text-muted-foreground" /><div><p className="font-semibold">Capacity</p><p>{session.minCapacity} - {session.capacity} participants</p></div></div>
          </CardContent>
        </Card>

        {isBookedByUser && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Paperclip className="w-5 h-5" /> Course Materials</CardTitle></CardHeader>
            <CardContent>
              {session.materials?.length > 0 ? (
                <div className="space-y-3">
                  {session.materials.map((material) => (
                    <a key={material.id} href={material.url} target="_blank" rel="noopener noreferrer" download={material.type === 'file'} className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50">
                      {material.type === 'file' ? <FileIcon className="h-5 w-5 text-muted-foreground" /> : <LinkIcon className="h-5 w-5 text-muted-foreground" />}
                      <span className="font-medium">{material.title}</span>
                    </a>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground">No materials added.</p>}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="md:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Book Your Spot</CardTitle>
            <CardDescription>{isFull ? "This session is full." : `${availableSpots} of ${session.capacity} spots available.`}</CardDescription>
          </CardHeader>
          <CardContent>
            <AiBookingButton sessionId={session.id} isFull={isFull} isBookedByUser={isBookedByUser} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Participants ({session.participants.length})</CardTitle></CardHeader>
          <CardContent>
            {session.participants.length > 0 ? <ParticipantList participants={session.participants} /> : <p className="text-sm text-muted-foreground">Be the first to join!</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
