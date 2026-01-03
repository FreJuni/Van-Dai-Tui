"use client";

import React from 'react'
import { useRouter, usePathname } from '@/src/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type VariantPickerProps = {
    id : string,
    variantName : string,
    productId : string,
    variantColor : string,
    variantImage : string,
    variantStorage : string,
    variantPrice : number,
    listingTitle : string,
    listingDescription : string,
    listingPrice : number,
    listingImage : string,
    variantId : string,  
}

const VariantPicker = ({
    id,
    variantName,
    productId,
    variantColor,
    variantImage,
    variantStorage,
    variantPrice,
    listingTitle,
    listingDescription,
    listingPrice,
    listingImage,
    variantId,
}: VariantPickerProps) => {
   const searchParams = useSearchParams();
    const router = useRouter();
    const selectedVariantColor = searchParams.get('variantColor') ;

    return (
        <Tooltip>
            <TooltipTrigger className='w-fit' >
                <div
                    onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set('variantName', variantName);
                        params.set('listingTitle', listingTitle);
                        params.set('listingDescription', listingDescription);
                        params.set('listingPrice', listingPrice.toString());
                        params.set('listingImage', listingImage);
                        params.set('variantId', variantId);
                        params.set('productId', productId);
                        params.set('variantColor', variantColor);
                        params.set('variantImage', variantImage);
                        params.set('variantStorage', variantStorage);
                        params.set('variantPrice', variantPrice.toString());
                        router.push(`/listing-page/${id}?${params.toString()}`)
                    }}
                    style={{ backgroundColor: variantColor }} className={cn(' w-6 h-6 rounded-sm cursor-pointer  border border-black', selectedVariantColor === variantColor ? 'opacity-100' : 'opacity-35')}>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>{variantName}</p>
            </TooltipContent>
        </Tooltip>

    )
}

export default VariantPicker