"use server";

import { db } from "..";
import { users } from "../schema";
import { eq, count, ilike, or, and } from "drizzle-orm";
import { auth } from "../auth";
import { revalidatePath } from "next/cache";
import { actionClient } from "./safe-action";
import { z } from "zod";

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

export const DeleteUserAction = async ({userId} : {userId : string}) => {
     try {
        if(!userId) return {error : 'User ID is required'}

        const checkUser = await db.query.users.findFirst({
            where : eq(users.id , userId)
        })

        if(!checkUser) return {error : 'User not found'}

        await db.delete(users).where(eq(users.id , userId))

        revalidatePath('/dashboard/users');
        return {success : 'User deleted successfully'}

    } catch (error) {
        return {
            error : 'Something went wrong'
        }
    }
}

export const ChangeRoleAction = async ({userId} : {userId : string}) => {
     try {
        if(!userId) return {error : 'User ID is required'}

        const checkUser = await db.query.users.findFirst({
            where : eq(users.id , userId)
        })

        if(!checkUser) return {error : 'User not found'}

        await db.update(users).set({role : checkUser.role === 'admin' ? 'user' : 'admin'}).where(eq(users.id , userId))

        revalidatePath('/dashboard/users');
        return {success : 'Update role successfully'}

    } catch (error) {
        return {
            error : 'Something went wrong'
        }
    }
}

