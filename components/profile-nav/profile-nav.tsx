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

    const navItems = [
        {
            label: t("adminProducts"),
            href: "/products",
            show: user?.role === "admin",
        },
        {
            label: t("profileSettings"),
            href: "/profile",
            show: true,
        },
        {
            label: t("accountSettings"),
            href: "/account",
            show: true,
        },
    ];

    return (
        <div className='w-full border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-14 md:top-20 z-40 overflow-x-auto no-scrollbar'>
            <div className='max-w-7xl mx-auto px-4 md:px-10 lg:px-12'>
                <div className='flex items-center justify-start gap-4 md:gap-8 min-w-max'>
                    {navItems.filter(item => item.show).map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative py-4 px-3 text-sm font-bold transition-all duration-200 outline-none whitespace-nowrap",
                                    isActive 
                                        ? "text-primary" 
                                        : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                {item.label}
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default ProfileNavigation
