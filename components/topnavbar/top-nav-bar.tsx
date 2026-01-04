"use client"

import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Locale, useTranslations } from 'next-intl';
import { Globe, HeartIcon, ShoppingCartIcon, UserIcon } from 'lucide-react';
import { Session } from 'next-auth';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import UserInformation from '../user/user-info';
import { Link, usePathname, useRouter } from '@/src/i18n/navigation';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { priceFormatter } from '@/helper/priceFormatter';

type TopNavBarProps = {
    session: Session;
}

import { Search } from 'lucide-react';
import { QuerySearch } from '@/server/actions/search';
import { CartDrawer } from '../cart/cart-drawer';
import { routing } from '@/src/i18n/routing';
import { useParams } from 'next/navigation';

const LANGUAGES = {
    en: { name: 'English', flag: '🇺🇸', code: 'EN' },
    mm: { name: 'မြန်မာ', flag: '🇲🇲', code: 'MM' }
} as const;

const TopNavBar = ({ session }: TopNavBarProps) => {
    const t = useTranslations('NavBar')
    const router = useRouter();
    const pathname = usePathname();
    const isLoggedIn = session && !!session?.user;
    const [searchResults, setSearchResults] = useState<any | null>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const params = useParams();
    const defaultValue = params.locale as Locale;


    const handleGenerateSearchText = async (query: string) => {

        if (!query.trim()) {
            router.push('/search');
            return;
        };

        setIsSearching(true);
        setShowResults(true);
        try {
            const response = await QuerySearch({query});
            setSearchResults(response);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSearching(false);
        }
    }

    const clearSearch = () => {
        setSearchValue("");
        setSearchResults([]);
        setShowResults(false);
    }

    const onChangeLanguage = (value: string) => {
        if (!value) return;
        router.replace(pathname, { locale: value as Locale });
    }

    return (
        <header className='sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md'>
            <div className=' px-6 md:px-12 lg:px-[100px] flex justify-between items-center py-4'>
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
                        handleGenerateSearchText(query as string);
                    }}
                    className='hidden md:flex relative w-1/3 lg:w-1/2 group'
                >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {isSearching ? (
                            <Loader2 className="h-4 w-4 text-primary animate-spin" />
                        ) : (
                            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        )}
                    </div>
                    <Input 
                        name="search"
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            if (e.target.value === "") {
                                setSearchResults([]);
                                setShowResults(false);
                            }
                        }}
                        autoComplete="off"
                        className='pl-10 pr-24 h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all rounded-xl placeholder:text-gray-400' 
                        placeholder={t('searchPlaceholder')} 
                    />
                    <div className="absolute right-1.5 top-1.5 bottom-1.5 flex items-center gap-1">
                        {searchValue && (
                            <button 
                                type="button"
                                onClick={clearSearch}
                                className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        )}
                        <button type="submit" disabled={isSearching} className='bg-gray-900 text-white select-none px-4 h-full text-xs font-bold tracking-widest cursor-pointer rounded-lg hover:bg-black transition-colors disabled:opacity-50'>
                            {isSearching ? t("searching") || "..." : t("searchButton")}
                        </button>
                    </div>

                    {/* Search Results Dropdown */}
                    {showResults && (
                        <>
                            <div 
                                className="fixed inset-0 z-[-1]" 
                                onClick={() => setShowResults(false)}
                            />
                            <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-300 ease-out animate-in fade-in slide-in-from-top-4 z-50">
                                <div className="p-4 bg-gray-50/80 border-b border-gray-100 flex justify-between items-center backdrop-blur-sm">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-bold text-gray-900">{t("searchResults")}</h3>
                                        {!isSearching && searchResults?.length > 0 && (
                                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-tighter">
                                                {searchResults.length} {t("itemsFound") || "items found"}
                                            </span>
                                        )}
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setShowResults(false)}
                                        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors group"
                                    >
                                        <X size={16} className="text-gray-400 group-hover:text-gray-600" />
                                    </button>
                                </div>
                                <div className="max-h-[500px] overflow-y-auto p-4 custom-scrollbar">
                                    {isSearching ? (
                                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                            <div className="relative">
                                                <div className="w-14 h-14 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-2.5 h-2.5 bg-primary rounded-full animate-ping"></div>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-bold text-gray-900">{t("searching")}</p>
                                                <p className="text-xs text-gray-400 mt-1">{t("scanningInventory") || "Scanning inventory for you..."}</p>
                                            </div>
                                        </div>
                                    ) : searchResults?.length > 0 ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {searchResults.map((item: any) => {
                                                const firstVariant = item.productVariant?.[0];
                                                const firstImage = firstVariant?.productVariantImage?.[0]?.image_url;
                                                const firstOption = firstVariant?.productVariantOption?.[0];
                                                const variantPrice = firstOption?.price;
                                                const variantStorage = firstOption?.storage;
                                                const variantColor = firstVariant?.productVariantColor?.color;
                                                const variantName = firstVariant?.variantName;

                                                const href = `/listing-page/${item.id}?variantName=${variantName}&listingTitle=${item.title}&listingDescription=${item.description}&listingPrice=${item.price}&listingImage=${firstImage}&variantId=${firstVariant?.id}&productId=${item.id}&variantColor=${variantColor}&variantImage=${firstImage}&variantStorage=${variantStorage}&variantPrice=${variantPrice}`;

                                                return (
                                                    <Link 
                                                        key={item.id} 
                                                        href={href}
                                                        onClick={() => setShowResults(false)}
                                                        className="group flex gap-3 p-3 rounded-xl border border-gray-50 hover:border-primary/20 hover:bg-primary/[0.02] hover:shadow-sm transition-all duration-300"
                                                    >
                                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                                                            {firstImage ? (
                                                                <Image 
                                                                    src={firstImage} 
                                                                    alt={item.title} 
                                                                    fill 
                                                                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                                                    <Search size={24} />
                                                                </div>
                                                            )}
                                                            {variantColor && (
                                                                <div 
                                                                    className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-white shadow-sm"
                                                                    style={{ backgroundColor: variantColor }}
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                            <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-primary transition-colors">
                                                                {item.title}
                                                            </h4>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <span className="text-sm font-black text-primary">
                                                                    {priceFormatter({ price: variantPrice || item.price })}
                                                                </span>
                                                                {variantStorage && (
                                                                    <span className="px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500 text-[9px] font-black uppercase tracking-wider">
                                                                        {variantStorage}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="py-12 text-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Search size={24} className="text-gray-300" />
                                            </div>
                                            <p className="text-sm font-bold text-gray-900">{t("noResults")}</p>
                                            <p className="text-xs text-gray-400 mt-1">{t("tryDifferentSearch") || "Try searching for something else."}</p>
                                        </div>
                                    )}
                                </div>
                                {searchResults?.length > 0 && (
                                    <div className="p-3 bg-gray-50/50 border-t border-gray-100 text-center">
                                        <button 
                                            onClick={() => {
                                                router.push(`/search?q=${searchValue}`);
                                                setShowResults(false);
                                            }}
                                            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors"
                                        >
                                            {t("viewAllResults") || "View all results"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </form>

                <div className="flex items-center gap-2 md:gap-4">
                    <div className='flex items-center'>
                        <Select 
                            value={defaultValue}
                            onValueChange={onChangeLanguage}
                        >
                            <SelectTrigger className="w-auto gap-2.5 h-10 cursor-pointer bg-gray-50/50 hover:bg-gray-100 transition-all rounded-xl px-3 focus:ring-0 focus:ring-offset-0 group">
                                <SelectValue asChild>
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col items-start leading-none gap-0.5">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:text-primary transition-colors">
                                                {defaultValue}
                                            </span>
                                        </div>
                                        <Globe size={14} className="text-gray-300 group-hover:text-primary transition-colors ml-0.5" />
                                    </div>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent position="popper" align="end" sideOffset={8} className="rounded-2xl border-gray-100 shadow-2xl min-w-[150px] p-2 z-60">
                                <SelectGroup>
                                    <SelectLabel className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-3 py-2">
                                        {t("selectLanguage") || "Language"}
                                    </SelectLabel>
                                    {routing.locales.map((locale) => {
                                        const lang = LANGUAGES[locale as keyof typeof LANGUAGES];
                                        return (
                                            <SelectItem 
                                                key={locale} 
                                                value={locale}
                                                className="cursor-pointer py-3 px-3 focus:bg-primary/5 rounded-xl transition-colors mb-1 last:mb-0"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl leading-none filter drop-shadow-sm">{lang?.flag}</span>
                                                    <div className="flex flex-col overflow-hidden">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 truncate">
                                                            {lang?.name}
                                                        </span>
                                                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
                                                            {lang?.code}
                                                        </span>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

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
                                    <Link href={'/favourites'} className='cursor-pointer p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-full transition-all'>
                                        <HeartIcon className='cursor-pointer' size={22} />
                                    </Link>
                                    <CartDrawer user={session?.user!} />
                                </>
                        }
                    </div>

                    {
                        isLoggedIn ?
                            <UserInformation session={session}>
                                <Avatar className='w-11 h-11 border-2 object-cover border-white shadow-sm ring-1 ring-gray-100 cursor-pointer hover:ring-primary transition-all active:scale-95'>
                                    <AvatarImage className='object-cover' src={session?.user?.image!} alt={session?.user?.name!} />
                                    <AvatarFallback className='bg-gray-50 font-bold text-gray-400 select-none'>
                                        {session?.user?.name!?.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </UserInformation>
                            :
                            <Link href={'/auth/register'}>
                                <button className='cursor-pointer h-11 px-6 bg-gray-900 text-white rounded-xl font-bold text-sm tracking-wide shadow-sm hover:bg-black transition-all active:scale-95'>
                                    {t("loginRegister")}
                                </button>
                            </Link>
                    }
                </div>
            </div>
        </div>
    </header>
    )
}

export default TopNavBar
