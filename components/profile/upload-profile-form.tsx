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
            <form className='flex flex-col gap-2 items-center' onSubmit={form.handleSubmit(onSubmit)}>

                <h2 className='mb-3 font-medium text-xl'>{t('userProfile')}</h2>

                <Avatar className='w-30 h-30 border-2'>
                    {
                        form.getValues('image') ?
                            <AvatarImage src={form.getValues('image')!} />
                            :
                            <AvatarImage src={image!} />
                    }
                    {
                        !form.getValues('image') && (
                            <AvatarFallback className="bg-black font-bold text-white cursor-pointer"  >{name?.slice(0, 2)}</AvatarFallback>
                        )
                    }
                </Avatar>

                <div className=' w-max'>
                    <UploadButton
                        className='flex justify-start ut-button:bg-black '
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
                            return;
                        }}
                        onClientUploadComplete={(res) => {
                            form.setValue('image', res[0].url!);
                            form.handleSubmit(onSubmit)();
                            setIsUploading(false);
                            return;
                        }}
                        content={{
                            button({ ready }) {
                                if (ready) return <div className='bg-black px-2 py-1 text-[12px] rounded-sm select-none'>{t('uploadImage')}</div>
                                return <div>{t('uploading')}</div>
                            }
                        }}
                    />
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
