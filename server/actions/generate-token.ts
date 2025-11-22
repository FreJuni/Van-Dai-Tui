import { db } from "..";
import { generatePasswordResetToken } from "../schema";

type generatePasswordResetProps = {
    userId: string;
}

export const generatePasswordToken = async ({ userId }: generatePasswordResetProps) => {
    try {
        const token = Date.now() + 1000 * 60 * 15; // 15 minutes validity

        return await db.insert(generatePasswordResetToken).values({
            userId: userId,
            token: token.toString(),
        }).returning();

    } catch (error) {
        console.log(error);
    }

};