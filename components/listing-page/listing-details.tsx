'use client';

import React, { useEffect, useState } from 'react';
import { ProductsWithVariants } from '@/lib/infer-type';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/src/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import VariantPicker from './variant-picker';
import { cn } from '@/lib/utils';
import { priceFormatter } from '@/helper/priceFormatter';
import { addFavourites } from '@/server/actions/favourite';
import { Heart } from 'lucide-react';
import { useCartStore } from '@/lib/cart';
import { toast } from 'react-toastify';

type ListingDetailsProps = {
  data: ProductsWithVariants;
  userId?: string;
  isFavoriteInitial?: boolean;
  discount: {
    discount: number;
    finalPrice: number;
    startDate: Date;
    endDate: Date;
  } | null;
};

export const revalidate = 60;

const ListingDetails = ({
  data,
  userId,
  isFavoriteInitial = false,
  discount
}: ListingDetailsProps) => {
  const t = useTranslations('ListingPage');
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitial);
  const [isLoadingFav, setIsLoadingFav] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const { addToCart } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !discount?.endDate) return;

    const calculateDiscount = () => {
      const now = new Date().getTime();
      const distance = new Date(discount.endDate).getTime() - now;

      if (distance < 0) {
        setTimeLeft('EXPIRED');
        return false;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      console.log('timeLeft', timeLeft);
      return true;
    };

    // Calculate immediately
    const isActive = calculateDiscount();
    if (!isActive) return;

    const timer = setInterval(() => {
      const isActive = calculateDiscount();
      if(!isActive) return clearInterval(timer);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [discount?.endDate, isMounted]);

  const currentVariant = React.useMemo(() => {
    const variantId = searchParams.get('variantId');
    return (
      data?.productVariant?.find((v) => v.id === variantId) ||
      data?.productVariant?.[0]
    );
  }, [searchParams, data?.productVariant]);

  const currentOption = React.useMemo(() => {
    const storage = searchParams.get('variantStorage');
    return (
      currentVariant?.productVariantOption?.find(
        (o) => o.storage === storage
      ) || currentVariant?.productVariantOption?.[0]
    );
  }, [searchParams, currentVariant]);

  const variantName =
    searchParams.get('variantName') || currentVariant?.variantName;
  const variantStorage =
    searchParams.get('variantStorage') || currentOption?.storage;
  const variantPrice =
    Number(searchParams.get('variantPrice')) ||
    currentOption?.price ||
    data.price ||
    0;

  const conditionColors: Record<string, string> = {
    New: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Used: 'bg-amber-50 text-amber-700 border-amber-100',
    Refurbished: 'bg-blue-50 text-blue-700 border-blue-100',
  };

  const handleAddFavorite = async () => {
    if (!userId) {
      toast.error('Please login to add to favorites');
      return;
    }
    setIsLoadingFav(true);
    // Optimistic update
    const newFavState = !isFavorite;
    setIsFavorite(newFavState);

    try {
      const res = await addFavourites({ productId: data.id, userId });
      if (res?.data?.error) {
        toast.error(res.data.error);
        setIsFavorite(!newFavState); // Revert on error
      } else if (res?.data?.success) {
        toast.success(res.data.success);
      }
    } catch (error) {
      toast.error('Something went wrong');
      setIsFavorite(!newFavState);
    } finally {
      setIsLoadingFav(false);
    }
  };

  const handleAddToCart = () => {
    if (!userId) {
      toast.error('Please login to add to cart');
      return;
    }
    if (!currentVariant || !currentOption) return;

    addToCart({
      userId: userId,
      id: data.id,
      title: data.title,
      image: currentVariant.productVariantImage[0]?.image_url || '',
      price: variantPrice,
      variant: {
        variantId: currentVariant.id,
        variantName: currentVariant.variantName,
        storage: currentOption.storage,
      },
      quantity: 1,
    });
    toast.success('Added to cart');
  };

  return (
    <>
      <div className="flex flex-col gap-4 lg:text-left">
        <p className="text-3xl font-bold md:text-4xl">{data.title}</p>
        <div
          className="text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: data.description || '' }}
        ></div>
        <div className="mt-2 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col items-start">
              {discount && (
                  <span className="text-xl font-black text-gray-500 line-through">
                      {priceFormatter({ price: variantPrice })}
                  </span>
              )}
              <div className="flex items-center gap-2">
                <p className="text-primary text-3xl font-bold md:text-4xl">
                  {priceFormatter({ price: discount ? discount.finalPrice : variantPrice })}
                </p>
                {discount && (
                  <div className="bg-red-500 text-white text-xs font-black px-2 py-1 rounded-[4px] shadow-lg">
                      -{discount.discount}%
                  </div>
                )}
              </div>
            </div>

            {currentVariant?.productVariantCondition?.condition && (
              <div
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase shadow-sm',
                  conditionColors[
                    currentVariant.productVariantCondition.condition
                  ] || 'border-gray-100 bg-gray-50 text-gray-700'
                )}
              >
                {currentVariant.productVariantCondition.condition}
              </div>
            )}
            
            {timeLeft && discount && (
                <div className="flex items-center gap-2 bg-black/5 border border-black/10 px-3 py-1.5 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm font-bold text-gray-700 font-mono">
                        {timeLeft === "EXPIRED" ? "SALE ENDED" : `Ends in: ${timeLeft}`}
                    </span>
                </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="">
              <span className="text-lg font-medium">{t('color')}</span> :{' '}
              <span className="font-normal">{variantName}</span>
            </div>
            <div className="flex items-center gap-3 lg:justify-start">
              {data?.productVariant?.map((variant, i) => {
                return (
                  <VariantPicker
                    key={i}
                    id={data.id}
                    variantName={variant.variantName}
                    productId={variant.productId}
                    variantColor={variant.productVariantColor.color}
                    variantImage={
                      variant.productVariantImage[0]?.image_url || ''
                    }
                    variantStorage={
                      variant.productVariantOption[0]?.storage || ''
                    }
                    variantPrice={variant.productVariantOption[0]?.price || 0}
                    listingTitle={data.title}
                    listingDescription={data.description}
                    listingPrice={data.price || 0}
                    listingImage={
                      data.productVariant[0]?.productVariantImage[0]
                        ?.image_url || ''
                    }
                    variantId={variant.id}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-6">
          {/* Storage Selection */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                {t('storage')}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentVariant?.productVariantOption
                ?.sort((a, b) => Number(a?.price) - Number(b?.price))
                ?.map((option, i) => {
                  const isSelected = option.storage === variantStorage;
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        const params = new URLSearchParams(
                          searchParams.toString()
                        );
                        params.set('variantStorage', option.storage);
                        params.set('variantPrice', option.price.toString());
                        params.set('variantId', currentVariant.id);
                        router.push(
                          `/listing-page/${data.id}?${params.toString()}`,
                          { scroll: false }
                        );
                      }}
                      className={cn(
                        'flex min-w-20 cursor-pointer items-center justify-center rounded-xl border px-5 py-2.5 text-sm font-bold transition-all duration-200 select-none',
                        isSelected
                          ? 'scale-105 transform border-black bg-black text-white shadow-md'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      )}
                    >
                      {option.storage} GB
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Add To Cart Section */}
          <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-6">
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="h-14 flex-1 cursor-pointer rounded-2xl bg-black text-lg font-bold text-white shadow-lg transition-all hover:bg-gray-900 active:scale-[0.98]"
              >
                {t('addToCart')}
              </button>
              <button
                onClick={handleAddFavorite}
                disabled={isLoadingFav}
                className={cn(
                  'flex aspect-square h-14 cursor-pointer items-center justify-center rounded-2xl border-2 transition-all duration-300 active:scale-90 disabled:opacity-50',
                  isFavorite
                    ? 'border-red-100 bg-red-50 text-red-600 shadow-inner hover:bg-red-100/80'
                    : 'border-gray-100 text-gray-300 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-500'
                )}
              >
                <Heart
                  size={26}
                  className={cn(
                    'transition-all duration-300 ease-in-out',
                    isFavorite
                      ? 'scale-110 fill-red-600 drop-shadow-sm'
                      : 'scale-100'
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingDetails;
