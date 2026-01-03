import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, primaryKey, real, text, timestamp, } from "drizzle-orm/pg-core";

export const RoleEnum = pgEnum('roles', ['user', 'admin']);

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    name: text("name"),
    address: text("address"),
    password: text('password'),
    phone_number: text('phone_number').unique(),
    addressVerified: timestamp("addressVerified", { mode: "date" }),
    image: text("image"),
    role: RoleEnum('roles').default('user'),
});

export const generatePasswordResetToken = pgTable("generate_password_reset_token", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull(),
});


export const CategoryEnum = pgEnum('category', ['Phones', 'Tablets', 'Laptops', 'Others']);
export const BrandEnum = pgEnum('brand', ['Apple', 'Samsung', 'Xiaomi',"Dell", "HP", "Lenovo", "Asus", "Others"]);
export const ConditionEnum = pgEnum('condition', ['New', 'Used' , 'Refurbished']);
export const StatusEnum = pgEnum('status', ['Pending', 'Shipped', 'Delivered', 'Completed', 'Cancelled']);

export const products = pgTable('products', {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    title: text('title').notNull(),
    description: text('description').notNull(),
    price: real('price'),
    category: CategoryEnum('category').default('Others'),
    brand: BrandEnum('brand').default('Others'), 
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow()
})

export const productVariant = pgTable('productVariant', {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    productId: text("productId").notNull().references(() => products.id, { onDelete: "cascade" }),
    variantName: text("variantName").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow()
})

export const productVariantCondition = pgTable('productVariantCondition', {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    productVariantId: text("productVariantId").notNull().references(() => productVariant.id, { onDelete: "cascade" }),
    condition: ConditionEnum('condition').default('New'),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow()
})

export const productVariantOption = pgTable('productVariantOption', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    productVariantId: text('productVariantId')
        .notNull()
        .references(() => productVariant.id, { onDelete: 'cascade' }),
    storage: text('storage').notNull(),
    price: real('price').notNull(),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
});

export const productVariantColor = pgTable('productVariantColor', {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    productVariantId: text("productVariantId").notNull().references(() => productVariant.id, { onDelete: "cascade" }),
    color: text("color").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow()
})

export const productVariantImage = pgTable('productVariantImage', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => createId()),
    productVariantId: text('productVariantId').notNull().references(() => productVariant.id, { onDelete: "cascade" }),
    image_url: text('image_url').notNull(),
    name: text('name').notNull(),
    size: text('size').notNull(),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
})

export const favouriteProduct = pgTable('favourite_products', {
    id : text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
    userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
    productId: text('productId')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
},
    (favouriteProduct) => [
        {
            compoundKey: primaryKey({
                columns: [favouriteProduct.userId, favouriteProduct.productId],
            }),
        },
    ]
)

export const orders = pgTable('orders', {
    id : text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
    userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
    quantity: integer('quantity').notNull(),
    status: StatusEnum('status').default('Pending'),
    totalPrice: real('totalPrice').notNull(),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
},
    (orders) => [
        {
            compoundKey: primaryKey({
                columns: [orders.userId, orders.id],
            }),
        },
    ]
)

export const orderProducts = pgTable('order_products', {
    id : text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
    orderId: text('orderId')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
    productVariantId: text('productVariantId')
    .notNull()
    .references(() => productVariant.id, { onDelete: 'cascade' }),
   productId: text('productId')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
},
    (orderProducts) => [
        {
            compoundKey: primaryKey({
                columns: [orderProducts.orderId, orderProducts.productId],
            }),
        },
    ]
)

export const productsRelations = relations(products, ({ many, one }) => ({
    productVariant: many(productVariant),
    favouriteProduct : many(favouriteProduct),
    orderProducts : many(orderProducts)
}))

export const ordersRelations = relations(orders, ({ many , one }) => ({
    orderProducts : many(orderProducts),
    user : one(users , {
        fields : [orders.userId],
        references : [users.id]
    })
}))

export const orderProductsRelations = relations(orderProducts, ({ one }) => ({
    orders : one(orders , {
        fields : [orderProducts.orderId],
        references : [orders.id]
    }),
    productVariant : one(productVariant , {
        fields : [orderProducts.productVariantId],
        references : [productVariant.id]
    }),
    products : one(products , {
        fields : [orderProducts.productId],
        references : [products.id]
    })
}))

export const favouritesRelations = relations(favouriteProduct , ({many , one}) => ({
    products : one(products , {
        fields : [favouriteProduct.productId],
        references : [products.id]
    }),
    users : one(users , {
        fields : [favouriteProduct.userId],
        references : [users.id]
    })
}))

export const productVariantRelations = relations(productVariant, ({ many, one }) => ({
    product: one(products, {
        fields: [productVariant.productId],
        references: [products.id]
    }),
    productVariantOption: many(productVariantOption),
    productVariantColor: one(productVariantColor, {
        fields: [productVariant.id],
        references: [productVariantColor.productVariantId]
    }),
    productVariantCondition: one(productVariantCondition, {
        fields: [productVariant.id],
        references: [productVariantCondition.productVariantId]
    }),
    productVariantImage: many(productVariantImage),
    orderProducts : many(orderProducts)
}))

export const productVariantConditionRelations = relations(productVariantCondition, ({ one }) => ({
    productVariant: one(productVariant, {
        fields: [productVariantCondition.productVariantId],
        references: [productVariant.id]
    })
}))

export const productVariantOptionRelations = relations(productVariantOption, ({ one }) => ({
    productVariant: one(productVariant, {
        fields: [productVariantOption.productVariantId],
        references: [productVariant.id]
    })
}))

export const productVariantColorRelations = relations(productVariantColor, ({ one }) => ({
    productVariant: one(productVariant, {
        fields: [productVariantColor.productVariantId],
        references: [productVariant.id]
    })
}))

export const productVariantImageRelations = relations(productVariantImage, ({ one }) => ({
    productVariant: one(productVariant, {
        fields: [productVariantImage.productVariantId],
        references: [productVariant.id]
    })
}))