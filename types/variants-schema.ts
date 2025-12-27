import { z } from "zod";

export const VariantsSchema = z.object({
    productID: z.string(),
    id: z.string().optional(),
    name: z.string().min(3, { message: "Please enter at least 3 characters." }),
    editMode: z.boolean(),
    color: z.string().min(3, { message: "Please enter at least 3 characters." }),
    storages: z.array(z.object({
        storage: z.string().nonempty({ message: "Please enter storage." }),
        price: z.number().nonnegative({ message: "Please enter price." }),
    })),
    variantImages: z.array(z.object({
        url: z.string().url({ message: "Please enter a valid url." }),
        name: z.string(),
        size: z.number(),
        key: z.string().optional(),
        id: z.number().optional(),
    })).min(1, { message: "Please select at least one image." })
})