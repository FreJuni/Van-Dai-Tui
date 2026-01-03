import ProductCard from '@/components/productCard/product-card';
import {  fetchAllAdminProducts } from '@/server/actions/product';
import React from 'react';
import noImage from '@/public/images/no-image-available-icon-vector.jpg';
import { Plus, Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';
import { Pagination } from '@/components/ui/pagination-custom';
import ProductSearchInput from '@/components/dashboard/product-search-input';

const ProductsPage = async ({ 
    searchParams 
}: { 
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) => {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const pageSize = 8;
    const searchValue = params.q || '';

    const { items: products, totalCount } = await fetchAllAdminProducts(page, pageSize, searchValue as string);
    const t = await getTranslations('Dashboard');
    
    const totalPages = Math.ceil(totalCount / pageSize);

    const productData = products?.map((product: any) => {
        if (product.productVariant.length === 0) {
            return {
                id: product.id,
                title: product.title,
                description: product.description,
                price: product.price,
                image: noImage.src,
                variants: [],
            }
        } else {
            return {
                id: product.id,
                title: product.title,
                description: product.description,
                price: product.price,
                image: product.productVariant[0].productVariantImage[0].image_url,
                variants: product.productVariant,
            }
        }
    })

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6'>
                <div>
                    <h1 className='text-4xl font-black text-gray-900 tracking-tighter'>{t('manageProducts')}</h1>
                    <p className='text-gray-500 mt-2 font-medium'>{t('addEditAndOrganizeYourEntireProductCatalog')}</p>
                </div>
                <Link href="/dashboard/products/manage">
                    <Button className='gap-2 h-12 cursor-pointer px-8 font-bold shadow-lg shadow-primary/20 rounded-2xl'>
                        <Plus className='w-5 h-5' />
                        {t('addProduct')}
                    </Button>
                </Link>
            </div>

            <ProductSearchInput />

            {/* List */}
            {productData && productData.length > 0 ? (
                <>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {productData.map(p => (
                            <ProductCard key={p.id} data={p} />
                        ))}
                    </div>

                    <div className="flex justify-center pt-8">
                        <Pagination totalPages={totalPages} currentPage={page} />
                    </div>
                </>
            ) : (
                <div className='flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm mt-10'>
                    <div className='bg-primary/5 p-6 rounded-3xl mb-6'>
                        <Package className='w-12 h-12 text-primary/40' />
                    </div>
                    <h3 className='text-2xl font-black text-gray-900'>{t('noProductsFound')}</h3>
                    <p className='text-gray-400 max-w-xs text-center mt-2 font-medium'>
                        {t('youHaveNotAddedAnyProductsYetStartByCreatingYourFirstListing')}
                    </p>
                    <Link href="/dashboard/products/manage" className='mt-8'>
                        <Button variant="outline" className='gap-2 h-11 cursor-pointer px-6 font-bold rounded-xl border-gray-200 hover:bg-gray-50'>
                            <Plus className='w-4 h-4' />
                            {t('addProduct')}
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default ProductsPage;
