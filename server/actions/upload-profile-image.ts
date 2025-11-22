'use server'

import { actionClient } from "./safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { ImageUploadSchema, UserNameSchema } from "@/types/upload-profile-form-schema";
import { users } from "../schema";
import { revalidatePath } from "next/cache";

export const UploadImageAction = actionClient
    .inputSchema(ImageUploadSchema)
    .action(async ({ parsedInput: { userId, image } }) => {

        try {
            if (!userId || !image) return { error: "Something went wrong." }

            const checkUserExistOrNot = await db.query.users.findFirst({
                where: eq(users.id, userId)
            })
            if (!checkUserExistOrNot) return { error: "Something went wrong." }

            await db.update(users).set({
                image: image
            })
                .where(eq(users.id, userId))

            revalidatePath('/profile');
            return {
                success: "Upload image Successfully."
            }

        } catch (error) {
            return {
                error: "Something went wrong."
            }
        }
    })

export const UpdateUsernameAction = actionClient
    .inputSchema(UserNameSchema)
    .action(async ({ parsedInput: { name, userId } }) => {

        try {
            if (!name) return { error: "Something went wrong." }

            const checkUserExistOrNot = await db.query.users.findFirst({
                where: eq(users.id, userId)
            })
            if (!checkUserExistOrNot) return { error: "Something went wrong." }

            await db.update(users).set({
                name: name
            })
                .where(eq(users.id, userId))

            revalidatePath('/profile');
            return {
                success: "Update name Successfully."
            }

        } catch (error) {
            return {
                error: "Something went wrong."
            }
        }
    })