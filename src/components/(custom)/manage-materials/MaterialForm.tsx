"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { materialFormSchema, type MaterialFormValues } from "@/lib/schemas";
import { createCourseMaterial } from "@/lib/actions";
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
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTransition } from "react";
import { Loader2, PlusCircle, ChevronsUpDown } from "lucide-react";
import { type SelectSession } from "@/schema";
import { cn } from "@/lib/utils";

type MaterialFormProps = {
  sessions: SelectSession[];
};

export function MaterialForm({ sessions }: MaterialFormProps) {
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

  async function onSubmit(values: MaterialFormValues) {
    startTransition(async () => {
      let finalUrl = values.url;

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

      if (!finalUrl) {
          alert("A URL or file is required.");
          return;
      }

      const dbResult = await createCourseMaterial({
        title: values.title,
        sessionId: values.sessionId,
        type: values.type,
        url: finalUrl,
      });
      
      if (dbResult?.error) {
        alert(dbResult.error);
      } else {
        setIsOpen(false);
        form.reset();
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Material</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Course Material</DialogTitle>
          <DialogDescription>Upload a file or add a link to share.</DialogDescription>
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
            
            {/* FIX: Replaced Select with DropdownMenu */}
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
                            ? sessions.find(
                                (session) => session.id === field.value
                              )?.title
                            : "Select a session"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                      {sessions.map((session) => (
                        <DropdownMenuItem
                          key={session.id}
                          onSelect={() => {
                            form.setValue("sessionId", session.id);
                          }}
                        >
                          {session.title}
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
