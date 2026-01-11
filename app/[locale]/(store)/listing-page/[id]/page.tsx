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

type ListingPageParams = {
    params : {
        id : string
    }
}

//Manual duplicate fetching data  by using cache
const getListingData = cache( async (productId : string) => {
     const data = await db.query.products.findFirst({
        where : eq(products.id, productId),
        with : {
            productVariant : {
                with : {
                    productVariantOption : true,
                    productVariantColor : true,
                    productVariantImage : true,
                    productVariantCondition : true,
                }
            }
        }
    })

    return data;
})

export const generateMetadata = async ({params} : ListingPageParams): Promise<Metadata> => {
    const productId = await params?.id;
    const data = await getListingData(productId!);
    return {
        title : data?.title,
        description : data?.description,
        openGraph : {
            title : data?.title,
            description : data?.description,
            images : [
                {
                    url : data?.productVariant[0]?.productVariantImage[0]?.image_url!,
                    width : 1200,
                    height : 630,
                    alt : data?.title,
                }
            ]
        }
    }
}

export const dynamic = 'force-dynamic';
 
const ListingPage = async ({params} : ListingPageParams) => {
    const productId = await params?.id;
    const session = await auth();

    const data = await getListingData(productId!);

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
                     <ImageCarousel variant={data?.productVariant || []} />
                </Suspense>  
            </div>
            <div className='flex-1 w-full'>
                <Suspense fallback={<div>Loading...</div>}>
                    <ListingDetails 
                        data={data!} 
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