'use server';

import { db } from '@/server';
import { contactMessages } from '@/server/schema';
import { actionClient } from '@/server/actions/safe-action';
import * as z from 'zod';
import { revalidatePath } from 'next/cache';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

export const sendContactMessage = actionClient
  .schema(contactSchema)
  .action(async ({ parsedInput }) => {
    try {
      await db.insert(contactMessages).values(parsedInput);

      // Here you could also add email notification logic
      // e.g., await sendEmail(...)

      revalidatePath('/dashboard/messages'); // Future-proofing
      return { success: true };
    } catch (error) {
      console.error('Error sending contact message:', error);
      return { success: false, error: 'Failed to send message' };
    }
  });
