"use client";

import React from 'react';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from 'next/image';
import noImage from '@/public/images/no-image-available-icon-vector.jpg';
import { priceFormatter } from '@/helper/priceFormatter';
import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { deleteProduct } from '@/server/actions/product';
import { toast, ToastContainer } from 'react-toastify';
import { useAction } from 'next-safe-action/hooks';
import { cn } from '@/lib/utils';
import VariantModal from './variant-modal';
import { CirclePlus } from 'lucide-react';
import Link from 'next/link';

type ProductCardProps = {
    data: {
        id: string;
        title: string;
        description: string;
        price: number;
        image: string;
        variants: any[]
    }
}

const ProductCard = ({ data }: ProductCardProps) => {
    const t = useTranslations('Product');
    const router = useRouter();

    const handleEdit = (productId: string) => {
        router.push(`/dashboard/products/manage?productId=${productId}`);
    }

    const { execute, status, result } = useAction(deleteProduct, {
        onSuccess: (response) => {
            if (response?.data?.success) {
                toast.success(response.data.success);
                router.refresh();
            }

            if (response?.data?.error) {
                toast.error(response.data.error);
            }
        }
    })

    const handleDelete = (productId: string) => {
        execute({ productId });
    }



    return (
        <Card className="p-0 gap-1 rounded-[6px] group overflow-hidden border-gray-100 bg-white">
            <Link 
                href={`/listing-page/${data?.id}?variantName=${data?.variants[0]?.variantName}&listingTitle=${data?.title}&listingDescription=${data?.description}&listingPrice=${data?.price}&listingImage=${data?.image}&variantId=${data?.variants[0]?.id}&productId=${data?.id}&variantColor=${data?.variants[0]?.productVariantColor?.color}&variantImage=${data?.variants[0]?.productVariantImage[0]?.image_url}&variantStorage=${data?.variants[0]?.productVariantOption[0]?.storage}&variantPrice=${data?.variants[0]?.productVariantOption[0]?.price}`}
                className="block aspect-square overflow-hidden bg-gray-50 p-[6px]"
            >
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                    {
                        data?.variants[0]?.productVariantImage[0]?.image_url ? (
                            <Image 
                                src={data?.variants[0]?.productVariantImage[0]?.image_url} 
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                alt={data.title} 
                                className='object-cover transition-transform duration-500 group-hover:scale-110' 
                            />
                        ) : (
                            <Image src={noImage} fill alt={data.title} className='object-contain p-8 opacity-40' />
                        )
                    }
                </div>
            </Link>

            <CardContent className='p-5'>
                <div className='flex justify-between items-start gap-2 mb-4'>
                    <CardTitle className='text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors'>{data.title}</CardTitle>
                    <p className='text-lg font-black text-primary'>{priceFormatter({ price: data.price })}</p>
                </div>

                <div className='space-y-4'>
                    <div>
                        <h4 className='text-xs font-bold uppercase tracking-wider text-gray-400 mb-2'>{t('variants')}</h4>
                        <div className='flex flex-wrap gap-2 items-center'>
                            {
                                data?.variants?.length > 0 && data.variants.map((variant) => {
                                    return (
                                        <VariantModal
                                            key={variant.id}
                                            productId={data.id!}
                                            editMode={true}
                                            variant={variant}
                                        >
                                            <div 
                                                className="cursor-pointer w-6 h-6 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 transition-transform hover:scale-125" 
                                                style={{ backgroundColor: variant?.productVariantColor.color }}
                                            ></div>
                                        </VariantModal>
                                    )
                                })
                            }
                            <VariantModal productId={data.id!} editMode={false}>
                                <button className='cursor-pointer w-6 h-6 rounded-full flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-primary hover:text-white transition-colors border border-dashed border-gray-300'>
                                    <CirclePlus size={14} />
                                </button>
                            </VariantModal>
                        </div>
                    </div>

                    <div className='flex gap-2 pt-2'>
                        <Button
                            onClick={() => handleEdit(data.id)}
                            className='cursor-pointer flex-1 h-9 text-sm font-semibold' variant='outline'>
                            {t('edit')}
                        </Button>
                        <Button 
                            disabled={status === 'executing'} 
                            onClick={() => handleDelete(data.id)} 
                            className={cn('cursor-pointer flex-1 h-9 text-sm font-semibold', status === 'executing' && 'animate-pulse')} 
                            variant='destructive'
                        >
                            {status === 'executing' ? t('deleting') : t('delete')}
                        </Button>
                    </div>
                </div>
                <ToastContainer />
            </CardContent>
        </Card>
    )
}

export default ProductCard
