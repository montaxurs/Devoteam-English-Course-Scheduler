"use client";

import * as React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define the shape of the participant data we expect
type Participant = {
  user: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
};

export function ParticipantList({ participants }: { participants: Participant[] }) {
  return (
    <div className="flex items-center -space-x-2">
      <TooltipProvider delayDuration={100}>
        {participants.map((p) => (
          <Tooltip key={p.user.id}>
            <TooltipTrigger asChild>
              <Avatar className="border-2 border-background">
                <AvatarImage src={p.user.imageUrl || ""} alt={p.user.name} />
                <AvatarFallback>
                  {p.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{p.user.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}
