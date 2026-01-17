'use server';

import { actionClient } from '@/server/actions/safe-action';
import { db } from '@/server';
import { discounts } from '@/server/schema';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

const discountSchema = z.object({
  id: z.string().optional(),
  minPrice: z.number().min(0),
  maxPrice: z.number().min(0),
  discount: z.number().min(0),
  startDate: z.date(),
  endDate: z.date(),
});

type DiscountInput = z.infer<typeof discountSchema>;

export const getDiscounts = async () => {
  return await db.query.discounts.findMany({
    orderBy: (discounts, { desc }) => [desc(discounts.createdAt)],
  });
};

export const createDiscount = actionClient
  .schema(discountSchema)
  .action(async ({ parsedInput }: { parsedInput: DiscountInput }) => {
    try {
      await db.insert(discounts).values({
        ...parsedInput,
        id: createId(),
      });
      revalidatePath('/dashboard/discounts');
      return { success: true };
    } catch (error) {
      return { error: 'Failed to create discount' };
    }
  });

export const updateDiscount = actionClient
  .schema(discountSchema)
  .action(async ({ parsedInput }: { parsedInput: DiscountInput }) => {
    if (!parsedInput.id) return { error: 'Missing ID' };
    try {
      await db
        .update(discounts)
        .set(parsedInput)
        .where(eq(discounts.id, parsedInput.id));
      revalidatePath('/dashboard/discounts');
      return { success: true };
    } catch (error) {
      return { error: 'Failed to update discount' };
    }
  });

export const deleteDiscount = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput }: { parsedInput: { id: string } }) => {
    try {
      await db.delete(discounts).where(eq(discounts.id, parsedInput.id));
      revalidatePath('/dashboard/discounts');
      return { success: true };
    } catch (error) {
      return { error: 'Failed to delete discount' };
    }
  });
