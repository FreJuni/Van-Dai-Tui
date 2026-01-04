"use client";

import React from 'react'
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/src/i18n/navigation';

const AddProductBtn = () => {
    const t = useTranslations('Dashboard');
    const router = useRouter();

    const handleAddProduct = () => {
        // Navigating to the manage page without productId will trigger a reset in ProductForm
        router.push('/dashboard/products/manage');
    }
    return (
        <Button onClick={handleAddProduct} className='gap-2 h-12 cursor-pointer px-8 font-bold shadow-lg shadow-primary/20 rounded-2xl'>
            <Plus className='w-5 h-5' />
            {t('addProduct')}
        </Button>
    )
}

export default AddProductBtn