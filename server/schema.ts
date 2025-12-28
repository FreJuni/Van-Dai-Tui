import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, primaryKey, real, text, timestamp, } from "drizzle-orm/pg-core";

export const RoleEnum = pgEnum('roles', ['user', 'admin']);

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    name: text("name"),
    email: text("email").unique(),
    password: text('password'),
    phone_number: text('phone_number'),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    role: RoleEnum('roles').default('user'),
});

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => [
        {
            compoundKey: primaryKey({
                columns: [account.provider, account.providerAccountId],
            }),
        },
    ]
)

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

export const products = pgTable('products', {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    title: text('title').notNull(),
    description: text('description').notNull(),
    price: real('price').notNull(),
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

export const productsRelations = relations(products, ({ many, one }) => ({
    productVariant: many(productVariant),
    favouriteProduct : many(favouriteProduct)
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