import { integer, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const RoleEnum = pgEnum('roles', ['user', 'admin']);

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    phone_number: varchar({ length: 20 }).notNull(),
    role: RoleEnum('roles').notNull().default('user'),
    created_at: timestamp({ mode: 'date' }).notNull().defaultNow(),
});