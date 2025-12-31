import z from "zod";

export const QuerySearchSchema = z.object({
    query : z.string().min(1).max(100)
})