'use server';

import { auth } from '@/server/auth';
import { db } from '@/server';
import { orders, users } from '@/server/schema';
import { eq, and, desc, count, sql, or, like, gte, lte } from 'drizzle-orm';

export type OrderFilters = {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
};

export const getAllOrders = async (
  page = 1,
  limit = 10,
  filters: OrderFilters = {}
) => {
  try {
    const session = await auth();

    // Admin-only access
    if (!session || !session.user || session.user.role !== 'admin') {
      return { error: 'Unauthorized - Admin access required' };
    }

    const offset = (page - 1) * limit;

    // Build where conditions based on filters
    const conditions = [];

    if (filters.status) {
      if (
        ['Pending', 'Shipped', 'Delivered', 'Cancelled', 'Completed'].includes(
          filters.status as any
        )
      ) {
        conditions.push(eq(orders.status, filters.status as any));
      } else {
        // optional: ignore or throw error if invalid enum
        console.warn('Invalid order status filter:', filters.status);
      }
    }

    if (filters.dateFrom) {
      conditions.push(gte(orders.createdAt, new Date(filters.dateFrom)));
    }

    if (filters.dateTo) {
      conditions.push(lte(orders.createdAt, new Date(filters.dateTo)));
    }

    // Search by order ID (partial match)
    if (filters.searchQuery) {
      conditions.push(eq(orders.id, filters.searchQuery));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count for pagination
    const totalOrders = await db
      .select({ count: count() })
      .from(orders)
      .where(whereClause);

    const totalPages = Math.ceil(totalOrders[0].count / limit);

    // Fetch orders with user information
    const allOrders = await db.query.orders.findMany({
      where: whereClause,
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            address: true,
            phone_number: true,
          },
        },
        orderProducts: {
          with: {
            productVariant: {
              with: {
                productVariantImage: true,
                productVariantColor: true,
                productVariantOption: true,
              },
            },
            products: true,
          },
        },
      },
      orderBy: [desc(orders.createdAt)],
      limit: limit,
      offset: offset,
    });

    return {
      success: allOrders,
      totalPages,
      currentPage: page,
      totalCount: totalOrders[0].count,
    };
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return { error: 'Failed to fetch orders' };
  }
};

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    const session = await auth();

    // Admin-only access
    if (!session || !session.user || session.user.role !== 'admin') {
      return { error: 'Unauthorized - Admin access required' };
    }

    // Validate status
    const validStatuses = [
      'Pending',
      'Shipped',
      'Delivered',
      'Cancelled',
      'Completed',
    ];
    if (!validStatuses.includes(newStatus)) {
      return { error: 'Invalid status value' };
    }

    // Update the order status
    const updatedOrder = await db
      .update(orders)
      .set({ status: newStatus as any })
      .where(eq(orders.id, orderId))
      .returning();

    if (!updatedOrder || updatedOrder.length === 0) {
      return { error: 'Order not found' };
    }

    return { success: updatedOrder[0] };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { error: 'Failed to update order status' };
  }
};

export const getAdminOrder = async (orderId: string) => {
  try {
    const session = await auth();

    // Admin-only access
    if (!session || !session.user || session.user.role !== 'admin') {
      return { error: 'Unauthorized - Admin access required' };
    }

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            address: true,
            phone_number: true,
          },
        },
        orderProducts: {
          with: {
           productVariant : {
            with : {
             productVariantImage : true,
             productVariantColor : true,
             productVariantOption : true,
            }
           },
            products: true,
          },
        },
      },
    });

    if (!order) {
      return { error: 'Order not found' };
    }

    return { success: order };
  } catch (error) {
    console.error('Error fetching admin order:', error);
    return { error: 'Failed to fetch order details' };
  }
};
