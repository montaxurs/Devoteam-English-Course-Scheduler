"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { SessionList } from "@/components/(custom)/dashboard/SessionList";
import { SessionCalendar } from "@/components/(custom)/dashboard/SessionCalendar";
import type { SessionWithDetails } from "@/lib/types";

const filterOptions = ['all', 'beginner', 'intermediate', 'advanced'] as const;

export function DashboardClient({ initialSessions }: { initialSessions: SessionWithDetails[] }) {
  const [proficiencyFilter, setProficiencyFilter] = React.useState<typeof filterOptions[number]>("all");
  
  // FIX: Add state to manage the selected date from the calendar.
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();

  // FIX: The filtering logic now considers both proficiency and the selected date.
  const filteredSessions = React.useMemo(() => {
    return initialSessions.filter(session => {
      // Match proficiency level
      const proficiencyMatch = proficiencyFilter === 'all' || session.proficiencyLevel === proficiencyFilter;
      
      // If no date is selected, just filter by proficiency
      if (!selectedDate) {
        return proficiencyMatch;
      }

      // If a date is selected, also match the date
      const sessionDate = new Date(session.startTime);
      const dateMatch = sessionDate.getFullYear() === selectedDate.getFullYear() &&
                        sessionDate.getMonth() === selectedDate.getMonth() &&
                        sessionDate.getDate() === selectedDate.getDate();
      
      return proficiencyMatch && dateMatch;
    });
  }, [proficiencyFilter, selectedDate, initialSessions]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Find a Session
          </h1>
          <p className="text-muted-foreground">
            Browse upcoming English courses and book your spot.
          </p>
        </div>
        
        <div className="flex items-center gap-2 rounded-full border bg-card p-1">
          {filterOptions.map((option) => (
            <Button
              key={option}
              variant={proficiencyFilter === option ? "default" : "ghost"}
              size="sm"
              onClick={() => setProficiencyFilter(option)}
              className="rounded-full capitalize"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Pass the selected date to the list for context */}
          <SessionList sessions={filteredSessions} selectedDate={selectedDate} />
        </div>
        <div className="lg:col-span-1">
          {/* The calendar now controls the selectedDate state */}
          <SessionCalendar 
            sessions={initialSessions} 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>
      </div>
    </div>
  );
}
