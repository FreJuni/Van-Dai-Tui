"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image';
import noImage from '@/public/images/no-image-available-icon-vector.jpg';
import { priceFormatter } from '@/helper/priceFormatter';
import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';
import { Star, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type ShopProductCardProps = {
    data: {
        id: string;
        title: string;
        description: string;
        price: number;
        originalPrice?: number;
        image: string;
        rating?: number;
        reviewsCount?: number;
        brand?: string;
        badge?: string;
        badgeColor?: string;
        variants: any[]
    }
}

export const ShopProductCard = ({ data }: ShopProductCardProps) => {
    const t = useTranslations('Shop');

    const renderStars = (rating: number = 5) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                        key={star} 
                        size={12} 
                        className={cn(
                            "transition-colors",
                            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                        )} 
                    />
                ))}
            </div>
        );
    };

    return (
        <Card className="group overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1.5 bg-white rounded-3xl">
            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden bg-gray-50 p-4">
                {data.badge && (
                    <div className={cn(
                        "absolute top-4 left-4 z-10 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-white shadow-lg",
                        data.badgeColor || "bg-primary"
                    )}>
                        {data.badge}
                    </div>
                )}
                
                <Link 
                    href={`/listing-page/${data?.id}`}
                    className="relative w-full h-full block rounded-2xl overflow-hidden"
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
            <CardContent className='p-6 space-y-3'>
                <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">{data.brand || "Tech Store"}</p>
                    <Link href={`/listing-page/${data.id}`}>
                        <h3 className='text-sm font-bold text-gray-900 line-clamp-2 min-h-10 group-hover:text-primary transition-colors duration-300'>
                            {data.title}
                        </h3>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    {renderStars(data.rating)}
                    <span className="text-[11px] font-bold text-gray-300">({data.reviewsCount || 0})</span>
                </div>

                <div className='pt-2 flex flex-col gap-4'>
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

                    <Button className='w-full h-11 bg-primary hover:bg-black text-white rounded-2xl font-bold text-xs tracking-wider gap-2 group transition-all active:scale-95 shadow-lg shadow-primary/20'>
                        <ShoppingCart size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                        {t('addToCart')}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
