import ProductCard from '@/components/productCard/product-card';
import {   fetchFavouriteProducts } from '@/server/actions/product';
import React from 'react';
import noImage from '@/public/images/no-image-available-icon-vector.jpg';
import { Plus, Package, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';
import { ShopProductCard } from '@/components/shop/shop-product-card';
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';

const FavouritesPage = async () => {
    const products = await fetchFavouriteProducts();
    const t = await getTranslations('Favourites');
    const session = await auth();

    if(!session?.user ) return redirect('/');
    
      // Map products to ShopProductCard format
    const mappedProducts = products.map((p: any) => {
        try {
            const firstVariant = p.products.productVariant && p.products.productVariant.length > 0 ? p.products.productVariant[0] : null;
            const image = firstVariant?.productVariantImage?.[0]?.image_url || '';
            
            return {
                id: p.products.id,
                title: p.products.title,
                description: p.products.description || '',
                price: p.products.price,
                image: image,
                brand: p.products.brand || "Tech Store",
                condition: p.products.productVariant[0].productVariantCondition?.condition || "New",
                isFavourite: p.favouriteProduct,
                variants: p.products.productVariant,
            };

        } catch (e) {
            console.error('Error mapping product:', p.id, e);
            return null;
        }
    }).filter(p => p !== null);

    return (
        <div className='px-6 md:px-12 lg:px-[100px]' >
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b pb-6 border-gray-100'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight text-gray-900'>{t('yourFavourites')}</h1>
                    <p className='text-gray-500 mt-1'>{t('yourFavouritesDescription')}</p>
                </div>
            </div>

            {mappedProducts && mappedProducts.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
                    {mappedProducts.map(p => (
                        <ShopProductCard key={p.id} data={p} user={session?.user!} />
                    ))}
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 mt-10'>
                    <div className='bg-white p-4 rounded-full shadow-sm mb-4'>
                        <Package className='w-10 h-10 text-gray-400' />
                    </div>
                    <h3 className='text-xl font-semibold text-gray-900'>No favourite products found</h3>
                    <p className='text-gray-500 max-w-xs text-center mt-2'>
                        You haven't added any favourite products yet.
                    </p>
                    <Link href="/search" className='mt-6'>
                        <Button variant="outline" className='gap-2 cursor-pointer'>
                            <Search className='w-4 h-4' />
                            {t('addToFavourites')}
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default FavouritesPage;
