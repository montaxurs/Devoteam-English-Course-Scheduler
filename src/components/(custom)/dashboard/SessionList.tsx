"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { SessionWithDetails } from "@/lib/types"; // Import the new shared type

const proficiencyColors = {
  beginner: "bg-blue-100 text-blue-800 border-blue-200",
  intermediate: "bg-green-100 text-green-800 border-green-200",
  advanced: "bg-purple-100 text-purple-800 border-purple-200",
};

function SessionCard({ session, index }: { session: SessionWithDetails, index: number }) {
  // FIX: Logic now uses the real data structure from the database
  const bookedCount = session.participants.length;
  const isFull = bookedCount >= session.capacity;
  
  const formattedDate = new Date(session.startTime).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = new Date(session.startTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
        <CardHeader className="flex flex-row items-start bg-muted/50 p-4 border-b">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              {session.title}
            </CardTitle>
            <CardDescription>
              {formattedDate} at {formattedTime}
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className={proficiencyColors[session.proficiencyLevel]}>
              {session.proficiencyLevel.charAt(0).toUpperCase() + session.proficiencyLevel.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {/* FIX: Displaying real participant count */}
            <span>{bookedCount} / {session.capacity} booked</span>
          </div>
          <Link href={`/sessions/${session.id}`} passHref>
            <Button size="sm" disabled={isFull}>
              {isFull ? "Session Full" : "View Details"}
              {!isFull && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function SessionList({ sessions }: { sessions: SessionWithDetails[] }) {
  return (
    <div className="space-y-4">
      {sessions.length > 0 ? (
        sessions.map((session, index) => <SessionCard key={session.id} session={session} index={index} />)
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card p-8 text-center">
          <h3 className="text-lg font-semibold">No Sessions Found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            There are no available sessions for the selected filter.
          </p>
        </div>
      )}
    </div>
  );
}
