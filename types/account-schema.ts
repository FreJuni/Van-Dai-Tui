

import z from "zod";

export const AccountSchema = z.object({
    phone_number: z.string().min(8, {
        message: "Please enter phone number."
    }),
    address: z.string().min(1, {
        message: "Please enter your address"
    }),
    name: z.string().optional(),
    password: z.string().optional(),
})