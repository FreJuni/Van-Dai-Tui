'use server';

import { db } from '@/server';
import { locations } from '@/server/schema';
import { actionClient } from '@/server/actions/safe-action';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const locationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  openingHours: z.string().min(1, 'Opening hours are required'),
  googleMapsEmbed: z.string().min(1, 'Google Maps embed HTML is required'),
});

export const addLocation = actionClient
  .schema(locationSchema)
  .action(async ({ parsedInput }) => {
    const result = await db.insert(locations).values(parsedInput).returning();
    revalidatePath('/dashboard/locations');
    revalidatePath('/contact');
    return { success: true, location: result[0] };
  });

export const updateLocation = actionClient
  .schema(locationSchema.extend({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const { id, ...data } = parsedInput;
    const result = await db
      .update(locations)
      .set(data)
      .where(eq(locations.id, id))
      .returning();
    revalidatePath('/dashboard/locations');
    revalidatePath('/contact');
    return { success: true, location: result[0] };
  });

export const deleteLocation = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const result = await db
      .delete(locations)
      .where(eq(locations.id, parsedInput.id))
      .returning();
    revalidatePath('/dashboard/locations');
    revalidatePath('/contact');
    return { success: true, location: result[0] };
  });

export const getLocations = async () => {
  return await db.query.locations.findMany({
    orderBy: (locations, { desc }) => [desc(locations.createdAt)],
  });
};
