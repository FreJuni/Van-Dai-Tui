import z from "zod";

export const ProductSchema = z.object({
    title: z.string().min(10, {
        message: "Please enter at least 10 character."
    }),
    description: z.string().min(20, {
        message: "Please enter at least 20 character."
    }),
    price: z.number().min(1, {
        message: "Price must be at least 1."
    }),
})