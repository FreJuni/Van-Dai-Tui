'use client';
import ProductForm from '@/components/product/product-form';
import { useTranslations } from 'next-intl';
import React from 'react'


const AddProductPage = () => {
    const t = useTranslations('Product');

    return (
        <div className='mt-20 w-max-full sm:w-full lg:w-3/4 md:w-4/5 mx-auto p-5'>
            <h2 className='text-2xl font-bold mb-4 flex items-start'>{t('addProduct')}</h2>
            <ProductForm />
        </div>
    )
}

export default AddProductPage