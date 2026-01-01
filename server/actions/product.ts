'use server'

import { actionClient } from "./safe-action";
import { db } from "..";
import { eq, sql } from "drizzle-orm";
import { favouriteProduct, products, productVariant, productVariantColor, productVariantCondition, productVariantImage, productVariantOption, users } from "../schema";
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

export const fetchAllAdminProducts = async () : Promise<ProductsWithVariants[]> => {
    try {
        const allProducts = await db.query.products.findMany({
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
            }
        })

        return allProducts ;
    } catch (error) {
        console.log(error);
        return [];
    }

}

export const fetchAllProducts = async () => {
    const session  = await auth();
    const currentUser = session?.user;

    try {
        const allProducts = await db.query.products.findMany({
            with: {
                favouriteProduct: {
                    where : (favouriteProduct, { eq }) => eq(favouriteProduct.userId!, currentUser?.id!)
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
            }
        })

        const mappedProducts = allProducts.map((product) => {
            return {
                ...product,
                favouriteProduct: product.favouriteProduct.length > 0 ? true : false
            }
        })
        return mappedProducts;
    } catch (error) {
        console.log(error);
        return { error: "Something went wrong." }
    }

}

export const fetchFavouriteProducts = async ()  => {
    const session = await auth();
    const currentUser = session?.user;

    try {
        const favouriteProducts = await db.query.favouriteProduct.findMany({
            where : eq(favouriteProduct.userId!, currentUser?.id!),
            with : {
                products : {
                    with : {
                        favouriteProduct : true,
                        productVariant : {
                            with : {
                                productVariantOption : true,
                                productVariantColor : true,
                                productVariantImage : true,
                                productVariantCondition : true
                            }
                        }
                    }
                }
            }
        })

        const mappedProducts = favouriteProducts.map((product) => {
            return {
                ...product,
                favouriteProduct: product.products.favouriteProduct.length > 0 ? true : false
            }
        })
        return mappedProducts;
    } catch (error) {
        console.log(error);
        return [];
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