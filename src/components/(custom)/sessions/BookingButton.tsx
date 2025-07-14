"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { createBooking } from "@/lib/actions";
import { useTransition } from "react";
import { Loader2, CheckCircle } from "lucide-react";

type BookingButtonProps = {
  sessionId: string;
  isFull: boolean;
  isBookedByUser: boolean;
};

export function BookingButton({ sessionId, isFull, isBookedByUser }: BookingButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleBooking = () => {
    startTransition(async () => {
      const result = await createBooking(sessionId);
      if (result?.error) {
        // In a real app, you'd use a toast notification here
        alert(`Error: ${result.error}`);
      }
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
