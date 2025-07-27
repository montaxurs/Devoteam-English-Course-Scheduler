"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { materialFormSchema, type MaterialFormValues } from "@/lib/schemas";
import { createCourseMaterial } from "@/lib/actions";
import { createAiCourseMaterial } from "@/lib/actions-ai"; // Import AI action
import { uploadFile } from "@/lib/upload-actions";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTransition } from "react";
import { Loader2, PlusCircle, ChevronsUpDown, BookText, BrainCircuit } from "lucide-react";
import { type SelectSession, type SelectAiSession } from "@/schema";
import { cn } from "@/lib/utils";

// The form now accepts both English and AI sessions
type MaterialFormProps = {
  englishSessions: SelectSession[];
  aiSessions: SelectAiSession[];
};

export function MaterialForm({ englishSessions, aiSessions }: MaterialFormProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, startTransition] = useTransition();
  
  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialFormSchema),
    defaultValues: {
      title: "",
      type: "link",
      sessionId: undefined,
      url: "",
      file: undefined,
    },
  });

  const materialType = form.watch("type");
  const selectedSessionId = form.watch("sessionId");

  // Helper to determine if the selected session is an AI session
  const isAiSession = aiSessions.some(s => s.id === selectedSessionId);

  async function onSubmit(values: MaterialFormValues) {
    startTransition(async () => {
      let finalUrl = values.url;

      // 1. Handle file upload if necessary
      if (values.type === 'file' && values.file) {
        const formData = new FormData();
        formData.append('file', values.file);
        
        const uploadResult = await uploadFile(formData);

        if (uploadResult.error || !uploadResult.blob) {
          alert(uploadResult.error || "A critical error occurred during file upload.");
          return;
        }
        finalUrl = uploadResult.blob.url;
      }

      if (!finalUrl || !values.sessionId) {
          alert("A session and either a URL or file are required.");
          return;
      }

      // 2. Call the correct server action based on session type
      let dbResult;
      if (isAiSession) {
        dbResult = await createAiCourseMaterial({
          title: values.title,
          aiSessionId: values.sessionId,
          type: values.type,
          url: finalUrl,
        });
      } else {
        dbResult = await createCourseMaterial({
          title: values.title,
          sessionId: values.sessionId,
          type: values.type,
          url: finalUrl,
        });
      }
      
      // 3. Handle the result
      if (dbResult?.error) {
        alert(dbResult.error);
      } else {
        setIsOpen(false);
        form.reset();
      }
    });
  }
  
  // Combine all sessions for the dropdown
  const allSessions = [
      ...englishSessions.map(s => ({...s, courseType: 'English'})),
      ...aiSessions.map(s => ({...s, courseType: 'AI'}))
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Material</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Course Material</DialogTitle>
          <DialogDescription>Upload a file or add a link to an English or AI session.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Title</FormLabel>
                  <FormControl><Input placeholder="e.g., Week 1 - Grammar PDF" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sessionId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Associate with Session</FormLabel>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground "
                          )}
                        >
                          {field.value
                            ? allSessions.find(s => s.id === field.value)?.title
                            : "Select a session"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                      <DropdownMenuLabel>English Courses</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {englishSessions.map((session) => (
                        <DropdownMenuItem
                          key={session.id}
                          onSelect={() => form.setValue("sessionId", session.id)}
                        >
                           <BookText className="mr-2 h-4 w-4 text-blue-500" /> {session.title}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuLabel className="pt-2">AI Courses</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {aiSessions.map((session) => (
                        <DropdownMenuItem
                          key={session.id}
                           onSelect={() => form.setValue("sessionId", session.id)}
                        >
                          <BrainCircuit className="mr-2 h-4 w-4 text-purple-500" /> {session.title}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Material Type</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="link" /></FormControl><FormLabel className="font-normal">Link</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="file" /></FormControl><FormLabel className="font-normal">File Upload</FormLabel></FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {materialType === 'link' && (
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {materialType === 'file' && (
              <FormField
                control={form.control}
                name="file"
                render={({ field: { onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>PDF File</FormLabel>
                    <FormControl>
                        <Input
                            {...fieldProps}
                            value={undefined}
                            type="file"
                            accept=".pdf"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              onChange(file);
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Material
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
