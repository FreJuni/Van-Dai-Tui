import z from "zod";

export const ProductSchema = z.object({
    title: z.string().min(5, {
        message: "Please enter at least 10 character."
    }),
    description: z.string().min(20, {
        message: "Please enter at least 20 character."
    }),
    productId: z.string().optional(),
    category: z.enum(['Phones', 'Tablets', 'Laptops', 'Others']),
    brand: z.enum(['Apple', 'Samsung', 'Xiaomi', 'Dell', 'HP', 'Lenovo', 'Asus', 'Others']),
})

export const ProductSchemaInput = z.object({
    productId: z.string(),
})

export const DeleteProductSchema = z.object({
    productId: z.string(),
})