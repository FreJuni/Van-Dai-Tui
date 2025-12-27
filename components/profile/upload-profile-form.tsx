"use client";

import { useTranslations } from 'next-intl';
import React, { useState } from 'react'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { ImageUploadSchema } from '@/types/upload-profile-form-schema';
import { UploadButton } from '@/app/api/uploadthing/uploadthing';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAction } from 'next-safe-action/hooks';
import { UploadImageAction } from '@/server/actions/upload-profile-image';
import { toast, ToastContainer } from 'react-toastify';

type UploadProfileFormProps = {
    image: string
    name: string,
    userId: string
}

const UploadProfileForm = ({ image, name, userId }: UploadProfileFormProps) => {
    const t = useTranslations("UserProfile");
    const [isUploading, setIsUploading] = useState(false);


    const form = useForm({
        resolver: zodResolver(ImageUploadSchema),
        defaultValues: {
            userId,
            image,
        },
    })

    const { execute, status, result } = useAction(UploadImageAction, {
        onSuccess({ data }) {
            if (data?.success) {
                toast.success(data?.success)
            }

            if (data?.error) {
                toast.error(data?.error);
            }
        }
    })

    const onSubmit = async (values: z.infer<typeof ImageUploadSchema>) => {
        const { image, userId } = values;

        execute({
            image,
            userId
        });
    }

    return (
        <Form {...form}>
            <form className='flex flex-col gap-6 items-center' onSubmit={form.handleSubmit(onSubmit)}>
                <div className="relative group">
                    <Avatar className='w-40 h-40 border-4 border-white shadow-xl ring-1 ring-gray-100'>
                        {
                            form.getValues('image') ?
                                <AvatarImage className="object-cover" src={form.getValues('image')!} />
                                :
                                <AvatarImage className="object-cover" src={image!} />
                        }
                        {
                            !form.getValues('image') && (
                                <AvatarFallback className="bg-primary font-bold text-white text-3xl"  >{name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                            )
                        }
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2">
                        <UploadButton
                            className='ut-button:bg-primary ut-button:rounded-full ut-button:h-10 ut-button:w-10 ut-button:px-0 ut-button:shadow-lg transition-transform hover:scale-110 ut-allowed-content:hidden'
                            endpoint={'imageUploader'}
                            onUploadBegin={() => {
                                setIsUploading(true);
                            }}
                            onUploadError={(error) => {
                                form.setError('image', {
                                    type: 'validate',
                                    message: error.message
                                })
                                setIsUploading(false);
                                toast.error(error.message);
                            }}
                            onClientUploadComplete={(res) => {
                                form.setValue('image', res[0].url!);
                                form.handleSubmit(onSubmit)();
                                setIsUploading(false);
                            }}
                            content={{
                                button({ ready }) {
                                    if (ready) return <div className='flex items-center justify-center'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg></div>
                                    return <div className="animate-spin"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></div>
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="text-center">
                    <h2 className='font-bold text-2xl text-gray-900'>{name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{t('userProfile')}</p>
                </div>

                <FormField
                    name='image'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type='hidden' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name='userId'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type='hidden'  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
            <ToastContainer />
        </Form>
    )
}

export default UploadProfileForm
