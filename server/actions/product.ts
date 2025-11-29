'use server'

import { actionClient } from "./safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { products, users } from "../schema";
import bcrypt from 'bcrypt';
import { ProductSchema } from "@/types/product-schema";
import { email } from "zod";
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const fetchAllProducts = async () => {
    try {
        const allProducts = await db.select().from(products);
        return allProducts;
    } catch (error) {
        console.log(error);
    }

}

export const AddProductAction = actionClient
    .inputSchema(ProductSchema)
    .action(async ({ parsedInput: { title, description, price } }) => {

        try {
            if (!title || !description || !price) return { error: "Something went wrong." }

            await db.insert(products).values({
                title,
                description,
                price
            })

            return {
                success: "Product added successfully.",
            }
        } catch (error) {
            return {
                error: "Something went wrong."
            }
        }

    })