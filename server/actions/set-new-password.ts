"use server";

import { NewPasswordSchema } from "@/types/email-shcema";
import { actionClient } from "./safe-action";
import bcrypt from 'bcrypt';
import { db } from "..";
import { eq } from "drizzle-orm";
import { generatePasswordResetToken, users } from "../schema";
import { revalidatePath } from "next/cache";

export const SetNewPassword = actionClient
    .inputSchema(NewPasswordSchema)
    .action(async ({ parsedInput: { password, confirm_password, token } }) => {
        try {

            if (!password || !confirm_password || !token) return { error: "All fields are required." };
            const hashPassword = await bcrypt.hash(password, 10);

            const checkToken = await db.query.generatePasswordResetToken.findFirst({
                where: eq(generatePasswordResetToken.token, token)
            })

            if (!checkToken) return { error: "Invalid or expired token." };

            const checkExpiredToken = new Date() > new Date(checkToken.token);

            if (checkExpiredToken) return { error: "Token has expired." };

            await db.update(users).set({
                password: hashPassword
            }).where(
                eq(users.id, checkToken.userId)
            )

            await db.delete(generatePasswordResetToken).where(
                eq(generatePasswordResetToken.userId, checkToken.userId)
            )

            revalidatePath('/auth/login');
            return {
                success: "Password has been reset successfully.",
                error: null
            }
        } catch (error) {
            return { error: 'Something went wrong. Please try again later.', success: null }
        }
    })