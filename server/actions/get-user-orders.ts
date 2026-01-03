"use server"

import { auth } from "@/server/auth";
import { db } from "@/server";
import { orders } from "@/server/schema";
import { eq, and, count, desc } from "drizzle-orm";

export const getUserOrders = async (page = 1, limit = 6) => {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return { error: "Unauthorized" };
        }

        const offset = (page - 1) * limit;

        // Get total count for pagination
        const totalOrders = await db.select({ count: count() })
            .from(orders)
            .where(eq(orders.userId, session.user.id));
        
        const totalPages = Math.ceil(totalOrders[0].count / limit);

        const userOrders = await db.query.orders.findMany({
            where: eq(orders.userId, session.user.id),
            with: {
                orderProducts: {
                    with: {
                        productVariant: {
                            with: {
                                productVariantImage: true,
                                productVariantColor: true,
                                productVariantOption: true
                            }
                        },
                        products: true
                    }
                }
            },
            orderBy: (orders, { desc }) => [desc(orders.createdAt)],
            limit: limit,
            offset: offset,
        });

        return { success: userOrders, totalPages, currentPage: page };
    } catch (error) {
        console.error(error);
        return { error: "Failed to fetch orders" };
    }
}

export const getOrder = async (orderId: string) => {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return { error: "Unauthorized" };
        }

        const order = await db.query.orders.findFirst({
            where: and(
                eq(orders.id, orderId),
                eq(orders.userId, session.user.id)
            ),
            with: {
                user: {
                    columns: {
                        id: true,
                        name: true,
                        address: true,
                        phone_number: true,
                    }
                },
                orderProducts: {
                    with: {
                        productVariant: {
                            with: {
                                productVariantImage: true,
                                productVariantColor: true,
                                productVariantOption: true
                            }
                        },
                        products: true
                    }
                }
            }
        });

        if (!order) {
            return { error: "Order not found" };
        }

        return { success: order };
    } catch (error) {
        console.error(error);
        return { error: "Failed to fetch order details" };
    }
}
