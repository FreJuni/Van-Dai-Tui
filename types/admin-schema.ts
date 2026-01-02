import z from "zod";


export const deleteUserSchema = z.object({
    userId : z.string().min(1, 'User ID is required')
})