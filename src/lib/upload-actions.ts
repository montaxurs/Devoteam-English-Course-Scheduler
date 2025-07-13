"use server";

import { put } from '@vercel/blob';
import { customAlphabet } from 'nanoid';
import { revalidatePath } from 'next/cache';

// Creates a unique, random filename
const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
);

/**
 * Uploads a file to Vercel Blob storage.
 * @param formData The FormData object containing the file to upload.
 * @returns An object with either the blob URL on success or an error message.
 */
export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;

  if (!file) {
    return { error: 'No file provided.' };
  }

  const filename = `${nanoid()}-${file.name}`;

  try {
    const blob = await put(filename, file, {
      access: 'public',
    });

    // Revalidate the path to show the new material immediately
    revalidatePath('/manage-materials');

    return { success: 'File uploaded successfully.', blob };
  } catch (error) {
    if (error instanceof Error) {
        return { error: `Upload Error: ${error.message}` };
    }
    return { error: 'An unknown error occurred during upload.' };
  }
}
