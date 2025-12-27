"use client"

import React from 'react'
import { Input } from '../ui/input'
import { useTranslations } from 'next-intl';
import { HeartIcon, ShoppingCartIcon, UserIcon } from 'lucide-react';
import { Session } from 'next-auth';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import UserInformation from '../user/user-info';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type TopNavBarProps = {
    session: Session;
}

import { Search } from 'lucide-react';

const TopNavBar = ({ session }: TopNavBarProps) => {
    const t = useTranslations('NavBar')
    const router = useRouter();
    const isLoggedIn = session && !!session?.user;

    return (
        <header className='sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md'>
            <div className='max-w-7xl mx-auto flex justify-between items-center py-4 px-6 md:px-10 lg:px-12'>
                {/* Brand Logo */}
                <Link href="/" className='flex items-center gap-2 group transition-all active:scale-95'>
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                        <span className="text-white font-black text-xl italic">{t('projectName')[0]}</span>
                    </div>
                    <h2 className='font-black text-2xl tracking-tighter text-gray-900 hidden sm:block'>
                        {t('projectName')}
                    </h2>
                </Link>

                {/* Search Bar */}
                <form 
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const query = formData.get('search');
                        if (query) router.push(`/search?q=${query}`);
                    }}
                    className='hidden md:flex relative w-1/3 lg:w-1/2 group'
                >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input 
                        name="search"
                        className='pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all rounded-xl placeholder:text-gray-400' 
                        placeholder={t('searchPlaceholder')} 
                    />
                    <button type="submit" className='absolute right-1.5 top-1.5 bottom-1.5 bg-gray-900 text-white select-none px-4 text-xs font-bold tracking-widest cursor-pointer rounded-lg hover:bg-black transition-colors'>
                        {t("searchButton")}
                    </button>
                </form>

                {/* Action Icons & User Info */}
                <div className='flex gap-4 md:gap-6 items-center'>
                    <div className="flex items-center gap-2 border-r border-gray-100 pr-4 md:pr-6 mr-1">
                        {
                            session?.user?.role === 'admin' ?
                                <Link 
                                    className='h-10 px-4 flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-lg text-sm font-bold' 
                                    href={'/add-product'}
                                >
                                    <span className="hidden lg:inline">{t("addProduct")}</span>
                                    <span className="lg:hidden text-lg">+</span>
                                </Link>
                                :
                                <>
                                    <button className='p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-full transition-all'>
                                        <HeartIcon size={22} />
                                    </button>
                                    <button className='p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-full transition-all'>
                                        <ShoppingCartIcon size={22} />
                                    </button>
                                </>
                        }
                    </div>

                    {
                        isLoggedIn ?
                            <UserInformation session={session}>
                                <Avatar className='w-11 h-11 border-2 border-white shadow-sm ring-1 ring-gray-100 cursor-pointer hover:ring-primary transition-all active:scale-95'>
                                    <AvatarImage src={session?.user?.image!} alt={session?.user?.name!} />
                                    <AvatarFallback className='bg-gray-50 font-bold text-gray-400 select-none'>
                                        {session?.user?.name!?.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </UserInformation>
                            :
                            <Link href={'/auth/register'}>
                                <button className='h-11 px-6 bg-gray-900 text-white rounded-xl font-bold text-sm tracking-wide shadow-sm hover:bg-black transition-all active:scale-95'>
                                    {t("loginRegister")}
                                </button>
                            </Link>
                    }
                </div>
            </div>
        </header>
    )
}

export default TopNavBar
