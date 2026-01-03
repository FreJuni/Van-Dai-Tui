import { eq } from "drizzle-orm";
import { db } from "..";
import { orderProducts, orders, users } from "../schema";

interface OrderCreateProps {
    userId: string;
    quantity: number;
    totalPrice: number;
    orderItems: {
        productId: string;
        productVariantId: string;
    }[];
}

export const OrderCreate = async ({userId, quantity, totalPrice, orderItems}: OrderCreateProps) => {
    try {
        if(!userId || !quantity || !totalPrice || !orderItems) {
            return { error: "Missing required fields" };
        }

        const checkUser = await db.query.users.findFirst({
            where: eq(users.id, userId)
        })
        if(!checkUser) {
            return { error: "User not found" };
        }

        // create order 
        const order = await db.insert(orders).values({
            userId,
            quantity,
            totalPrice,
        }).returning();

        // create order items
        if(order.length > 0) {
           orderItems.map(async (orderItem) => {
            await db.insert(orderProducts).values({
                orderId: order[0].id,
                productId: orderItem.productId,
                productVariantId: orderItem.productVariantId,
            })
           }) 
        }

        return { success: "Order created successfully", order };
    } catch (error) {
        console.log(error);
        return { error: "Something went wrong" };
    }
}