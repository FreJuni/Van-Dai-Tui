import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/src/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { fetchAllProducts } from '@/server/actions/product';
import { ShopProductCard } from '../shop/shop-product-card';
import { Button } from '../ui/button';
import { auth } from '@/server/auth';

export const NewArrivals = async () => {
    const t = await getTranslations("LandingPage");
    const session = await auth();

    // Fetch latest 4 products
    const { items: products } = await fetchAllProducts({ 
        sort: 'newest', 
        pageSize: 4 
    });

    if (!products || products.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900">{t("newArrivals")}</h2>
                        <div className="h-1.5 w-20 bg-primary rounded-full mt-2 mx-auto md:mx-0" />
                    </div>
                    <Link className='cursor-pointer' href="/search?sort=newest">
                        <Button  variant="outline" className="hidden cursor-pointer md:flex gap-2 rounded-xl font-bold border-gray-200 hover:bg-white hover:border-gray-300">
                            {t("viewAll")}
                            <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => {
                         const mappedProduct = {
                            ...product,
                            price: product.price || 0,
                            brand: product.brand || undefined,
                            variants: product.productVariant,
                            image: product.productVariant?.[0]?.productVariantImage?.[0]?.image_url || "",
                            condition: product.productVariant?.[0]?.productVariantCondition?.condition || "New",
                            isFavourite: false
                        };

                        return (
                            <ShopProductCard 
                                key={product.id} 
                                data={mappedProduct} 
                                user={session?.user as any}
                            />
                        )
                    })}
                </div>

                {/* Mobile View All Button */}
                <div className="mt-8 flex justify-center md:hidden">
                    <Link href="/search?sort=newest" className="w-full">
                        <Button variant="outline" className="w-full h-12 gap-2 rounded-xl font-bold border-gray-200 bg-white cursor-pointer">
                            {t("viewAll")}
                            <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};
