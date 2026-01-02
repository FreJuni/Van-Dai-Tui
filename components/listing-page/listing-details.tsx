"use client";

import React, { useState } from 'react';
import { ProductsWithVariants } from '@/lib/infer-type';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import VariantPicker from './variant-picker';
import { cn } from '@/lib/utils';
import { priceFormatter } from '@/helper/priceFormatter';
import { addFavourites } from '@/server/actions/favourite';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';
import { useCartStore } from '@/lib/cart';


type ListingDetailsProps = {
    data: ProductsWithVariants
    userId?: string
    isFavoriteInitial?: boolean
}

const ListingDetails = ({data, userId, isFavoriteInitial = false}: ListingDetailsProps) => {
    const t = useTranslations('ListingPage');
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(isFavoriteInitial);
    const [isLoadingFav, setIsLoadingFav] = useState(false);
    const { addToCart } = useCartStore();

    const currentVariant = React.useMemo(() => {
        const variantId = searchParams.get('variantId');
        return data?.productVariant?.find(v => v.id === variantId) || data?.productVariant?.[0];
    }, [searchParams, data?.productVariant]);

    const currentOption = React.useMemo(() => {
        const storage = searchParams.get('variantStorage');
        return currentVariant?.productVariantOption?.find(o => o.storage === storage) || currentVariant?.productVariantOption?.[0];
    }, [searchParams, currentVariant]);

    const variantName = searchParams.get('variantName') || currentVariant?.variantName;
    const variantStorage = searchParams.get('variantStorage') || currentOption?.storage;
    const variantPrice = Number(searchParams.get('variantPrice')) || currentOption?.price || data.price || 0;
    
    const conditionColors: Record<string, string> = {
        'New': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'Used': 'bg-amber-50 text-amber-700 border-amber-100',
        'Refurbished': 'bg-blue-50 text-blue-700 border-blue-100'
    }

    const handleAddFavorite = async () => {
        if (!userId) {
            toast.error("Please login to add to favorites");
            return;
        }
        setIsLoadingFav(true);
        // Optimistic update
        const newFavState = !isFavorite;
        setIsFavorite(newFavState);

        try {
            const res = await addFavourites({ productId: data.id, userId });
            if (res?.data?.error) {
                toast.error(res.data.error);
                setIsFavorite(!newFavState); // Revert on error
            } else if (res?.data?.success) {
                toast.success(res.data.success);
            }
        } catch (error) {
            toast.error("Something went wrong");
            setIsFavorite(!newFavState);
        } finally {
            setIsLoadingFav(false);
        }
    };

    const handleAddToCart = () => {
        if (!currentVariant || !currentOption) return;

        addToCart({
            userId : userId || '',
            id: data.id,
            title: data.title,
            image: currentVariant.productVariantImage[0]?.image_url || '',
            price: variantPrice,
            variant: {
                variantId: currentVariant.id,
                variantName: currentVariant.variantName,
                storage: currentOption.storage,
            },
            quantity: 1,
        });
        toast.success("Added to cart");
    }

  return (
    <div className='flex flex-col gap-4 lg:text-left'>
    <p className='text-3xl md:text-4xl font-bold'>{data.title}</p>
    <div className='text-muted-foreground' dangerouslySetInnerHTML={{__html: data.description || ''}}></div>
    <div className='flex flex-col gap-4 mt-2'>
        <div className='flex items-center gap-4 flex-wrap'>
            <p className='text-3xl md:text-4xl font-bold text-primary'>{priceFormatter({price: variantPrice})}</p>
            {currentVariant?.productVariantCondition?.condition && (
                <div className={cn(
                    'px-3 py-1 text-xs font-bold rounded-full border shadow-sm uppercase tracking-wider',
                    conditionColors[currentVariant.productVariantCondition.condition] || 'bg-gray-50 text-gray-700 border-gray-100'
                )}>
                   {currentVariant.productVariantCondition.condition}
                </div>
            )}
        </div>
        <div className='flex flex-col gap-2'>
            <div className=''><span className='text-lg font-medium'>{t('color')}</span> : <span className='font-normal'>{variantName}</span></div>
            <div className='flex gap-3 items-center  lg:justify-start'>
                {
                    data?.productVariant?.map((variant ,i) => {
                        return (
                            <VariantPicker
                                    key={i}
                                    id={data.id}
                                    variantName={variant.variantName}
                                    productId={variant.productId}
                                    variantColor={variant.productVariantColor.color}
                                    variantImage={variant.productVariantImage[0]?.image_url || ''}
                                    variantStorage={variant.productVariantOption[0]?.storage || ''}
                                    variantPrice={variant.productVariantOption[0]?.price || 0}
                                    listingTitle={data.title}
                                    listingDescription={data.description}
                                    listingPrice={data.price || 0}
                                    listingImage={data.productVariant[0]?.productVariantImage[0]?.image_url || ''}
                                    variantId={variant.id}
                                />
                        )
                    })
                }
            </div>
        </div>
    </div>
    <div className='flex flex-col gap-6 mt-4'>
        {/* Storage Selection */}
        <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
                <span className='text-lg font-bold text-gray-900'>{t('storage')}</span>
            </div>
            <div className='flex flex-wrap gap-2'>
                {
                    currentVariant?.productVariantOption?.sort((a, b) => Number(a?.storage) - Number(b?.storage))?.map((option, i) => {
                        const isSelected = option.storage === variantStorage;
                        return (
                            <div 
                                key={i}
                                onClick={() => { 
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.set('variantStorage', option.storage);
                                    params.set('variantPrice', option.price.toString());
                                    params.set('variantId', currentVariant.id);
                                    router.push(`/listing-page/${data.id}?${params.toString()}`, { scroll: false });
                                }} 
                                className={cn(
                                    'cursor-pointer px-5 py-2.5 rounded-xl border text-sm font-bold transition-all duration-200 select-none flex items-center justify-center min-w-20',
                                    isSelected 
                                        ? 'bg-black text-white border-black shadow-md transform scale-105' 
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                )}
                            >
                                {option.storage} GB
                            </div>
                        )
                    })
                }
            </div>
        </div>

        {/* Add To Cart Section */}
        <div className="flex flex-col gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="flex gap-4">
                <button 
                    onClick={handleAddToCart}
                    className="flex-1 cursor-pointer bg-black text-white h-14 rounded-2xl font-bold text-lg hover:bg-gray-900 transition-all shadow-lg active:scale-[0.98]"
                >
                    Add to Cart
                </button>
                <button 
                    onClick={handleAddFavorite}
                    disabled={isLoadingFav}
                    className={cn(
                        "aspect-square cursor-pointer h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 active:scale-90 disabled:opacity-50",
                        isFavorite 
                            ? "bg-red-50 border-red-100 text-red-600 hover:bg-red-100/80 shadow-inner" 
                            : "border-gray-100 text-gray-300 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-500"
                    )}
                >
                    <Heart 
                        size={26} 
                        className={cn(
                            "transition-all duration-300 ease-in-out", 
                            isFavorite ? "fill-red-600 scale-110 drop-shadow-sm" : "scale-100"
                        )} 
                    />
                </button>
            </div>
            <p className="text-center text-xs font-medium text-gray-400">
                Free shipping on all orders • 30-day money-back guarantee
            </p>
        </div>
        
    </div>
    </div>
  )
}

export default ListingDetails