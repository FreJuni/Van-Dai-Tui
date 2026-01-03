'use server'

import { actionClient } from "./safe-action";
import { db } from "..";
import { favouriteProduct, products, productVariant, productVariantColor, productVariantCondition, productVariantImage, productVariantOption, users } from "../schema";
import { and, eq, sql, ilike, inArray, gte, lte, desc, asc, count, or, exists } from "drizzle-orm";
import bcrypt from 'bcrypt';
import { DeleteProductSchema, ProductSchema } from "@/types/product-schema";
import { revalidatePath } from "next/cache";
import { VariantsSchema } from "@/types/variants-schema";
import { auth } from "../auth";
import { ProductsWithVariants, VariantsWithImagesTags } from "@/lib/infer-type";
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const fetchProduct = async (productId: string) => {
    try {
        const product = await db.query.products.findFirst({
            where: eq(products.id, productId)
        })

        if (!product) return { error: "Product not found." };

        return { product: product }
    } catch (error) {
        return { error: "Something went wrong." }
    }
}

export const fetchProductByFullId = async (productId: string): Promise<ProductsWithVariants | null> => {
    try {
        const product = await db.query.products.findFirst({
            where: eq(products.id, productId),
            with: {
                productVariant: {
                    with: {
                        productVariantOption: true,
                        productVariantColor: true,
                        productVariantImage: true,
                        productVariantCondition: true
                    }
                }
            }
        })
        return (product as ProductsWithVariants) || null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const fetchAllAdminProducts = async (page: number = 1, pageSize: number = 8, searchValue: string = ''): Promise<{ items: any[], totalCount: number }> => {
    try {
        const offset = (page - 1) * pageSize;
          const filters = searchValue ? 
                    or(
                        ilike(products.title, `%${searchValue}%`),
                        ilike(products.description, `%${searchValue}%`)
                    ) : undefined;
        

        const [items, total] = await Promise.all([
            db.query.products.findMany({
                limit: pageSize,
                offset: offset,
                with: {
                    productVariant: {
                        with: {
                            productVariantOption: true,
                            productVariantColor: true,
                            productVariantImage: true,
                            productVariantCondition: true
                        },
                        orderBy: (productVariant, { desc }) => [
                            desc(productVariant.createdAt)
                        ]
                    }
                },
                where : filters,
                orderBy: (products, { desc }) => [desc(products.createdAt)]
            }),
            db.select({ value: count() }).from(products)
        ]);

        return { 
            items, 
            totalCount: total[0]?.value || 0 
        };
    } catch (error) {
        console.log(error);
        return { items: [], totalCount: 0 };
    }
}

export const fetchAllProducts = async (params: {
    page?: number;
    pageSize?: number;
    q?: string;
    category?: string[];
    brand?: string[];
    minPrice?: number;
    maxPrice?: number;
    condition?: string[];
    sort?: string;
}) => {
    const session = await auth();
    const currentUser = session?.user;
    const { 
        page = 1, 
        pageSize = 8, 
        q, 
        category, 
        brand, 
        minPrice, 
        maxPrice, 
        condition, 
        sort 
    } = params;
    const offset = (page - 1) * pageSize;

    try {
        const filters: any[] = [];

        if (q) {
            filters.push(
                sql`(lower(${products.title}) LIKE ${'%' + q.toLowerCase() + '%'} OR lower(${products.description}) LIKE ${'%' + q.toLowerCase() + '%'})`
            );
        }

        if (category && category.length > 0) {
            filters.push(inArray(products.category, category as any));
        }

        if (brand && brand.length > 0) {
            filters.push(inArray(products.brand, brand as any));
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filters.push(
                exists(
                    db.select()
                        .from(productVariant)
                        .innerJoin(productVariantOption, eq(productVariant.id, productVariantOption.productVariantId))
                        .where(
                            and(
                                eq(productVariant.productId, products.id),
                                minPrice !== undefined ? gte(productVariantOption.price, minPrice) : undefined,
                                maxPrice !== undefined ? lte(productVariantOption.price, maxPrice) : undefined
                            )
                        )
                )
            );
        }

        if (condition && condition.length > 0) {
            filters.push(
                exists(
                    db.select()
                        .from(productVariant)
                        .innerJoin(productVariantCondition, eq(productVariant.id, productVariantCondition.productVariantId))
                        .where(
                            and(
                                eq(productVariant.productId, products.id),
                                inArray(productVariantCondition.condition, condition as any)
                            )
                        )
                )
            );
        }

        const allProducts = await db.query.products.findMany({
            where: filters.length > 0 ? and(...filters) : undefined,
            limit: pageSize,
            offset: offset,
            with: {
                favouriteProduct: {
                    where: (favouriteProduct, { eq }) => eq(favouriteProduct.userId!, currentUser?.id!)
                },
                productVariant: {
                    with: {
                        productVariantOption: true,
                        productVariantColor: true,
                        productVariantImage: true,
                        productVariantCondition: true
                    },
                    orderBy: (productVariant, { desc }) => [
                        desc(productVariant.createdAt)
                    ]
                }
            },
            orderBy: (products, { desc, asc }) => {
                if (sort === 'newest') return [desc(products.createdAt)];
                return [desc(products.createdAt)];
            }
        });

        // Add sorting logic if needed (if it involves variant prices)
        if (sort === 'price-low' || sort === 'price-high') {
            allProducts.sort((a: any, b: any) => {
                const priceA = a.productVariant?.[0]?.productVariantOption?.[0]?.price || 0;
                const priceB = b.productVariant?.[0]?.productVariantOption?.[0]?.price || 0;
                return sort === 'price-low' ? priceA - priceB : priceB - priceA;
            });
        }

        // Get total count for pagination
        const totalCountResult = await db.select({ value: count() })
            .from(products)
            .where(filters.length > 0 ? and(...filters) : undefined);

        const mappedProducts = allProducts.map((product) => {
            return {
                ...product,
                favouriteProduct: product.favouriteProduct.length > 0 ? true : false
            }
        });

        return {
            items: mappedProducts,
            totalCount: totalCountResult[0]?.value || 0
        };
    } catch (error) {
        console.log(error);
        return { items: [], totalCount: 0, error: "Something went wrong." };
    }
}

export const fetchFavouriteProducts = async (page: number = 1, pageSize: number = 8) => {
    const session = await auth();
    const currentUser = session?.user;
    const offset = (page - 1) * pageSize;

    if (!currentUser) return { items: [], totalCount: 0 };

    try {
        const [favouriteProducts, total] = await Promise.all([
            db.query.favouriteProduct.findMany({
                where: eq(favouriteProduct.userId!, currentUser?.id!),
                limit: pageSize,
                offset: offset,
                with: {
                    products: {
                        with: {
                            favouriteProduct: true,
                            productVariant: {
                                with: {
                                    productVariantOption: true,
                                    productVariantColor: true,
                                    productVariantImage: true,
                                    productVariantCondition: true
                                }
                            }
                        }
                    }
                },
                orderBy: (favouriteProduct, { desc }) => [desc(favouriteProduct.createdAt)]
            }),
            db.select({ value: count() })
                .from(favouriteProduct)
                .where(eq(favouriteProduct.userId!, currentUser?.id!))
        ]);

        const mappedProducts = favouriteProducts.map((product) => {
            return {
                ...product,
                favouriteProduct: product.products.favouriteProduct.length > 0 ? true : false
            }
        });

        return {
            items: mappedProducts,
            totalCount: total[0]?.value || 0
        };
    } catch (error) {
        console.log(error);
        return { items: [], totalCount: 0 };
    }

}

export const deleteProduct = actionClient
    .inputSchema(DeleteProductSchema)
    .action(async ({ parsedInput: { productId } }) => {
        try {
            const product = await db.query.products.findFirst({
                where: eq(products.id, productId)
            })
            if (!product) return { error: "Product not found." };

            await db.delete(products).where(eq(products.id, productId));
            revalidatePath('/');
            return { success: "Product delete successfully." };
        } catch (error) {
            return { error: "Something went wrong." }
        }

    })

export const AddProductAction = actionClient
    .inputSchema(ProductSchema)
    .action(async ({ parsedInput: { title, description, productId, category, brand } }) => {

        try {
            if (!title || !description || !category || !brand) return { error: "Something went wrong." }

            if (productId) {
                await db.update(products).set({
                    title,
                    description,
                    category: sql`${category}::category`, 
                    brand: sql`${brand}::brand`,
                }).where(eq(products.id, productId));

                return {
                    success: "Product update successfully.",
                }
            } else {
                await db.insert(products).values({
                    title ,
                    description,
                    category: sql`${category}::category`, 
                    brand: sql`${brand}::brand`,
                })

                return {
                    success: "Product added successfully.",
                }
            }
        } catch (error) {
            console.log(error);
            
            return {
                error: "Something went wrong." 
            }
        }

    })

export const addProductVariantAction = actionClient
    .inputSchema(VariantsSchema)
    .action(async ({ parsedInput: { id, editMode, productID, name, color, variantImages, storages, condition } }) => {
        try {
            if (!productID || !name || !color || !variantImages || !storages || !condition) return { error: "Something went wrong." }

            if (editMode && id) {
                const variant = await db.update(productVariant).set({
                    productId: productID,
                    variantName: name,
                }).where(eq(productVariant.id, id)).returning();

                if (!variant) return { error: "Something went wrong." }

                await db.delete(productVariantOption).where(eq(productVariantOption.productVariantId, variant[0].id));
                storages?.forEach(async (storage) => {
                    await db.insert(productVariantOption).values({
                        productVariantId: variant[0].id,
                        storage: storage.storage,
                        price: storage.price,
                    })
                })

                await db.delete(productVariantImage).where(eq(productVariantImage.productVariantId, variant[0].id));
                variantImages?.forEach(async (image) => {
                    await db.insert(productVariantImage).values({
                        productVariantId: variant[0].id,
                        image_url: image.url,
                        name: image.name,
                        size: String(image.size),
                    })
                })

                await db.delete(productVariantColor).where(eq(productVariantColor.productVariantId, variant[0].id));
                await db.insert(productVariantColor).values({
                    productVariantId: variant[0].id,
                    color: color,
                })

                await db.delete(productVariantCondition).where(eq(productVariantCondition.productVariantId, variant[0].id));
                await db.insert(productVariantCondition).values({
                    productVariantId: variant[0].id,
                    condition: condition,
                })

                revalidatePath('/products');
                return {
                    success: "Product variant updated successfully.",
                }

            } else {
                const variant = await db.insert(productVariant).values({
                    productId: productID,
                    variantName: name,
                }).returning()

                if (!variant) return { error: "Something went wrong." }

                storages?.forEach(async (storage) => {
                    await db.insert(productVariantOption).values({
                        productVariantId: variant[0].id,
                        storage: storage.storage,
                        price: storage.price,
                    })
                })

                variantImages?.forEach(async (image) => {
                    await db.insert(productVariantImage).values({
                        productVariantId: variant[0].id,
                        image_url: image.url,
                        name: image.name,
                        size: String(image.size),
                    })
                })

                await db.insert(productVariantColor).values({
                    productVariantId: variant[0].id,
                    color: color,
                })

                await db.insert(productVariantCondition).values({
                    productVariantId: variant[0].id,
                    condition: condition,
                })

                revalidatePath('/products');
                return {
                    success: "Product variant added successfully.",
                }
            }

        } catch (error) {
            return {
                error: "Something went wrong."
            }
        }
    })