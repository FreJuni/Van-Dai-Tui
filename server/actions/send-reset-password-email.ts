"use server";

import { EmailSchema } from "@/types/email-shcema";
import { actionClient } from "./safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generatePasswordToken } from "./generate-token";
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendResetPasswordEmail = actionClient
    .inputSchema(EmailSchema)
    .action(async ({ parsedInput: { email } }) => {
        try {
            const isExistedUser = await db.query.users.findFirst({
                where: eq(users.email, email),
            })

            if (!isExistedUser) {
                return { error: 'Email does not exist' }
            }

            const generateToken = await generatePasswordToken({ userId: isExistedUser.id });

            const resetLink = `${process.env.BASE_URL}/auth/reset-password?token=${generateToken?.[0].token}`;

            const msg = {
                to: email,
                from: process.env.SENDER_EMAIL,
                subject: "Reset Your VanDaiTuiWebsite Password",
                text: `Hi , this email to reset your VanDaiTuiWebsite password.`,
                html: `
                        <p>We received a request to reset your password for your <b>VanDaiTuiWebsite</b> account.</p>

                        <p style="margin-top: 16px;">
                        <a 
                            href="${resetLink}" 
                            style="background: #0066ff; color: white; padding: 12px 18px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                            Reset Password
                        </a>
                        </p>

                        <p>If the button does not work, copy and paste the link below into your browser:</p>

                        <p>If you did not request a password reset, you can safely ignore this email.</p>

                        <p>Thanks,<br>The VanDaiTuiWebsite Team</p>
                        `,
            }


            await sgMail.send(msg);

            return {
                success: "Please goes to your email to reset your password: "
            }

        } catch (error) {
            console.log(error);
            return { error: 'An error occurred', success: "" }
        }
    })