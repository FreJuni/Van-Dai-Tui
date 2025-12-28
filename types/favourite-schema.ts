import z from "zod";


export const FavouriteSchema = z.object({
    userId: z.string(),
    productId: z.string()
})