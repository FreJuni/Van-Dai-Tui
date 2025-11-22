import z from "zod";

export const ImageUploadSchema = z.object({
    userId: z.string(),
    image: z.string().url({
        message: "Please input a valid url."
    })
})

export const UserNameSchema = z.object({
    name: z.string(),
    userId: z.string(),
})