import { createId } from "@paralleldrive/cuid2";
import { integer, pgEnum, pgTable, primaryKey, text, timestamp, } from "drizzle-orm/pg-core";

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