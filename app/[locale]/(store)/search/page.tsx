
import { getTranslations } from 'next-intl/server';
import { fetchAllProducts } from '@/server/actions/product';
import { FilterBar } from '@/components/shop/filter-bar';
import { ShopProductCard } from '@/components/shop/shop-product-card';
import { auth } from '@/server/auth';
import { Pagination } from '@/components/ui/pagination-custom';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
    const t = await getTranslations('Shop');
    const params = await searchParams;
    const session = await auth();
    
    // Parse params
    const page = Number(params.page) || 1;
    const pageSize = 8;
    const query = typeof params.q === 'string' ? params.q : '';
    const category = typeof params.category === 'string' ? params.category.split(',') : [];
    const brands = typeof params.brand === 'string' ? params.brand.split(',') : [];
    const minPrice = Number(params.minPrice) || undefined;
    const maxPrice = Number(params.maxPrice) || undefined;
    const condition = typeof params.condition === 'string' ? params.condition.split(',') : [];
    const sort = typeof params.sort === 'string' ? params.sort : 'relevance';

    // Fetch products using the new server-side logic
    const { items: allProducts, totalCount } = await fetchAllProducts({
        page,
        pageSize,
        q: query,
        category,
        brand: brands,
        minPrice,
        maxPrice,
        condition,
        sort
    });
    
    const totalPages = Math.ceil(totalCount / pageSize);

    // Map products to ShopProductCard format
    const mappedProducts = (allProducts || []).map((p: any) => {
        try {
            const firstVariant = p.productVariant && p.productVariant.length > 0 ? p.productVariant[0] : null;
            const image = firstVariant?.productVariantImage?.[0]?.image_url || '';
            
            return {
                id: p.id,
                title: p.title,
                description: p.description || '',
                price: p.productVariant[0].productVariantOption[0].price,
                image: image,
                brand: p.brand || "Tech Store",
                condition: p.productVariant[0].productVariantCondition?.condition || "New",
                isFavourite: p.favouriteProduct,
                variants: p.productVariant,
            };
        } catch (e) {
            console.error('Error mapping product:', p.id, e);
            return null;
        }
    }).filter(p => p !== null);

    return (
        <div className="min-h-screen bg-white">
            <main className=" px-6 md:px-12 lg:px-[100px] py-8 space-y-8">
                {/* Heading and Toggle Section */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            {totalCount}+ {query ? `"${query}" results` : (params.category || 'Products')}
                        </h1>
                        <p className="text-sm font-bold text-gray-400">
                            {t('discoverLatestTechDeals')}
                        </p>
                    </div>

                    {/* <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                        <span className="text-sm font-bold text-gray-600 mb-0.5">Save this search</span>
                        <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer ring-4 ring-white shadow-inner">
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-md translate-x-5" />
                        </div>
                    </div> */}
                </div>

                {/* Filter Bar */}
                <Suspense fallback={null}>
                   <FilterBar />
                </Suspense>

                {/* Grid */}
                <div>
                    {mappedProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                                {mappedProducts.map((product: any) => (
                                    <ShopProductCard key={product.id} data={product} user={session?.user} />
                                ))}
                            </div>
                            
                            <Suspense fallback={null}>
                                <Pagination totalPages={totalPages} currentPage={page} />
                            </Suspense>
                        </>
                    ) : (
                        <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-4 border-white shadow-2xl">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">{t('noProductsFound')}</h3>
                            <p className="text-gray-400 font-bold mt-2">{t('tryAdjustingYourFiltersOrSearchQuery')}</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
