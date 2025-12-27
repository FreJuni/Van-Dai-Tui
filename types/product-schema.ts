import z from "zod";

export const ProductSchema = z.object({
    title: z.string().min(5, {
        message: "Please enter at least 10 character."
    }),
    description: z.string().min(20, {
        message: "Please enter at least 20 character."
    }),
    price: z.number().min(1, {
        message: "Price must be at least 1."
    }),
    type: z.enum(['Phone', 'Tablet', 'Laptop', 'Other']),
    productId: z.string().optional(),
    category: z.string().nonempty(),
    brand: z.string().nonempty(),
})

export const ProductSchemaInput = z.object({
    productId: z.string(),
})

export const DeleteProductSchema = z.object({
    productId: z.string(),
})