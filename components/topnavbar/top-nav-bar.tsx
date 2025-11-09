// "use client"

import React from 'react'
import { Input } from '../ui/input'
import { useTranslations } from 'next-intl';
import { HeartIcon, ShoppingCartIcon, UserIcon } from 'lucide-react';
import { Session } from 'next-auth';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import UserInformation from '../user/user-info';
import Link from 'next/link';

type TopNavBarProps = {
    session: Session;
}

const TopNavBar = ({ session }: TopNavBarProps) => {
    const t = useTranslations('NavBar')
    const isLoggedIn = session && !!session?.user;

    return (
        <nav className='flex justify-between items-center py-5 px-5 border border-b-zinc-200 sticky top-0'>
            <div className=' cursor-pointer select-none font-bold'>
                <h2>{t('projectName')}</h2>
            </div>
            <div className='relative w-1/2'>
                <Input placeholder='Search products here ...' />
                <span className=' absolute bg-black text-white select-none py-1.5 px-3 tracking-wider right-px cursor-pointer  rounded-r-md'>
                    {t("search")}
                </span>
            </div>
            <div className='flex gap-2 items-center'>
                {
                    session?.user?.role === 'admin' ?
                        <>
                            <Link className=' font-medium hover:underline' href={'/add-product'}>
                                {t("addProduct")}
                            </Link>
                        </>
                        :
                        <>
                            <HeartIcon className='cursor-pointer' />
                            <ShoppingCartIcon className='cursor-pointer' />
                        </>
                }
                {
                    isLoggedIn ?
                        <div >
                            <UserInformation session={session}>
                                <Avatar className='w-12 h-12'>
                                    <AvatarImage src={session?.user?.image!} alt={session?.user?.name!} />
                                    <AvatarFallback className='border border-zinc-200 select-none '>{session?.user?.name!?.slice(0, 3)}</AvatarFallback>
                                </Avatar>
                            </UserInformation>
                        </div>
                        :
                        <Link href={'/auth/register'}>
                            <div className='cursor-pointer'>
                                {t("loginRegister")}
                            </div>
                        </Link>
                }
            </div>
        </nav>
    )
}

export default TopNavBar
