import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "./index"
import { accounts, users } from "@/server/schema";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/types/login-schema";
import { eq } from "drizzle-orm";
import bcrypt from 'bcrypt';

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
    }),
    secret: process.env.AUTH_SECRET!,
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        //TODO after testing login or signup
        async session({ session, token }) {
            if (session && token.sub) {
                session.user.id = token.sub as string;
            }
            if (session && token.role) {
                session.user.role = token.role as string;
            }

            if (session) {
                session.user.isOAuth = token.isOAuth as boolean;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.image = token.image as string;
                session.user.phone_number = token.phone_number as string;
            }

            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token
            const isExistedUser = await db.query.users.findFirst({
                where: eq(users.id, token.sub)
            })
            if (!isExistedUser) return token;
            const isExistedAccount = await db.query.accounts.findFirst({
                where: eq(accounts.userId, token.sub)
            })
            token.isOAuth = !!isExistedAccount
            token.name = isExistedUser.name
            token.email = isExistedUser.email
            token.image = isExistedUser.image
            token.role = isExistedUser.role
            token.phone_number = isExistedUser.phone_number
            return token
        }
    },
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const validateData = LoginSchema.safeParse(credentials);
                if (!validateData) return null;

                const { email, password } = validateData.data!;

                const user = await db.query.users.findFirst({
                    where: eq(users.email, email)
                })

                if (!user || !password) return null

                const isPasswordMatch = await bcrypt.compare(password, user.password!);

                if (!isPasswordMatch) return null

                return user;
            }
        })
    ],
})