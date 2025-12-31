"use server";

import { ilike } from "drizzle-orm";
import { db } from "..";
import { products } from "../schema";

export const QuerySearch = async ({query} : {query : string}) : Promise<any> => {
    const fetchRelatedProducts = await db.query.products.findMany({
        // Use % symbols for a "contains" search
        where: ilike(products.title, `%${query}%`), 
        with : {
            productVariant : {
                with : {
                   productVariantImage : true,
                   productVariantColor : true,
                   productVariantCondition : true,
                   productVariantOption : true,
                }
            }
        }
        });

    return fetchRelatedProducts;
}