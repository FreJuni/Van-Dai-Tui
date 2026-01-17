"use client";

import React, { useState, useEffect } from 'react';
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
import { toast } from 'react-toastify';
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
        variants: any[];
        condition: string;
        isFavourite: boolean;
        discount?: {
            discount: number;
            finalPrice: number;
            startDate: Date;
            endDate: Date;
        } | null;
    },
    user?: {
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
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !data.discount?.endDate) return;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const distance = new Date(data.discount!.endDate).getTime() - now;

            if (distance < 0) {
                setTimeLeft("EXPIRED");
                return false;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            return true;
        };

        // Calculate immediately
        const isActive = calculateTimeLeft();
        if (!isActive) return;

        const timer = setInterval(() => {
            const isActive = calculateTimeLeft();
            if (!isActive) clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, [data.discount?.endDate, isMounted]);

    const { execute, result, status } = useAction(addFavourites, {
        onSuccess: ({ data }) => {
            if (data.success) {
                toast.success(data.success);
            }
            if (data.error) {
                toast.error(data.error);
            }
        },
    });

    const handleFavouriteToggle = async (userId?: string, productId?: string) => {
        if (!userId) {
            toast.error("Please login to add to favourites");
            return;
        }
        if (!productId) return;
        execute({ userId, productId });
    };

    const finalPrice = data.discount 
        ? data.discount.finalPrice
        : data.price;
    

    return (
        <>
        <Card className="p-0 group gap-1 overflow-hidden border border-gray-100 transition-all duration-300 bg-white rounded-[6px]">
            {/* Image Section */}
            <div className="relative p-[6px] aspect-square overflow-hidden bg-gray-50">
                {data.discount && (
                    <>
                        <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-[4px] shadow-lg">
                            -{data.discount.discount}%
                        </div>
                        {timeLeft && (
                            <div className="absolute bottom-4 left-4 right-4 z-10 bg-black/60 backdrop-blur-md text-white text-[10px] font-black py-1.5 px-3 rounded-[6px] text-center border border-white/20">
                                {timeLeft === "EXPIRED" ? "SALE ENDED" : `Ends in: ${timeLeft}`}
                            </div>
                        )}
                    </>
                )}

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
                    href={`/listing-page/${data?.id}?variantName=${data?.variants[0]?.variantName}&listingTitle=${data?.title}&listingDescription=${data?.description}&listingPrice=${finalPrice}&listingImage=${data?.image}&variantId=${data?.variants[0]?.id}&productId=${data?.id}&variantColor=${data?.variants[0]?.productVariantColor?.color}&variantImage=${data?.variants[0]?.productVariantImage[0]?.image_url}&variantStorage=${data?.variants[0]?.productVariantOption[0]?.storage}&variantPrice=${finalPrice}`}
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
                        href={`/listing-page/${data.id}?variantName=${data?.variants[0]?.variantName}&listingTitle=${data?.title}&listingDescription=${data?.description}&listingPrice=${finalPrice}&listingImage=${data?.image}&variantId=${data?.variants[0]?.id}&productId=${data?.id}&variantColor=${data?.variants[0]?.productVariantColor?.color}&variantImage=${data?.variants[0]?.productVariantImage[0]?.image_url}&variantStorage=${data?.variants[0]?.productVariantOption[0]?.storage}&variantPrice=${finalPrice}`}
                    >
                        <h3 className='text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors duration-300 cursor-pointer'>
                            {data.title}
                        </h3>
                    </Link>
                    <div className="flex flex-col items-start gap-1">
                        {data.discount && (
                            <span className="text-lg font-black text-gray-500 line-through mb-0.5">
                                {priceFormatter({ price: data.price })}
                            </span>
                        )}
                        {data.originalPrice && data.originalPrice > data.price && !data.discount && (
                            <span className="text-lg font-black text-gray-500 line-through mb-0.5">
                                {priceFormatter({ price: data.originalPrice })}
                            </span>
                        )}
                        <span className='text-lg font-black text-primary'>
                            {priceFormatter({ price: finalPrice })}
                        </span>
                    </div>
                        <p className='text-sm font-medium text-gray-700 line-clamp-2 group-hover:text-primary transition-colors duration-300'>
                            {data.condition}
                        </p>
                </div>
            </CardContent>
        </Card>
        </>
    );
};
