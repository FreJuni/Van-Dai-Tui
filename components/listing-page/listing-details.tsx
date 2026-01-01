"use client";

import React from 'react';
import { ProductsWithVariants } from '@/lib/infer-type';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import VariantPicker from './variant-picker';
import { cn } from '@/lib/utils';
import { priceFormatter } from '@/helper/priceFormatter';


type ListingDetailsProps = {
    data: ProductsWithVariants
}

const ListingDetails = ({data}: ListingDetailsProps) => {
    const t = useTranslations('ListingPage');
    const searchParams = useSearchParams();
    const router = useRouter();

    const currentVariant = React.useMemo(() => {
        const variantId = searchParams.get('variantId');
        return data.productVariant.find(v => v.id === variantId) || data.productVariant[0];
    }, [searchParams, data.productVariant]);

    const currentOption = React.useMemo(() => {
        const storage = searchParams.get('variantStorage');
        return currentVariant?.productVariantOption.find(o => o.storage === storage) || currentVariant?.productVariantOption[0];
    }, [searchParams, currentVariant]);

    const variantName = searchParams.get('variantName') || currentVariant?.variantName;
    const variantStorage = searchParams.get('variantStorage') || currentOption?.storage;
    const variantPrice = Number(searchParams.get('variantPrice')) || currentOption?.price || data.price || 0;
    
    const conditionColors: Record<string, string> = {
        'New': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'Used': 'bg-amber-50 text-amber-700 border-amber-100',
        'Refurbished': 'bg-blue-50 text-blue-700 border-blue-100'
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
    <div className='flex flex-col gap-2 mt-2'>
        <div className=''><span className='text-lg font-medium'>{t('storage')}</span> : <span className='font-normal'>{variantStorage} GB</span></div>
        <div className='flex gap-3 items-center lg:justify-start flex-wrap'>
            {
                currentVariant?.productVariantOption?.sort((a, b) => Number(a?.storage) - Number(b?.storage))?.map((option, i) => {
                    return (
                        <div key={i}>
                            <div 
                                onClick={() => { 
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.set('variantStorage', option.storage);
                                    params.set('variantPrice', option.price.toString());
                                    params.set('variantId', currentVariant.id);
                                    router.push(`/listing-page/${data.id}?${params.toString()}`, { scroll: false });
                                }} 
                                className={cn('border-2 border-gray-300 px-3 py-1 rounded-sm cursor-pointer select-none w-fit transition-all hover:border-blue-200', option.storage === variantStorage && 'border-blue-500 bg-blue-50')}
                            >
                                {option.storage} GB
                            </div>
                        </div>
                    )
                })
            }
        </div>
        
    </div>
    </div>
  )
}

export default ListingDetails