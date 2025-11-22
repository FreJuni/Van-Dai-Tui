import z from "zod";

export const EmailSchema = z.object({
    email: z.string().email({
        error: "Please enter a valid email."
    }),
})

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Please enter at least 6 character."
    }),
    confirm_password: z.string().min(6, {
        message: "Confirm Password must be at least 6 characters long."
    }),
    token: z.string(),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
});