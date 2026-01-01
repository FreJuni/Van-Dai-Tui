"use server";

import { db } from "..";
import { users } from "../schema";
import { eq, count, ilike, or, and } from "drizzle-orm";
import { auth } from "../auth";
import { revalidatePath } from "next/cache";
import { actionClient } from "./safe-action";
import { z } from "zod";

const DeleteUserSchema = z.object({
    userId: z.string()
});

const UpdateRoleSchema = z.object({
    userId: z.string(),
    role: z.enum(['user', 'admin'])
});

export const fetchAllUsers = async (page: number = 1, pageSize: number = 10, search?: string) => {
    const session = await auth();
    if (session?.user?.role !== 'admin') return { items: [], totalCount: 0 };

    const offset = (page - 1) * pageSize;

    try {
        const filters = search ? 
            or(
                ilike(users.name, `%${search}%`),
                ilike(users.phone_number, `%${search}%`)
            ) : undefined;

        const [items, total] = await Promise.all([
            db.query.users.findMany({
                where: filters,
                limit: pageSize,
                offset: offset,
                orderBy: (users, { desc }) => [desc(users.id)]
            }),
            db.select({ value: count() }).from(users).where(filters)
        ]);

        return {
            items,
            totalCount: total[0]?.value || 0
        };
    } catch (error) {
        console.error(error);
        return { items: [], totalCount: 0 };
    }
};

export const deleteUser = actionClient
    .inputSchema(DeleteUserSchema)
    .action(async ({ parsedInput: { userId } }) => {
        const session = await auth();
        if (session?.user?.role !== 'admin') return { error: "Unauthorized" };

        try {
            await db.delete(users).where(eq(users.id, userId));
            revalidatePath('/dashboard/users');
            return { success: "User deleted successfully" };
        } catch (error) {
            return { error: "Failed to delete user" };
        }
    });

export const updateUserRole = actionClient
    .inputSchema(UpdateRoleSchema)
    .action(async ({ parsedInput: { userId, role } }) => {
        const session = await auth();
        if (session?.user?.role !== 'admin') return { error: "Unauthorized" };

        try {
            await db.update(users).set({ role }).where(eq(users.id, userId));
            revalidatePath('/dashboard/users');
            return { success: `User role updated to ${role}` };
        } catch (error) {
            return { error: "Failed to update user role" };
        }
    });
