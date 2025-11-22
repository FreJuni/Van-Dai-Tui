'use server'

import { actionClient } from "./safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { AccountSchema } from "@/types/account-schema";


export const AccountAction = actionClient
    .inputSchema(AccountSchema)
    .action(async ({ parsedInput: { email, phone_number } }) => {

        try {
            if (!email || !phone_number) return { error: "Something went wrong." }

            const checkEmailAlreadyExistOrNot = await db.query.users.findFirst({
                where: eq(users.email, email)
            })
            if (!checkEmailAlreadyExistOrNot) return { error: "Email doesn't exist." }

            await db.update(users).set({
                email: email,
                phone_number: phone_number
            }).where(eq(users.email, email));

            return {
                success: "Account Updated Successfully."
            }
        } catch (error) {
            return {
                error: "Something went wrong."
            }
        }

    })