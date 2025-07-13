"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import type { SessionWithDetails } from "@/lib/types"; // Import the new shared type

export function SessionCalendar({ sessions }: { sessions: SessionWithDetails[] }) {
  const sessionDates = React.useMemo(() => 
    sessions.map(session => new Date(session.startTime)), 
    [sessions]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar View</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="multiple"
          selected={sessionDates}
          className="rounded-md"
        />
      </CardContent>
    </Card>
  );
}
