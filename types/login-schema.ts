import z, { email } from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        error: "Please enter a valid email."
    }),
    password: z.string().min(6, {
        error: "Please enter at least 6 character."
    })
})
