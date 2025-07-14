"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import type { SessionWithDetails } from "@/lib/types";

// Define the component's props for type safety
type SessionCalendarProps = {
  sessions: SessionWithDetails[];
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
};

export function SessionCalendar({ sessions, selectedDate, onDateSelect }: SessionCalendarProps) {
  // Memoize the session dates to prevent recalculation on every render
  const sessionDates = React.useMemo(() => 
    sessions.map(session => new Date(session.startTime)), 
    [sessions]
  );

  // Define a custom modifier to highlight days that have sessions
  const modifiers = {
    hasSession: sessionDates,
  };

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Calendar View</CardTitle>
        <CardDescription>Select a date to view its sessions.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          modifiers={modifiers}
          modifiersClassNames={{ hasSession: "has-session-modifier" }}
          className="rounded-md"
          disabled={{ before: new Date() }}
        />
      </CardContent>
      {/* Add a custom style tag for more specific styling control */}
      <style>{`
        /* Style for days that have sessions */
        .has-session-modifier {
          font-weight: bold;
          color: hsl(var(--primary)) !important;
          border: 1px solid hsl(var(--primary) / 0.5);
          border-radius: 9999px;
        }
        .has-session-modifier:hover {
          background-color: hsl(var(--primary) / 0.1);
        }

        /* FIX: Override the default styles for the SELECTED day
          to match the Devoteam brand theme.
        */
        .rdp-day_selected,
        .rdp-day_selected:focus-visible,
        .rdp-day_selected:hover {
          color: hsl(var(--primary-foreground)) !important;
          background-color: hsl(var(--primary)) !important;
          opacity: 1;
          border-radius: 9999px;
        }

        /* Style for today's date */
        .rdp-day_today {
          font-weight: bold;
          color: hsl(var(--primary));
        }
      `}</style>
    </Card>
  );
}
