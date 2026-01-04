
import ProductForm from '@/components/product/product-form';
import React from 'react'
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';
import { ChevronLeft, Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Link } from '@/src/i18n/navigation';
import AddProductBtn from '@/components/product/add-product-btn';

const ManageProductPage = async (props: {
    searchParams: Promise<{ productId?: string }>
}) => {
    const searchParams = await props.searchParams;
    const productId = searchParams.productId;
    const session = await auth();
    const t = await getTranslations('Dashboard');

    if(!session?.user || session?.user?.role !== 'admin') {
        redirect('/')
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6'>
                <div>
                <Link 
                    href="/dashboard/products" 
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors mb-4 group"
                >
                    <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    {t('backToProducts')}
                </Link>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter">{t('manageProduct')}</h1>
                <p className="text-gray-500 mt-2 font-medium">{t('createANewProductOrUpdateAnExistingOne')}</p>
            </div>

                <AddProductBtn />
            </div>

            <div className='bg-white rounded-[3rem] border border-gray-100 shadow-sm'>
                <ProductForm key={productId || 'new'} />
            </div>
        </div>
    )
}

export default ManageProductPage
