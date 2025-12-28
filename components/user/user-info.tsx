"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

type UserInformationProps = {
    children: React.ReactNode;
    session: Session
}

const UserInformation = ({ children, session }: UserInformationProps) => {
    const t = useTranslations("UserInfo")
    const user = session?.user;
    const router = useRouter();

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="cursor-pointer" asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user?.role === 'admin' &&
                    <Link href={'/products'}>
                        <DropdownMenuItem className="cursor-pointer select-none">{t("adminProducts")}</DropdownMenuItem>
                    </Link>}
                <Link href={'/order'}>
                    <DropdownMenuItem className="cursor-pointer select-none">{user?.role === 'admin' ? t('adminOrders') : t('userOrder')}</DropdownMenuItem>
                </Link>
                <Link href={'/profile'}>
                    <DropdownMenuItem className="cursor-pointer select-none">{t('profileSettings')}</DropdownMenuItem>
                </Link>
                <Link href={'/account'}>
                    <DropdownMenuItem className="cursor-pointer select-none">{t('accountSettings')}</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                    signOut();
                    router.push('/');
                }} className="cursor-pointer select-none">{t("logout")}</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserInformation
