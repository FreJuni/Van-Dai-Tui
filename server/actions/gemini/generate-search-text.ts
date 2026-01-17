'use server';

import { db } from '@/server';
import { instance } from './instance';

export const generateSearchText = async (query: string): Promise<any> => {
  try {
    // Fetch all products or a broad set to let AI filter
    const allProducts = await db.query.products.findMany({
      with: {
        productVariant: {
          with: {
            productVariantImage: true,
            productVariantOption: true,
            productVariantColor: true,
          },
        },
      },
    });

    const inventoryContext = allProducts.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      category: p.category,
      brand: p.brand,
      variants: p.productVariant.map((v) => ({
        id: v.id,
        name: v.variantName,
        color: v.productVariantColor?.color,
        options: v.productVariantOption.map((o) => ({
          storage: o.storage,
          price: o.price,
        })),
        image: v.productVariantImage[0]?.image_url,
      })),
    }));

    // describe inventoryContext for AI
    const response = await instance.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `User Query: "${query}"` }],
        },
      ],
      config: {
        systemInstruction: `You are 'Volt Assistant,' a premium tech concierge.
    
    INVENTORY (Simplified): ${JSON.stringify(inventoryContext)}

    GOAL:
    1. Match the user query to the best inventory items.
    2. If budget provided (e.g. "2000RM"), prioritize items within that range.
    3. Return 'items' with exact metadata from the matched variant.
    4. For each item, 'urlParams' MUST contain all fields needed for: /listing-page/[id]?[params]
    5. 'type' is one of: "phone", "laptop", "repair", "battery_change", "service".

    REPAIR & SERVICES HANDLING:
    - If the user asks for repairs or services generally (e.g., "I need a repair", "screen fix", "services available"), return an item with type "service" and a helpful message directing them to our services page.
    - For type "service", you DO NOT need to match an inventory item. Set the name to "Professional Services" and price to 0. The message should say something like "We offer professional repair services for various devices. You can view our full list of services here."
    - 'repair' and 'battery_change' types can still be used for specific inventory matches if applicable.`,

        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  price: { type: 'number' },
                  type: {
                    type: 'string',
                    enum: [
                      'phone',
                      'laptop',
                      'repair',
                      'battery_change',
                      'service',
                    ],
                  },
                  imageUrl: { type: 'string' },
                  urlParams: {
                    type: 'object',
                    properties: {
                      variantName: { type: 'string' },
                      listingTitle: { type: 'string' },
                      listingDescription: { type: 'string' },
                      listingPrice: { type: 'number' },
                      listingImage: { type: 'string' },
                      variantId: { type: 'string' },
                      productId: { type: 'string' },
                      variantColor: { type: 'string' },
                      variantImage: { type: 'string' },
                      variantStorage: { type: 'string' },
                      variantPrice: { type: 'number' },
                    },
                    required: [
                      'variantName',
                      'listingTitle',
                      'listingPrice',
                      'variantId',
                      'productId',
                    ],
                  },
                },
                required: [
                  'id',
                  'name',
                  'price',
                  'type',
                  'urlParams',
                  'productId',
                ],
              },
            },
          },
          required: ['message', 'items'],
        },
      },
    });

    const result = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!result) throw new Error('No response from Gemini');

    return JSON.parse(result);
  } catch (error) {
    console.error('Gemini Error:', error);
    return {
      message:
        "I'm having trouble accessing the inventory right now, but I can still help with general tech advice!",
      items: [],
    };
  }
};
