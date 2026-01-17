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
import { useTranslations } from "next-intl";
import { Link, useRouter } from '@/src/i18n/navigation';
import { LogoutAction } from "@/server/actions/logout";

type UserInformationProps = {
    children: React.ReactNode;
    session: Session
}

const UserInformation = ({ children, session }: UserInformationProps) => {
    const t = useTranslations("UserInfo")
    const user = session?.user;
    const router = useRouter();

    const handleSignOut = async () => {
        await LogoutAction();
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="cursor-pointer" asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user?.role === 'admin' ?
                    <Link href={'/dashboard'}>
                        <DropdownMenuItem className="cursor-pointer select-none">{t("adminDashboard")}</DropdownMenuItem>
                    </Link> 
                    :
                <>
                <Link href={'/my-orders'}>
                    <DropdownMenuItem className="cursor-pointer select-none">{user?.role === 'admin' ? t('adminOrders') : t('userOrder')}</DropdownMenuItem>
                </Link>
                <Link href={'/profile'}>
                    <DropdownMenuItem className="cursor-pointer select-none">{t('profileSettings')}</DropdownMenuItem>
                </Link>
                <Link href={'/account'}>
                    <DropdownMenuItem className="cursor-pointer select-none">{t('accountSettings')}</DropdownMenuItem>
                </Link>
                </>
                }
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer select-none">{t("logout")}</DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserInformation
