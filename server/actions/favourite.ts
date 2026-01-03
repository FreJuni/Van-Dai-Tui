"use server";

import { FavouriteSchema } from "@/types/favourite-schema";
import { actionClient } from "./safe-action";
import { db } from "..";
import { favouriteProduct } from "../schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";


import { auth } from "../auth";

export const addFavourites = actionClient
        .inputSchema(FavouriteSchema)
        .action(async ({parsedInput : {productId}}) : Promise<{success? : string, error? : string}> => {
            try {
              const session = await auth();
              const userId = session?.user?.id;
              
              if(!productId || !userId) return {error : "Please login to add to favorites" };

              const checkAlreadyAddToFav = await db.query.favouriteProduct.findFirst({
                where : and(eq(favouriteProduct.productId, productId), eq(favouriteProduct.userId, userId))
              })

              if(checkAlreadyAddToFav) {    
                await db.delete(favouriteProduct).where(and(eq(favouriteProduct.productId, productId), eq(favouriteProduct.userId, userId)))

                revalidatePath('/search');
                return {
                    success : "Product removed from favourite"
                }
              } else {
                await db.insert(favouriteProduct).values({
                  productId,
                  userId,
                })
                
                revalidatePath('/search');
                return {
                    success : "Add to favourite sucessfully."
                }
              }
                
            } catch (error) {
                console.log(error);
                return {
                    error : "Something went wrong"
                }
            }
        })