"use server";

import { db } from "@/server";
import { instance } from "./instance";
import { eq, ilike } from "drizzle-orm";
import { products } from "@/server/schema";

export const generateSearchText = async (query: string) : Promise<any> => {

try {

    const fetchRelatedProducts = await db.query.products.findMany({
    // Use % symbols for a "contains" search
    where: ilike(products.title, `%${query}%`), 
    with : {
        productVariant : {
            with : {
               productVariantImage : true
            }
        }
    }
    });

    const prompt = `
    Inventory Data: ${JSON.stringify(fetchRelatedProducts)}
    
    User Question: "${query}"
    
    Instructions: 
    - If products exist, say exactly how many we have.
    - Briefly describe them (price and condition).
    - If we have 0, suggest a repair service instead.
  `;

    const response = await instance.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
  systemInstruction: `You are 'Volt,' a premium tech concierge for our store. 
    1. Search inventory: If you find products, return them in the 'items' array.
    2. Suggest repairs: If a device is broken, add a 'repair' item to the 'items' array.
    3. Be helpful: Always provide a friendly greeting or explanation in the 'message' field.`,
  
  // Use 'responseMimeType' to force JSON output
  responseMimeType: "application/json",
  
  responseSchema: {
    type: "object",
    properties: {
      message: { 
        type: "string", 
        description: "The text spoken by the AI to the user." 
      },
      items: {
        type: "array",
        description: "List of products or services to display as cards.",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            price: { type: "number" },
            type: { 
              type: "string", 
              enum: ["phone", "laptop", "repair", "battery_change"] 
            },
            imageUrl: { type: "string" }
          },
          required: ["id", "name", "price", "type"]
        }
      }
    },
    required: ["message", "items"]
  }
}
  });

    const result = response.candidates?.[0]?.content?.parts?.[0]?.text || response.text;
    if (!result) throw new Error("No response from Gemini");
    return JSON.parse(result);
  } catch (error) {
    console.log(error);
    return { message: "Sorry, I encountered an error while searching.", items: [] };
  }
};
