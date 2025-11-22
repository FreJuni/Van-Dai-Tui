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
    .action(async ({ parsedInput: { email, password } }) => {

        try {
            if (!email || !password) return { error: "Please fill all the fields." }

            const checkUserExistOrNot = await db.query.users.findFirst({
                where: eq(users.email, email)
            })

            if (!checkUserExistOrNot) return { error: "Please check your credentials." }

            const checkPasswordSameOrNot = await bcrypt.compare(password, checkUserExistOrNot.password!)
            if (!checkPasswordSameOrNot) return { error: "Please check your credentials." }


            await signIn('credentials', {
                email,
                password,
                redirect: false
            })

            revalidatePath('/');
            return {
                success: "Login Successfully."
            }

        } catch (error) {
            console.log(error);

            return {
                error: "Something went wrong."
            }
        }
    })