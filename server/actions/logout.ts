'use server'

import { signOut } from "@/server/auth";

export const LogoutAction = async () => {
    await signOut({ redirectTo: "/" });
};
