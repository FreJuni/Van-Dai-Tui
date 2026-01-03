"use client";

import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image';
import noImage from '../../public/images/no-image-available-icon-vector.jpg';
import { useRouter, usePathname } from '@/src/i18n/navigation';
import { useSearchParams } from 'next/navigation';

import { ProductsWithVariants, VariantsWithImagesTags, VariantsWithProduct } from '@/lib/infer-type';
import { cn } from '@/lib/utils';

type ImageCarouselProps = {
    variant : VariantsWithImagesTags[]
}

const ImageCarousel = ({variant} : ImageCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const searchParams = useSearchParams();
  const variantName = searchParams.get('variantName');
  const [activeIndex, setActiveIndex] = useState([0]);

  useEffect(() => {
    if (!api) {
      return
    }
 
    api.on("slidesInView", (e) => {
      setActiveIndex(e.slidesInView)
    })
  }, [api]);

  return (
    <Carousel setApi={setApi} opts={{loop: true }} className='w-full lg:w-[550px]'>
      <CarouselContent>
         {
                   variant?.length > 0 ? variant?.map(v => v.variantName === variantName && v.productVariantImage.map(v => {
                        return v.image_url ?
                            <CarouselItem key={v.id}>
                                <Image
                                    className="w-full h-auto aspect-square object-cover rounded-xl"
                                    src={v.image_url}
                                    alt={v.name}
                                    width={550}
                                    height={550}
                                    priority
                                />
                            </CarouselItem>
                            : <CarouselItem key={v.id}>
                                <Image
                                    className="w-full h-auto aspect-square object-cover rounded-xl"
                                    src={noImage}
                                    alt={v.name}
                                    width={550}
                                    height={550}
                                />
                            </CarouselItem>
                    }))
                : <CarouselItem>
                <Image
                    className="w-full h-auto aspect-square object-cover rounded-xl"
                    src={noImage}
                    alt="no-image"
                    width={550}
                    height={550}
                />
            </CarouselItem>
                }
      </CarouselContent>
       <div className='flex justify-center lg:justify-start w-full gap-2 mt-2 overflow-x-auto pb-2'>
             {
                    variant?.map(v => v.variantName === variantName && v.productVariantImage.map((v, index) => {
                        
                        return v.image_url ?
                            <div key={v.id} className="shrink-0">
                                <Image
                                    onClick={() => {
                                        api?.scrollTo(index);
                                    }}
                                    className={cn(`w-[70px] h-[60px] md:w-[80px] md:h-[70px] object-cover cursor-pointer rounded-md border-2 border-slate-300 transition-all`, index === activeIndex[0] ? "border-primary opacity-100" : "opacity-50 hover:opacity-100")}
                                    src={v.image_url}
                                    alt={v.name}
                                    width={80}
                                    height={70}
                                />
                            </div>
                            : <div key={v.id} className="shrink-0">
                                <Image
                                    className="w-[70px] h-[60px] md:w-[80px] md:h-[70px] object-cover rounded-xl"
                                    src={noImage}
                                    alt={v.name}
                                    width={80}
                                    height={70}
                                />
                            </div>
                    }))
                }
        </div>
    </Carousel>
  )
}

export default ImageCarousel