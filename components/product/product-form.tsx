"use client";

import { AddProductAction } from '@/server/actions/product';
import { ProductSchema } from '@/types/product-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import React from 'react'
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import TipTap from './tip-tap';

const ProductForm = () => {
    const t = useTranslations('Product');
    const form = useForm<z.infer<typeof ProductSchema>>({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 0
        }
    })

    const { execute, status, result } = useAction(AddProductAction, {
        onSuccess({ data }) {
            if (data.error) {
                toast.error(data.error)
            }
            if (data.success) {
                toast(data.success, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        }
    })

    const onSubmit = async (values: z.infer<typeof ProductSchema>) => {
        execute({
            title: values.title,
            description: values.description,
            price: values.price,
        })
    }

    return (
        <div>
            <Form {...form} >
                <form className='flex gap-5 flex-col w-full' onSubmit={form.handleSubmit(onSubmit)} >

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('title')}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t('title')} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('description')}</FormLabel>
                                <FormControl>
                                    <TipTap val={field.value} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('price')}</FormLabel>
                                <FormControl>
                                    <Input
                                        step={100}
                                        type='number'
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        min={0}
                                        placeholder={t('price')} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button disabled={status === 'executing'} className={cn(' cursor-pointer', status === 'executing' && 'animate-pulse')} type="submit">Submit</Button>
                </form>
            </Form>
            <ToastContainer />
        </div>
    )
}

export default ProductForm