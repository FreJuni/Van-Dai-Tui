"use client";

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart";
import { priceFormatter } from "@/helper/priceFormatter";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, ShoppingCart, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/src/i18n/navigation';
import { OrderCreate } from '@/server/actions/order';


type CartDrawerProps = {
    user? : {
    id: string;
    name: string;
    address: string;
    role: string;
    phone_number: string;
    isOAuth: boolean;
    }
}


export const CartDrawer = ({user} : CartDrawerProps) => {
    const t = useTranslations('Cart'); 
  const { cartItems, addToCart, removeOne, removeFromCart } = useCartStore();
const ownCartItems = cartItems.filter(item => item.userId === user?.id);
  
  const totalPrice = ownCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = ownCartItems.length;

  const handleWhatsAppCheckout = async () => {
    if (!user) {
        toast.error("Please login to place an order");
        return;
    }
    if (ownCartItems.length === 0) return;

    const adminPhone = process.env.ADMIN_PHONE_NUMBER!; 

    //  userId: string;
    // quantity: number;
    // totalPrice: number;
    // orderItems: {
    //     productId: string;
    //     productVariantId: string;
    // }[];

    // create order
    const order = await OrderCreate({
        userId: user.id,
        quantity: totalItems,
        totalPrice: totalPrice,
        orderItems: ownCartItems.map(item => ({
            productId: item.id,
            productVariantId: item.variant.variantId,
        }))
    });

    if(order.error) {
        return;
    }

    // Send message to admin
    // let message = `*New Order Request*\n`;
    // message += `User name: ${user.name}\n`;
    // message += `User phone: ${user.phone_number}\n`;
    // message += `User address: ${user.address}\n`;
    // message += `---------------------\n`;
    
    // ownCartItems.forEach((item, index) => {
    //     message += `${index + 1}. ${item.title}\n`;
    //     message += `   - Color: ${item.variant.variantName}\n`;
    //     message += `   - Storage: ${item.variant.storage} GB\n`;
    //     message += `   - Qty: ${item.quantity}\n`;
    //     message += `   - Price: ${priceFormatter({price: item.price * item.quantity})}\n\n`;
    // });
    
    // message += `---------------------\n`;
    // message += `*Total: ${priceFormatter({price: totalPrice})}*`;

    // const encodedMessage = encodeURIComponent(message);
    // const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;
    
    // if (typeof window !== 'undefined') {
    //     window.open(whatsappUrl, '_blank');
    // }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative p-2 cursor-pointer text-gray-600 hover:text-primary hover:bg-gray-50 rounded-full transition-all group">
          <ShoppingCart size={22} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-white">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="flex w-full p-3 flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {t('shoppingCart')} <span className="text-sm font-normal text-gray-500">({totalItems} {t('items')})</span>
          </SheetTitle>
        </SheetHeader>
        
        {ownCartItems.length > 0 ? (
            <>
                <div className="flex-1 -mr-4 pr-6 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col gap-6 pt-4">
                    {ownCartItems.map((item , index) => (
                    <div key={item.variant.variantId + item.variant.storage + index} className="flex gap-4">
                        <div className="relative aspect-square h-24 w-24 min-w-24 overflow-hidden rounded-xl border bg-gray-50">
                            {item.image && (
                                <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                                />
                            )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between py-1">
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm line-clamp-2 leading-tight">{item.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    {item.variant.storage && (
                                        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-gray-600">
                                            {item.variant.storage} GB
                                        </span>
                                    )}
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span>{item.variant.variantName}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-black text-primary">
                                    {priceFormatter({ price: item.price * item.quantity })}
                                </div>
                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border">
                                    <button 
                                        onClick={() => removeOne(item.variant.variantId, item.variant.storage)}
                                        className="h-6 w-6 cursor-pointer flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all text-gray-600"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                    <button 
                                        onClick={() => addToCart({...item, quantity: 1})}
                                        className="h-6 w-6 cursor-pointer flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all text-gray-600"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
                <div className="space-y-4 pt-6 pr-6">
                    <Separator />
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-base">
                            <span className="font-medium text-gray-600">{t('subtotal')}</span>
                            <span className="font-bold text-gray-900">{priceFormatter({ price: totalPrice })}</span>
                        </div>
                        <p className="text-xs text-gray-400">{t('shippingAndTaxesCalculatedAtCheckout')}</p>
                    </div>
                    <div className="grid gap-3">
                         <SheetClose asChild>
                             <Button 
                                onClick={handleWhatsAppCheckout}
                                className="w-full cursor-pointer h-12 text-base font-bold rounded-xl bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2" 
                                size="lg"
                             >
                                <MessageCircle size={20} />
                                {t('orderViaWhatsApp')}
                            </Button>
                         </SheetClose>
                    </div>
                </div>
            </>
        ) : (
            <div className="flex h-full flex-col items-center justify-center space-y-4 pr-6">
                <div className="relative mb-4">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                    <ShoppingBag className="relative h-16 w-16 text-primary" />
                </div>
                <div className="text-center space-y-1">
                    <h3 className="font-bold text-lg">{t('yourCartIsEmpty')}</h3>
                    <p className="text-sm text-gray-500">{t('looksLikeYouHaveNotAddedAnythingYet')}</p>
                </div>
                <SheetClose asChild>
                   <Link href="/search">
                    <Button variant="outline" className="mt-4 rounded-xl cursor-pointer">
                        {t('startShopping')}
                    </Button>
                   </Link>
                </SheetClose>
            </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
