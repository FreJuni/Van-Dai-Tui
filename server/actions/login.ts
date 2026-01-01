'use server'

import { LoginSchema } from "@/types/login-schema";
import { actionClient } from "./safe-action";
import bcrypt from 'bcrypt';
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { signIn } from "../auth";
import { revalidatePath } from "next/cache";

export const LoginAction = actionClient
    .inputSchema(LoginSchema)
    .action(async ({ parsedInput: { phone_number, password } }) => {

        try {
            if (!phone_number || !password) return { error: "Please fill all the fields." }

            const checkUserExistOrNot = await db.query.users.findFirst({
                where: eq(users.phone_number, phone_number)
            })

            if (!checkUserExistOrNot) return { error: "Please check your credentials." }

            const checkPasswordSameOrNot = await bcrypt.compare(password, checkUserExistOrNot.password!)
            if (!checkPasswordSameOrNot) return { error: "Please check your credentials." }


            await signIn('credentials', {
                phone_number,
                password,
                redirect: false,
            })

            revalidatePath('/')
            return {
                success: "Login Successfully.",
                role: checkUserExistOrNot.role
            }

        } catch (error) {
            console.log(error);

            return {
                error: "Something went wrong."
            }
        }
    })