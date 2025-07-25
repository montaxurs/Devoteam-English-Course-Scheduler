"use client";

import * as React from "react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createAiBooking } from "@/lib/actions-ai"; // Import the specific AI booking action
import { Loader2, CheckCircle } from "lucide-react";

type AiBookingButtonProps = {
  sessionId: string;
  isFull: boolean;
  isBookedByUser: boolean;
};

export function AiBookingButton({ sessionId, isFull, isBookedByUser }: AiBookingButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleBooking = () => {
    startTransition(async () => {
      const result = await createAiBooking(sessionId);
      if (result?.error) {
        // In a real app, you'd use a toast notification here
        alert(`Error: ${result.error}`);
      }
      // No need to handle success here, revalidatePath will refresh the UI
    });
  };

  if (isBookedByUser) {
    return (
      <Button disabled variant="secondary" className="w-full">
        <CheckCircle className="mr-2 h-4 w-4" />
        You&rsquo;re Booked
      </Button>
    );
  }

  if (isFull) {
    return <Button disabled className="w-full">Session Full</Button>;
  }

  return (
    <Button onClick={handleBooking} disabled={isPending} className="w-full">
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Book Your Spot
    </Button>
  );
}
