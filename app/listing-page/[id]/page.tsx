import ImageCarousel from '@/components/listing-page/image-sliders';
import ListingDetails from '@/components/listing-page/listing-details';
import { db } from '@/server';
import { products } from '@/server/schema';
import { eq } from 'drizzle-orm';
import React, { Suspense } from 'react';

type ListingPageParams = {
    params : {
        id : string
    }
}

export async function generateStaticParams() {
    const data = await db.query.products.findMany({
    with : {
        productVariant : {
            with : {
                productVariantOption : true,
                productVariantColor : true,
                productVariantImage : true,
            }
        }
    }
  })

  if(data) {
    const arrIds = data.map(d => ({
            id: d.id.toString()
        }))

    return arrIds;
  }

  return [];

}
 
import { BackButton } from '@/components/ui/back-button';

const ListingPage = async ({params} : ListingPageParams) => {
    const productId = await params?.id;

    const data = await db.query.products.findFirst({
        where : eq(products.id, productId),
        with : {
            productVariant : {
                with : {
                    productVariantOption : true,
                    productVariantColor : true,
                    productVariantImage : true,
                }
            }
        }
    })

  return (
    <div className='max-w-7xl mx-auto px-4 md:px-10 lg:px-20 mt-10 md:mt-14'>
        <div className="mb-6">
            <BackButton />
        </div>
        <div className='flex flex-col lg:flex-row gap-10 justify-center items-center lg:items-start'>
            <div className='w-full lg:w-auto flex justify-center'>
                <ImageCarousel variant={data?.productVariant || []} />
            </div>
            <div className='flex-1 w-full'>
                <Suspense fallback={<div>Loading...</div>}>
                    <ListingDetails data={data!} />
                </Suspense>
            </div>
        </div>
    </div>
  )
}

export default ListingPage