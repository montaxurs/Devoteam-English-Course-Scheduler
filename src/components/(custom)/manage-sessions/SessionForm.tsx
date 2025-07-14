"use client";

import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sessionFormSchema, type SessionFormValues } from "@/lib/schemas";
import { createSession } from "@/lib/actions";
import { Button } from "@/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Import RadioGroup
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

// Helper function to format a date for the datetime-local input
const toDateTimeLocal = (date: Date) => {
  const ten = (i: number) => (i < 10 ? '0' : '') + i;
  const YYYY = date.getFullYear();
  const MM = ten(date.getMonth() + 1);
  const DD = ten(date.getDate());
  const HH = ten(date.getHours());
  const mm = ten(date.getMinutes());
  return `${YYYY}-${MM}-${DD}T${HH}:${mm}`;
};

export function SessionForm() {
  const [isPending, startTransition] = useTransition();

  const defaultStartTime = new Date();
  defaultStartTime.setDate(defaultStartTime.getDate() + 1);
  defaultStartTime.setHours(10, 0, 0, 0);

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema) as Resolver<SessionFormValues>,
    defaultValues: {
      title: "",
      description: "",
      proficiencyLevel: undefined,
      startTime: toDateTimeLocal(defaultStartTime),
      endTime: toDateTimeLocal(new Date(defaultStartTime.getTime() + 60 * 60 * 1000)),
      capacity: 10,
    },
  });

  function onSubmit(values: SessionFormValues) {
    startTransition(async () => {
      const result = await createSession(values);
      if (result?.error) {
        alert(result.error);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Session</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Advanced Business English" {...field} />
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
                    <Textarea placeholder="Describe the session's goals and topics..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* FIX: Replaced Select with RadioGroup for Proficiency Level */}
            <FormField
              control={form.control}
              name="proficiencyLevel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Proficiency Level</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-6"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl><RadioGroupItem value="beginner" /></FormControl>
                        <FormLabel className="font-normal">Beginner</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl><RadioGroupItem value="intermediate" /></FormControl>
                        <FormLabel className="font-normal">Intermediate</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl><RadioGroupItem value="advanced" /></FormControl>
                        <FormLabel className="font-normal">Advanced</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(event) => field.onChange(Number(event.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
               <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Session
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
