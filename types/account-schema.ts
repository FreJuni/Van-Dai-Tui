

import z from "zod";

export const AccountSchema = z.object({
    phone_number: z.string().min(8, {
        message: "Please enter phone number."
    }),
    email: z.string().email({
        message: "Please enter a valid email"
    }),
    name: z.string().optional(),
    password: z.string().optional(),
})