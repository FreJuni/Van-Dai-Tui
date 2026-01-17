
import ImageCarousel from '@/components/listing-page/image-sliders';
import ListingDetails from '@/components/listing-page/listing-details';
import { db } from '@/server';
import { favouriteProduct, products } from '@/server/schema';
import { BackButton } from '@/components/ui/back-button';
import { auth } from '@/server/auth';
import { and, eq } from 'drizzle-orm';
import React, { Suspense } from 'react';
import { Metadata } from 'next';
import {cache} from 'react';
import { listingData } from '@/server/actions/listing-page';

type ListingPageParams = {
    params: Promise<{
        id: string
    }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

//Manual duplicate fetching data  by using cache
const getListingData = cache( async (productId : string, variantPrice?: number) => {
     const data = await listingData(productId, variantPrice);
    return data;
})

export const generateMetadata = async ({params, searchParams}: ListingPageParams): Promise<Metadata> => {
    const { id } = await params;
    const resolvedSearchParams = await searchParams;
    const price = Number(resolvedSearchParams.variantPrice) || undefined;
    const data = await getListingData(id, price);
    return {
        title : data?.productData?.title,
        description : data?.productData?.description,
        openGraph : {
            title : data?.productData?.title,
            description : data?.productData?.description,
            images : [
                {
                    url : data?.productData?.productVariant[0]?.productVariantImage[0]?.image_url!,
                    width : 1200,
                    height : 630,
                    alt : data?.productData?.title,
                }
            ]
        }
    }
}
 
const ListingPage = async (props: ListingPageParams) => {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const productId = params.id;
    const session = await auth();
    const price = Number(searchParams.variantPrice || searchParams.listingPrice) || undefined;

    const data = await getListingData(productId!, price);

    let isFavorite = false;
    if (session?.user?.id && productId) {
        const fav = await db.query.favouriteProduct.findFirst({
            where: and(
                eq(favouriteProduct.productId, productId),
                eq(favouriteProduct.userId, session.user.id)
            )
        });
        if (fav) isFavorite = true;
    }

  return (
    <div className='max-w-7xl mx-auto px-4 md:px-10 lg:px-20 mt-10 md:mt-14'>
        <div className="mb-6">
            <BackButton />
        </div>
        <div className='flex flex-col lg:flex-row gap-10 justify-center items-center lg:items-start'>
            <div className='w-full lg:w-auto flex justify-center'>
                <Suspense fallback={<div className="w-full h-[550px] bg-gray-100 animate-pulse rounded-xl" />}>
                     <ImageCarousel variant={data?.productData?.productVariant || []} />
                </Suspense>  
            </div>
            <div className='flex-1 w-full'>
                <Suspense fallback={<div>Loading...</div>}>
                    <ListingDetails 
                        data={data?.productData!}
                        discount={data?.discount}
                        userId={session?.user?.id}
                        isFavoriteInitial={isFavorite}
                    />
                </Suspense>
            </div>
        </div>
    </div>
  )
}

export default ListingPage