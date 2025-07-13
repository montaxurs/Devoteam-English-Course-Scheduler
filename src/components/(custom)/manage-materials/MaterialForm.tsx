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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTransition } from "react";
import { Loader2, PlusCircle } from "lucide-react";
import { type SelectSession } from "@/schema";

type MaterialFormProps = {
  sessions: SelectSession[];
};

export function MaterialForm({ sessions }: MaterialFormProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, startTransition] = useTransition();
  
  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialFormSchema),
    // FIX: Provide default values for ALL form fields to prevent uncontrolled input error.
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

      // If the user selected 'file', upload it to Vercel Blob first.
      if (values.type === 'file' && values.file) {
        const formData = new FormData();
        formData.append('file', values.file);
        
        const uploadResult = await uploadFile(formData);

        if (uploadResult.error || !uploadResult.blob) {
          alert(uploadResult.error || "A critical error occurred during file upload.");
          return;
        }
        // Use the REAL URL from Vercel Blob.
        finalUrl = uploadResult.blob.url;
      }

      // Now, call the database action with the correct, final URL.
      const dbResult = await createCourseMaterial({
        ...values,
        url: finalUrl, // FIX: Pass the real URL to the database action.
        file: undefined, // We don't need to pass the file object to this action.
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
            <FormField
              control={form.control}
              name="sessionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Associate with Session</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a session" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {sessions.map(s => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
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
                            type="file"
                            accept=".pdf"
                            onChange={(event) => onChange(event.target.files && event.target.files[0])}
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
