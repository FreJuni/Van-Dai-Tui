
import React from 'react';
import { getTranslations } from 'next-intl/server';
import { ShopSidebar } from '@/components/shop/shop-sidebar';
import { ShopToolbar } from '@/components/shop/shop-toolbar';
import { ShopProductCard } from '@/components/shop/shop-product-card';
import { Home, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchAllProducts } from '@/server/actions/product';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ 
    searchParams 
}: { 
    searchParams: { [key: string]: string | string[] | undefined } 
}) {
    const t = await getTranslations('Shop');
    console.log("HELLO",searchParams);

    
    // Fetch products
    const allProducts = await fetchAllProducts();
    
    // Filter Logic
    let filteredProducts = Array.isArray(allProducts) ? allProducts : [];
    
    // 1. Search Query
    const query = typeof searchParams.q === 'string' ? searchParams.q.toLowerCase() : '';
    if (query) {
        filteredProducts = filteredProducts.filter(p => 
            p.title.toLowerCase().includes(query) || 
            (p.description && p.description.toLowerCase().includes(query))
        );
    }

    console.log("HELLO",query);
    
    
    // 2. Category (Basic title matching as we don't have category column yet)
    // If user selects "Cameras", updated sidebar sends "Cameras".
    const category = typeof searchParams.category === 'string' ? searchParams.category.toLowerCase() : '';
    if (category) {
        // Simple heuristic: if title contains category name (rough fallback)
        // Or if we had a category field, we'd use that.
        // For "Cameras", we match "camera".
        // For "Laptops", we match "laptop".
        const keyword = category.replace('s', ''); // naive de-pluralize
        filteredProducts = filteredProducts.filter(p => 
            p.title.toLowerCase().includes(keyword) || 
            (p.description && p.description.toLowerCase().includes(keyword))
        );
    }
    
    // 3. Price (Max)
    // Slider sends "price" parameter (e.g. 260)
    // Actually our slider has defaultValue 260, but user might change it.
    // Wait, ShopSidebar Slider didn't have name attribute or push to URL?
    // In ShopSidebar I added onChange => console.log.
    // So Price filter IS NOT CONNECTED yet in Sidebar. To connect it, I need debounce update URL.
    // I left it as TODO in sidebar.
    // So here I won't filter by price yet unless I implemented it in Sidebar.
    
    // Map products to ShopProductCard format
    const mappedProducts = filteredProducts.map((p: any) => {
        const firstVariant = p.productVariant && p.productVariant.length > 0 ? p.productVariant[0] : null;
        // Check for productVariantImage (might be nested or different based on schema fetch)
        // In fetchAllProducts: with: { productVariant: { with: { productVariantImage: true } } }
        // So firstVariant should have productVariantImage array.
        const image = firstVariant?.productVariantImage?.[0]?.image_url || '';
        
        return {
            id: p.id,
            title: p.title,
            description: p.description || '',
            price: p.price,
            image: image,
            variants: p.productVariant,
            // Fallbacks for optional fields
            brand: "Tech Store", // or derive
            rating: 5,
            reviewsCount: 10,
        };
    });

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header / Breadcrumbs */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                            <Home className="w-4 h-4" />
                            {t('home')}
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                        <span className="font-bold text-gray-900">{t('title')}</span>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full lg:w-80 shrink-0">
                        <ShopSidebar />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-10">
                        {/* Description Banner */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                            <p className="text-sm leading-relaxed text-gray-500 max-w-4xl relative z-10">
                                {t('description')}
                            </p>
                        </div>

                        {/* Toolbar & Grid */}
                        <div>
                            <ShopToolbar count={mappedProducts.length} />
                            
                            {mappedProducts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {mappedProducts.map((product: any) => (
                                        <ShopProductCard key={product.id} data={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
                                    <h3 className="text-lg font-bold text-gray-900">No products found</h3>
                                    <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search query.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
