import { and, eq, gte, lte } from 'drizzle-orm';
import { discounts, products } from '../schema';
import { db } from '@/server';

export const listingData = async (productId: string, price?: number) => {
  const now = new Date();
  const activeDiscounts = await db.query.discounts.findMany({
    where: and(lte(discounts.startDate, now), gte(discounts.endDate, now)),
  });

  const data = await db.query.products.findFirst({
    where: eq(products.id, productId),
    with: {
      productVariant: {
        with: {
          productVariantOption: true,
          productVariantColor: true,
          productVariantImage: true,
          productVariantCondition: true,
        },
      },
    },
  });

  const productPrice =
    price || data?.productVariant[0]?.productVariantOption[0]?.price!;

  console.log(productId, price);

  const applicableDiscounts = activeDiscounts.find((discount) => {
    return (
      productPrice >= discount.minPrice && productPrice <= discount.maxPrice
    );
  });

  return {
    productData: data,
    discount: applicableDiscounts
      ? {
          discount: applicableDiscounts.discount,
          finalPrice:
            productPrice - (productPrice * applicableDiscounts.discount) / 100,
          startDate: applicableDiscounts.startDate,
          endDate: applicableDiscounts.endDate,
        }
      : null,
  };
};
