import z, { email } from "zod";

export const LoginSchema = z.object({
    phone_number: z.string().min(8, {
        error: "Please enter your phone number."
    }),
    password: z.string().min(6, {
        error: "Please enter at least 6 character."
    })
})
