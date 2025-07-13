import { z } from "zod";

export const sessionFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long.",
  }),
  description: z.string().optional(),
  proficiencyLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  startTime: z.string().refine((val) => val && !isNaN(Date.parse(val)), {
    message: "A valid start date and time is required.",
  }),
  endTime: z.string().refine((val) => val && !isNaN(Date.parse(val)), {
    message: "A valid end date and time is required.",
  }),
  // FIX: Define capacity directly as a number. The conversion from the input's
  // string value will be handled explicitly in the form component.
  capacity: z.number().int().positive({
    message: "Capacity must be a positive number.",
  }),
}).refine(data => new Date(data.endTime) > new Date(data.startTime), {
    message: "End time must be after the start time.",
    path: ["endTime"],
});

export type SessionFormValues = z.infer<typeof sessionFormSchema>;


// --- Material Form Schema (No changes needed here) ---
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

export const materialFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  sessionId: z.string().uuid("Please select a valid session."),
  type: z.enum(['file', 'link']),
  url: z.string().optional(),
  file: z.any().optional(),
}).refine(data => {
    if (data.type === 'link') {
        return !!data.url && z.string().url().safeParse(data.url).success;
    }
    return true;
}, {
    message: "A valid URL is required for links.",
    path: ["url"],
}).refine(data => {
    if (data.type === 'file') {
        return !!data.file && data.file.size > 0;
    }
    return true;
}, {
    message: "A file is required for file uploads.",
    path: ["file"],
}).refine(data => {
    if (data.type === 'file' && data.file) {
        return data.file.size <= MAX_FILE_SIZE;
    }
    return true;
}, {
    message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    path: ["file"],
}).refine(data => {
    if (data.type === 'file' && data.file) {
        return ACCEPTED_FILE_TYPES.includes(data.file.type);
    }
    return true;
}, {
    message: "Only .pdf files are accepted.",
    path: ["file"],
});

export type MaterialFormValues = z.infer<typeof materialFormSchema>;
