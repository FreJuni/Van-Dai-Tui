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
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import TipTap from './tip-tap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { DollarSign, FileText, Loader2, Package } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';

type ProductFormProps = {
    productId: string,
}

const ProductForm = ({ productId }: ProductFormProps) => {
    const t = useTranslations('Product');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(!!productId);

    const form = useForm<z.infer<typeof ProductSchema>>({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 0,
            type: "Other",
            category: "",
            brand: "",
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
            price: values.price,
            productId: productId ? productId : '',
            type: values.type,
            category: values.category,
            brand: values.brand,
        })
    }

    const checkIsProductExist = async () => {
        if (!productId) {
            form.reset({
                title: "",
                description: "",
                price: 0,
                productId: "",
                type: "Other"
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
                form.setValue("price", Number(product.product.price));
                form.setValue('productId', productId);
                form.setValue('type', product.product.type!);
                form.setValue('category', product.product.category!);
                form.setValue('brand', product.product.brand!);
            } else {
                form.reset({
                    title: "",
                    description: "",
                    price: 0,
                    productId: "",
                    type: "Other",
                    category: "",
                    brand: "",
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
        <Card className="border-none shadow-none lg:border lg:shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 mb-6">
                <CardTitle className="text-xl flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    {productId ? t('updateProduct') : t('addProduct')}
                </CardTitle>
                <CardDescription>
                    {productId ? 'Modify the details of your existing product listing.' : 'Fill in the information below to list a new product or service.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form} >
                    <form className='flex gap-6 flex-col w-full' onSubmit={form.handleSubmit(onSubmit)} >
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

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                        {t('title')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="e.g. iPhone 15 Pro Max - 256GB" 
                                            className="focus-visible:ring-primary"
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Provide a clear and descriptive name for your product.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-gray-500" />
                                    Product Type
                                </FormLabel>

                                <Select
                                    defaultValue={field.value}
                                    onValueChange={(value) => field.onChange(value)}
                                >
                                    <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue  placeholder="Select a product type" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectGroup>
                                    <SelectContent>
                                    <SelectItem value="Phone">Phone</SelectItem>
                                    <SelectItem value="Tablet">Tablet</SelectItem>
                                    <SelectItem value="Laptop">Laptop</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                    </SelectGroup>
                                </Select>

                                <FormMessage />
                                </FormItem>
                            )}
                            />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                        {t('category')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="e.g. iPhone" 
                                            className="focus-visible:ring-primary"
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormDescription>
                                         Provide a clear and descriptive name for for category.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="brand"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                        {t('brand')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="e.g. Apple" 
                                            className="focus-visible:ring-primary"
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Provide a clear and descriptive name for your brand.
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
                                    <FormLabel className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-gray-500" />
                                        {t('description')}
                                    </FormLabel>
                                    <FormControl>
                                        <TipTap val={field.value} />
                                    </FormControl>
                                    <FormDescription>
                                        Explain the features, condition, and details of what you're selling.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-gray-500" />
                                        {t('price')}
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                            <Input
                                                type='number'
                                                className="pl-8 focus-visible:ring-primary"
                                                {...field}
                                                value={field.value === 0 ? '' : field.value ?? ''}
                                                onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button 
                            disabled={status === 'executing'} 
                            className={cn('mt-4 w-full h-11 text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]')} 
                            type="submit"
                        >
                            {status === 'executing' ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
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
