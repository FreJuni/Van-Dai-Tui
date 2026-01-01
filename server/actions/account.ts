'use server'

import { actionClient } from "./safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { AccountSchema } from "@/types/account-schema";


export const AccountAction = actionClient
    .inputSchema(AccountSchema)
    .action(async ({ parsedInput: { address, phone_number } }) => {

        try {
            if (!address || !phone_number) return { error: "Something went wrong." }

            const checkAddressAlreadyExistOrNot = await db.query.users.findFirst({
                where: eq(users.address, address)
            })
            if (!checkAddressAlreadyExistOrNot) return { error: "Address doesn't exist." }

            await db.update(users).set({
                address: address,
                phone_number: phone_number
            }).where(eq(users.address, address));

            return {
                success: "Account Updated Successfully."
            }
        } catch (error) {
            return {
                error: "Something went wrong."
            }
        }

    })