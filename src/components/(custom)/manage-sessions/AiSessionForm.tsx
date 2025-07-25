"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { aiSessionFormSchema, type AiSessionFormValues } from "@/lib/schemas";
import { createAiSession } from "@/lib/actions-ai";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTransition } from "react";
import { Loader2, PlusCircle } from "lucide-react";

// Helper function to find the next valid Tuesday or Friday for the default value
const getNextValidSessionDate = () => {
    const now = new Date();
    let nextDate = new Date(now);
    nextDate.setDate(now.getDate() + 1); // Start from tomorrow
    
    while(nextDate.getDay() !== 2 && nextDate.getDay() !== 5) { // 2 = Tuesday, 5 = Friday
        nextDate.setDate(nextDate.getDate() + 1);
    }
    nextDate.setHours(16, 0, 0, 0); // Default to 4 PM

    // Format for datetime-local input
    const ten = (i: number) => (i < 10 ? '0' : '') + i;
    const YYYY = nextDate.getFullYear();
    const MM = ten(nextDate.getMonth() + 1);
    const DD = ten(nextDate.getDate());
    const HH = ten(nextDate.getHours());
    const mm = ten(nextDate.getMinutes());
    return `${YYYY}-${MM}-${DD}T${HH}:${mm}`;
};


export function AiSessionForm() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<AiSessionFormValues>({
    resolver: zodResolver(aiSessionFormSchema) as Resolver<AiSessionFormValues>,
    defaultValues: {
      title: "",
      description: "",
      startTime: getNextValidSessionDate(),
      durationInMinutes: 90,
      capacity: 10,
      minCapacity: 6,
    },
  });

  function onSubmit(values: AiSessionFormValues) {
    startTransition(async () => {
      const result = await createAiSession(values);
      if (result?.error) {
        alert(result.error);
      } else {
        setIsOpen(false);
        form.reset();
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* UPDATE: Added classes for a more vibrant button style */}
        <Button className="bg-purple-600 text-white hover:bg-purple-700 font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
            <PlusCircle className="mr-2 h-4 w-4" /> Add AI Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create New AI Session</DialogTitle>
          <DialogDescription>
            Fill in the details for the new AI training session.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Introduction to AI - 101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the session's goals..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Start Time (Tuesday or Friday only)</FormLabel>
                    <FormControl>
                        <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
              />
            <div className="grid grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="durationInMinutes"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Duration (min)</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="minCapacity"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Min. Seats</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Max. Seats</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create AI Session
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
