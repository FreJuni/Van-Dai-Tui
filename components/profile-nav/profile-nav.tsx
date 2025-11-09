"use client";

import { cn } from '@/lib/utils';
import { Session } from 'next-auth';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

type ProfileNavigationProps = {
    session: Session;
}

const ProfileNavigation = ({ session }: ProfileNavigationProps) => {
    const t = useTranslations("UserInfo");
    const pathname = usePathname();
    const user = session?.user;


    return (
        <div className='flex  justify-center items-center gap-5  border border-b-zinc-200 py-3 '>
            {user?.role === 'admin' &&
                <Link className={cn('font-medium opacity-50 hover:opacity-70', pathname === '/products' && 'opacity-100')} href={'/products'}>{t("adminProducts")}</Link>
            }
            <Link className={cn('font-medium opacity-50 hover:opacity-70', pathname === '/profile' && 'opacity-100')} href={'/profile'}>{t("profileSettings")}</Link>
            <Link className={cn('font-medium opacity-50  hover:opacity-70', pathname === '/account' && 'opacity-100')} href={'/account'}>{t("accountSettings")}</Link>
        </div>
    )
}

export default ProfileNavigation
