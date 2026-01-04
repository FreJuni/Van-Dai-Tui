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
    .action(async () => {
        return { error: "Feature unavailable" }
    })