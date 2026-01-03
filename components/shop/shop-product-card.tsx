"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image';
import noImage from '@/public/images/no-image-available-icon-vector.jpg';
import { priceFormatter } from '@/helper/priceFormatter';
import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';
import { Star, ShoppingCart, HeartIcon } from 'lucide-react';
import { Link } from '@/src/i18n/navigation';

import { cn } from '@/lib/utils';
import { addFavourites } from '@/server/actions/favourite';
import { toast, ToastContainer } from 'react-toastify';
import { useAction } from 'next-safe-action/hooks';

type ShopProductCardProps = {
    data: {
        id: string;
        title: string;
        description: string;
        price: number;
        originalPrice?: number;
        image: string;
        brand?: string;
        badge?: string;
        badgeColor?: string;
        variants: any[]
        condition: string,
        isFavourite: boolean
    },
    user? : {
        id: string;
        name: string;
        address: string;
        role: string;
        phone_number: string;
        isOAuth: boolean;
    }
}

export const ShopProductCard = ({ data, user }: ShopProductCardProps) => {
    const t = useTranslations('Shop');

    const {execute,result, status} = useAction(addFavourites, {
        onSuccess : ({data}) => {
           if(data.success) {
             toast.success(data.success);
           }
           if(data.error) {
            toast.error(data.error);
           }
        },
    })

    const handleFavouriteToggle = async (userId? : string, productId? : string) => {
        if(!userId) {
            toast.error("Please login to add to favourites");
            return;
        }
        if(!productId) return;
        execute({userId, productId})
    }


    return (
        <>
        <Card className="p-0 group gap-1 overflow-hidden border border-gray-100 transition-all duration-300 bg-white rounded-[6px]">
            {/* Image Section */}
            <div className="relative p-[6px] aspect-square overflow-hidden bg-gray-50">
                {
                    user?.role !== 'admin' && (
                          <button className={cn(
                        "absolute top-4 right-4 z-10 px-2.5 py-1 rounded-[6px] text-[10px] font-black uppercase tracking-wider text-white shadow-lg",
                        "bg-primary",
                        status === "executing" && "bg-primary/50 cursor-not-allowed"
                    )}
                    disabled={status === 'executing'}
                    onClick={() => handleFavouriteToggle(user?.id, data.id)}
                    >
                         <HeartIcon className={cn('cursor-pointer',
                            data.isFavourite ? 'fill-red-800' : '',
                            status === "executing" && "text-gray-400 animate-pulse"
                         )} size={22} />
                    </button>
                    )
                }
                
                <Link 
                    href={`/listing-page/${data?.id}?variantName=${data?.variants[0]?.variantName}&listingTitle=${data?.title}&listingDescription=${data?.description}&listingPrice=${data?.price}&listingImage=${data?.image}&variantId=${data?.variants[0]?.id}&productId=${data?.id}&variantColor=${data?.variants[0]?.productVariantColor?.color}&variantImage=${data?.variants[0]?.productVariantImage[0]?.image_url}&variantStorage=${data?.variants[0]?.productVariantOption[0]?.storage}&variantPrice=${data?.variants[0]?.productVariantOption[0]?.price}`}
                    className="relative w-full h-full block rounded-[6px] overflow-hidden"
                >
                    {data.image ? (
                        <Image 
                            src={data.image} 
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            alt={data.title} 
                            className='object-cover transition-transform duration-700 group-hover:scale-110' 
                        />
                    ) : (
                        <Image src={noImage} fill alt={data.title} className='object-contain p-8 opacity-40' />
                    )}
                </Link>
            </div>

            {/* Content Section */}
            <CardContent className='p-[6px] space-y-3'>
                <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">{data.brand || "Tech Store"}</p>
                    <Link 
                        href={`/listing-page/${data.id}?variantName=${data?.variants[0]?.variantName}&listingTitle=${data?.title}&listingDescription=${data?.description}&listingPrice=${data?.price}&listingImage=${data?.image}&variantId=${data?.variants[0]?.id}&productId=${data?.id}&variantColor=${data?.variants[0]?.productVariantColor?.color}&variantImage=${data?.variants[0]?.productVariantImage[0]?.image_url}&variantStorage=${data?.variants[0]?.productVariantOption[0]?.storage}&variantPrice=${data?.variants[0]?.productVariantOption[0]?.price}`}
                    >
                        <h3 className='text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors duration-300 cursor-pointer'>
                            {data.title}
                        </h3>
                    </Link>
                    <div className="flex items-end gap-2">
                        <span className='text-lg font-black text-primary'>
                            {priceFormatter({ price: data.price })}
                        </span>
                        {data.originalPrice && data.originalPrice > data.price && (
                            <span className="text-sm font-bold text-gray-300 line-through mb-0.5">
                                {priceFormatter({ price: data.originalPrice })}
                            </span>
                        )}
                    </div>
                        <p className='text-sm font-medium text-gray-700 line-clamp-2 group-hover:text-primary transition-colors duration-300'>
                            {data.condition}
                        </p>
                </div>

                <div className='flex flex-col gap-4'>

                    {/* <Button className='w-full h-11 bg-primary hover:bg-black text-white rounded-2xl font-bold text-xs tracking-wider gap-2 group transition-all active:scale-95 shadow-lg shadow-primary/20'>
                        <ShoppingCart size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                        {t('addToCart')}
                    </Button> */}
                </div>
            </CardContent>
            <ToastContainer />
        </Card>
        </>
    );
};
