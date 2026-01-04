import z from 'zod';

export const ChangePasswordSchema = z.object({
    current_password: z.string().min(6, { message: "Current password must be at least 6 characters long." }),
    new_password: z.string().min(6, { message: "New password must be at least 6 characters long." }),
    confirm_password: z.string().min(6, { message: "Confirm password must be at least 6 characters long." }),
}).refine((data) => data.new_password === data.confirm_password, {
    message: "New passwords do not match.",
    path: ["confirm_password"],
});
