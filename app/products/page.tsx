import ProductCard from '@/components/productCard/product-card';
import { fetchAllProducts } from '@/server/actions/product';
import React from 'react';
import noImage from '@/public/images/no-image-available-icon-vector.jpg';
import { Plus, Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';

const Products = async () => {
    const products = await fetchAllProducts();
    const t = await getTranslations('Product');

    const productData = products?.map((product) => {
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
        <div className='my-10 mx-6 md:mx-12 max-w-7xl lg:mx-auto' >
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b pb-6 border-gray-100'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight text-gray-900'>{t('yourProducts')}</h1>
                    <p className='text-gray-500 mt-1'>Manage and organize your product catalog.</p>
                </div>
                <Link href="/add-product">
                    <Button className='gap-2 h-11 cursor-pointer px-6 font-semibold shadow-sm'>
                        <Plus className='w-5 h-5' />
                        {t('addProduct')}
                    </Button>
                </Link>
            </div>

            {productData && productData.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
                    {productData.map(p => (
                        <ProductCard key={p.id} data={p} />
                    ))}
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 mt-10'>
                    <div className='bg-white p-4 rounded-full shadow-sm mb-4'>
                        <Package className='w-10 h-10 text-gray-400' />
                    </div>
                    <h3 className='text-xl font-semibold text-gray-900'>No products found</h3>
                    <p className='text-gray-500 max-w-xs text-center mt-2'>
                        You haven't added any products yet. Start by creating your first listing.
                    </p>
                    <Link href="/add-product" className='mt-6'>
                        <Button variant="outline" className='gap-2 cursor-pointer'>
                            <Plus className='w-4 h-4' />
                            {t('addProduct')}
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default Products
