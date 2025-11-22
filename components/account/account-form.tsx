"use client";

import React from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast, ToastContainer } from 'react-toastify';
import PhoneNumberInput from '../phoneInput/phone-number-input';
import z from 'zod';
import { useAction } from 'next-safe-action/hooks';
import { UploadImageAction } from '@/server/actions/upload-profile-image';
import { AccountSchema } from '@/types/account-schema';
import { AccountAction } from '@/server/actions/account';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type AccountFormProps = {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        phone_number: string;
        isOAuth: boolean;
    }
};

const AccountForm = ({ user }: AccountFormProps) => {
    const t = useTranslations("Account");

    const form = useForm({
        resolver: zodResolver(AccountSchema),
        defaultValues: {
            phone_number: user.phone_number || "",
            email: user.email || "",
        },
    })

    const { execute, status, result } = useAction(AccountAction, {
        onSuccess({ data }) {

            if (data?.success) {
                toast.success(data?.success)
            }

            if (data?.error) {
                toast.error(data?.error);
            }
        }
    })

    const onSubmit = async (values: z.infer<typeof AccountSchema>) => {
        const { phone_number, email } = values;

        execute({
            phone_number,
            email
        });
    }

    return (
        <Form {...form}>
            <form className='flex gap-10 flex-col w-full' onSubmit={form.handleSubmit(onSubmit)}>

                <h2 className='mb-3 font-medium text-xl'>{t('accountSettings')}</h2>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('email')}</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder={t('email')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('phoneNumber')}</FormLabel>
                            <FormControl>
                                <PhoneNumberInput field={field} />
                                {/* <Input placeholder={t('phoneNumber')} {...field} /> */}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button disabled={status === 'executing'} className={cn(' cursor-pointer', status === 'executing' && 'animate-pulse')} type="submit">{t('updateAccount')}</Button>
            </form>
            <ToastContainer />
        </Form>
    )
}

export default AccountForm
