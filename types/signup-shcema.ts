import z from "zod";

export const SignupSchema = z.object({
    name: z.string().min(3, {
        message: "Please enter at least 3 character."
    }),
    address: z.string().min(1, {
        message: "Please enter your address"
    }),
    password: z.string().min(6, {
        message: "Please enter at least 6 character."
    }),
    phone_number: z.string().min(8, {
        message: "Please enter phone number."
    })
})