'use server'

import { actionClient } from "./safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { auth } from "../auth";
import bcrypt from 'bcrypt';
import { ChangePasswordSchema } from "@/types/change-password-schema";

export const ChangePasswordAction = actionClient
    .inputSchema(ChangePasswordSchema)
    .action(async ({ parsedInput: { current_password, new_password, confirm_password } }) => {
        try {
            const session = await auth();

            if (!session?.user) {
                return { error: "You must be logged in to change your password." };
            }

            const currentUser = await db.query.users.findFirst({
                where: eq(users.id, session.user.id!)
            });

            if (!currentUser) {
                return { error: "User not found." };
            }

            if (!currentUser.password) {
                return { error: "This account uses OAuth login. Please set a password first." }; // Handling edge case for OAuth users
            }

            const passwordsMatch = await bcrypt.compare(current_password, currentUser.password);

            if (!passwordsMatch) {
                return { error: "Incorrect current password." };
            }

            const hashedPassword = await bcrypt.hash(new_password, 10);

            await db.update(users).set({
                password: hashedPassword
            }).where(eq(users.id, currentUser.id));

            return { success: "Password updated successfully." };

        } catch (error) {
            console.error("Change Password Error:", error);
            return { error: "Something went wrong while updating your password." };
        }
    });
