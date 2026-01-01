'use server'

import { SignupSchema } from "@/types/signup-shcema";
import { actionClient } from "./safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import bcrypt from 'bcrypt';
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


export const RegisterAction = actionClient
    .inputSchema(SignupSchema)
    .action(async ({ parsedInput: { name, address, password, phone_number } }) => {

        try {
            if (!name || !address || !password || !phone_number) return { error: "Something went wrong." }

            const checkPhoneAlreadyExistOrNot = await db.query.users.findFirst({
                where: eq(users.phone_number, phone_number)
            })
            if (checkPhoneAlreadyExistOrNot) return { error: "Phone number already existed." }

            const hashPassword = await bcrypt.hash(password, 10);

            await db.insert(users).values({
                name: name,
                address: address,
                password: hashPassword,
                phone_number: phone_number
            }).returning();

            return {
                success: "Register Account Successfully."
            }
        } catch (error) {
            return {
                error: "Something went wrong."
            }
        }

    })