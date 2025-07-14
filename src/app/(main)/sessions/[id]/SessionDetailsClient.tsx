"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Users, BarChart3, Info, Paperclip, Link as LinkIcon, File as FileIcon, Loader2 } from "lucide-react";
import { ParticipantList } from "@/components/(custom)/sessions/ParticipantList";
import { BookingButton } from "@/components/(custom)/sessions/BookingButton";
import type { SelectSession } from "@/schema";

// Define a more detailed type for the session data we expect from the API
type SessionDetails = SelectSession & {
    creator: { name: string | null } | null;
    participants: { userId: string; user: { id: string; name: string; imageUrl: string | null } }[];
    materials: { id: string; title: string; type: "file" | "link"; url: string }[];
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function SessionDetailsClient({ sessionId }: { sessionId: string }) {
  const { userId } = useAuth();
  const [session, setSession] = React.useState<SessionDetails | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/sessions/${sessionId}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
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

  const proficiencyColors = {
    beginner: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-800",
    intermediate: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-200 dark:border-green-800",
    advanced: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-800",
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div>
          <Badge variant="outline" className={`${proficiencyColors[session.proficiencyLevel]} mb-2`}>{session.proficiencyLevel}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{session.title}</h1>
        </div>
        <p className="text-lg text-muted-foreground">{session.description || "No description provided."}</p>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Info className="w-5 h-5" /> Session Details</CardTitle></CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-muted-foreground" /><div><p className="font-semibold">Date</p><p>{formatDate(new Date(session.startTime))}</p></div></div>
            <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-muted-foreground" /><div><p className="font-semibold">Time</p><p>{formatTime(new Date(session.startTime))} - {formatTime(new Date(session.endTime))}</p></div></div>
            <div className="flex items-center gap-3"><User className="w-5 h-5 text-muted-foreground" /><div><p className="font-semibold">Created By</p><p>{session.creator?.name || 'N/A'}</p></div></div>
            <div className="flex items-center gap-3"><BarChart3 className="w-5 h-5 text-muted-foreground" /><div><p className="font-semibold">Level</p><p className="capitalize">{session.proficiencyLevel}</p></div></div>
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
            <BookingButton sessionId={session.id} isFull={isFull} isBookedByUser={isBookedByUser} />
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
