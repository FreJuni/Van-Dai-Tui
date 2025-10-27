import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendSession = DefaultSession['user'] & {
    id: string,
    name: string,
    email: string,
    role: string,
    phone_number: string,
    isOAuth: boolean
}

declare module 'next-auth' {
    interface Session {
        user: ExtendSession
    }
}