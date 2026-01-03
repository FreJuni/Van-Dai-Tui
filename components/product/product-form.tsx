"use client";

import { AddProductAction, fetchProduct } from '@/server/actions/product';
import { ProductSchema } from '@/types/product-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import TipTap from './tip-tap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Apple, Check, FileText, Laptop, LayoutGrid, Loader2, Package, Smartphone } from 'lucide-react';

const ProductForm = () => {
    const t = useTranslations('Product');
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('productId');
        
    const [isLoading, setIsLoading] = useState(!!productId);

    const form = useForm<z.infer<typeof ProductSchema>>({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "Others",
            brand: "Others",
        }
    });

    const { execute, status } = useAction(AddProductAction, {
        onSuccess({ data }) {
            if (data?.error) {
                toast.error(data.error)
            }
            if (data?.success) {
                toast.success(data?.success);
            }
        }
    })

    const onSubmit = async (values: z.infer<typeof ProductSchema>) => {
        execute({
            title: values.title,
            description: values.description,
            productId: productId ? productId : '',
            category: values.category,
            brand: values.brand,
        })
    }

    const checkIsProductExist = async () => {
        if (!productId) {
            form.reset({
                title: "",
                description: "",
                productId: "",
                category: "Others",
                brand: "Others",
            });
            setIsLoading(false);
            return;
        }
        
        try {
            setIsLoading(true);
            const product = await fetchProduct(productId);

            if (product?.error) {
                router.push('/add-product');
            }

            if (product?.product) {
                form.setValue("title", product.product.title);
                form.setValue("description", product.product.description);
                form.setValue('productId', productId);
                form.setValue('category', product.product.category!);
                form.setValue('brand', product.product.brand!);
            } else {
                form.reset({
                    title: "",
                    description: "",
                    productId: "",
                    category: "Others",
                    brand: "Others",
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        checkIsProductExist();
    }, [productId]);

    if (isLoading) {
        return (
            <Card className="border-none shadow-none lg:border lg:shadow-sm">
                <CardHeader className="space-y-4">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-11 w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-none shadow-none lg:border lg:shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 mb-6">
                <CardTitle className="text-xl flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                        <Package className="w-5 h-5 text-primary" />
                    </div>
                    {productId ? t('updateProduct') : t('addProduct')}
                </CardTitle>
                <CardDescription>
                    {productId ? 'Modify the details of your existing product listing.' : 'Fill in the information below to list a new product or service.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form} >
                    <form className='flex gap-8 flex-col w-full' onSubmit={form.handleSubmit(onSubmit)} >
                        <FormField
                            control={form.control}
                            name="productId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input hidden {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* General Information Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <FileText className="w-4 h-4 text-primary" />
                                <h3 className="font-semibold text-gray-900">{t('generalInformation')}</h3>
                            </div>
                            
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 font-medium">
                                            {t('title')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="e.g. iPhone 15 Pro Max - 256GB" 
                                                className="h-11 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            {t('provideClearAndDescriptiveNameForYourProduct')}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 font-medium">
                                            {t('description')}
                                        </FormLabel>
                                        <FormControl>
                                            <TipTap val={field.value} />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            {t('explainTheFeaturesConditionAndDetailsOfWhatYouAreSelling')}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Categorization Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <Package className="w-4 h-4 text-primary" />
                                <h3 className="font-semibold text-gray-900">{t('categorization')}</h3>
                            </div>
                            
                            <div className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-gray-700 font-medium mb-3 block text-base">Select Category</FormLabel>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                {[
                                                    { value: "Phones", label: "Phones", icon: Smartphone },
                                                    { value: "Laptops", label: "Laptops", icon: Laptop },
                                                    { value: "Others", label: "Others", icon: LayoutGrid },
                                                ].map((opt) => (
                                                    <div
                                                        key={opt.value}
                                                        onClick={() => field.onChange(opt.value)}
                                                        className={cn(
                                                            "relative cursor-pointer group flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md",
                                                            field.value === opt.value 
                                                                ? "border-primary bg-primary/5 shadow-sm" 
                                                                : "border-gray-100 bg-white hover:border-primary/30"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "p-3 rounded-full mb-3 transition-colors",
                                                            field.value === opt.value ? "bg-primary text-white" : "bg-gray-50 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary"
                                                        )}>
                                                            <opt.icon className="w-6 h-6" />
                                                        </div>
                                                        <span className={cn(
                                                            "font-semibold text-sm",
                                                            field.value === opt.value ? "text-primary" : "text-gray-600"
                                                        )}>
                                                            {opt.label}
                                                        </span>
                                                        {field.value === opt.value && (
                                                            <div className="absolute top-2 right-2 p-1 bg-primary rounded-full text-white">
                                                                <Check className="w-3 h-3" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="brand"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-gray-700 font-medium mb-3 block text-base">Select Brand</FormLabel>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                {[
                                                    { value: "Apple", label: "Apple", icon: Apple },
                                                    { value: "Samsung", label: "Samsung", icon: Smartphone },
                                                    { value: "Others", label: "Others", icon: LayoutGrid },
                                                ].map((opt) => (
                                                    <div
                                                        key={opt.value}
                                                        onClick={() => field.onChange(opt.value)}
                                                        className={cn(
                                                            "relative cursor-pointer group flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md",
                                                            field.value === opt.value 
                                                                ? "border-primary bg-primary/5 shadow-sm" 
                                                                : "border-gray-100 bg-white hover:border-primary/30"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "p-3 rounded-full mb-3 transition-colors",
                                                            field.value === opt.value ? "bg-primary text-white" : "bg-gray-50 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary"
                                                        )}>
                                                            <opt.icon className="w-6 h-6" />
                                                        </div>
                                                        <span className={cn(
                                                            "font-semibold text-sm",
                                                            field.value === opt.value ? "text-primary" : "text-gray-600"
                                                        )}>
                                                            {opt.label}
                                                        </span>
                                                        {field.value === opt.value && (
                                                            <div className="absolute top-2 right-2 p-1 bg-primary rounded-full text-white">
                                                                <Check className="w-3 h-3" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Button 
                            disabled={status === 'executing'} 
                            className={cn('cursor-pointer mt-4 w-full h-12 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99] bg-primary text-white')} 
                            type="submit"
                        >
                            {status === 'executing' ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {productId ? 'Updating...' : 'Creating...'}
                                </span>
                            ) : (
                                productId ? 'Update Product' : 'Create Product'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <ToastContainer />
        </Card>
    )
}

export default ProductForm
