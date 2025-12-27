'use client';
import ProductForm from '@/components/product/product-form';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import React from 'react'


import { BackButton } from '@/components/ui/back-button';

const AddProductPage = () => {
    const t = useTranslations('Product');
    const searchParams = useSearchParams();
    const productId = searchParams.get('productId');

    return (
        <div className='mt-10 md:mt-20 w-max-full sm:w-full lg:w-3/4 md:w-4/5 mx-auto p-4 md:p-5'>
            <div className="mb-6">
                <BackButton />
            </div>
            <ProductForm productId={productId!} />
        </div>
    )
}

export default AddProductPage