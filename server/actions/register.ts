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
    .action(async ({ parsedInput: { name, email, password, phone_number } }) => {

        try {
            if (!name || !email || !password || !phone_number) return { error: "Something went wrong." }

            const checkEmailAlreadyExistOrNot = await db.query.users.findFirst({
                where: eq(users.email, email)
            })
            if (checkEmailAlreadyExistOrNot) return { error: "Email already existed." }

            const hashPassword = await bcrypt.hash(password, 10);

            await db.insert(users).values({
                name: name,
                email: email,
                password: hashPassword,
                phone_number: phone_number
            }).returning();

            const msg = {
                to: email,
                from: process.env.SENDER_EMAIL,
                subject: "Welcome to VanDaiTuiWebsite!",
                text: `Hi ${name}, thanks for signing up for VanDaiTuiWebsite!`,
                html: `<p>Hi <strong>${name}</strong>,</p>
                        <p>Thanks for registering with <b>VanDaiTuiWebsite</b>. We're happy to have you!</p>
                        <p>You can now log in and start using our services.</p>`,
            };

            await sgMail.send(msg);

            return {
                success: "Register Account Successfully."
            }
        } catch (error) {
            return {
                error: "Something went wrong."
            }
        }

    })