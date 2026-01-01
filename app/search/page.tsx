
import { getTranslations } from 'next-intl/server';
import { fetchAllProducts } from '@/server/actions/product';
import { FilterBar } from '@/components/shop/filter-bar';
import { ShopProductCard } from '@/components/shop/shop-product-card';
import Link from 'next/link';
import { auth } from '@/server/auth';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
    const t = await getTranslations('Shop');
    const params = await searchParams;
    const session = await auth();
    
    // Fetch products
    const allProducts = await fetchAllProducts();
    console.log('Total products fetched:', allProducts);
    
    // Filter Logic
    let filteredProducts = Array.isArray(allProducts) ? allProducts : [];
    
    // 1. Search Query
    const query = typeof params.q === 'string' ? params.q.toLowerCase() : '';
    if (query) {
        filteredProducts = filteredProducts.filter(p => 
            p.title.toLowerCase().includes(query) || 
            (p.description && p.description.toLowerCase().includes(query))
        );
    }

    // 2. Category
    const category = typeof params.category === 'string' ? params.category.split(',') : [];
    if (category.length > 0) {
        filteredProducts = filteredProducts.filter(p => 
            category.some(cat => p.category?.toLowerCase() === cat.toLowerCase())
        );
    }

    // 3. Brand
    const brands = typeof params.brand === 'string' ? params.brand.split(',') : [];
    if (brands.length > 0) {
        filteredProducts = filteredProducts.filter(p => 
            brands.some(b => p.brand?.toLowerCase() === b.toLowerCase())
        );
    }

    // 4. Condition
    const conditions = typeof params.condition === 'string' ? params.condition.split(',') : [];
    if (conditions.length > 0) {
        filteredProducts = filteredProducts.filter(p => 
            conditions.some(c => (p as any).productVariant[0].productVariantCondition?.condition?.toLowerCase() === c.toLowerCase())
        );
    }

    // 5. Price Range
    const minPrice = Number(params.minPrice) || 0;
    const maxPrice = Number(params.maxPrice) || 1000000;
    if (minPrice > 0 || maxPrice < 1000000) {
        filteredProducts = filteredProducts.filter(p => p.productVariant[0].productVariantOption[0].price >= minPrice && p.productVariant[0].productVariantOption[0].price <= maxPrice);
    }

    // 6. Sorting
    const sort = typeof params.sort === 'string' ? params.sort : 'relevance';
    if (sort === 'price-low') {
        filteredProducts.sort((a, b) => a.productVariant[0].productVariantOption[0].price - b.productVariant[0].productVariantOption[0].price);
    } else if (sort === 'price-high') {
        filteredProducts.sort((a, b) => b.productVariant[0].productVariantOption[0].price - a.productVariant[0].productVariantOption[0].price);
    } else if (sort === 'newest') {
        filteredProducts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Map products to ShopProductCard format
    const mappedProducts = filteredProducts.map((p: any) => {
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
    console.log('Final mapped products:', mappedProducts.length);

    return (
        <div className="min-h-screen bg-white">
            <main className=" px-6 md:px-12 lg:px-[100px] py-8 space-y-8">
                {/* Heading and Toggle Section */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            {mappedProducts.length}+ {query ? `"${query}" results` : (params.category || 'Products')}
                        </h1>
                        <p className="text-sm font-bold text-gray-400">
                            Discover the latest tech deals on our store. Amazing prices, every day.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                        <span className="text-sm font-bold text-gray-600 mb-0.5">Save this search</span>
                        <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer ring-4 ring-white shadow-inner">
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-md translate-x-5" />
                        </div>
                    </div>
                </div>

                {/* Filter Bar */}
                <FilterBar />

                {/* Grid */}
                <div>
                    {mappedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                            {mappedProducts.map((product: any) => (
                                <ShopProductCard key={product.id} data={product} user={session?.user!} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-4 border-white shadow-2xl">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">No products found</h3>
                            <p className="text-gray-400 font-bold mt-2">Try adjusting your filters or search query.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
