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
        address: string;
        role: string;
        phone_number: string;
        isOAuth: boolean;
    }
};

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Mail, MapPin, Phone, Settings } from 'lucide-react';

const AccountForm = ({ user }: AccountFormProps) => {
    const t = useTranslations("Account");

    const form = useForm({
        resolver: zodResolver(AccountSchema),
        defaultValues: {
            phone_number: user.phone_number || "",
            address: user.address || "",
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
        const { phone_number, address } = values;

        execute({
            phone_number,
            address
        });
    }

    return (
        <Card className="border-gray-100 shadow-sm bg-white/50 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                    <Settings className="w-5 h-5 text-primary" />
                    <CardTitle className="text-xl font-bold">{t('accountSettings')}</CardTitle>
                </div>
                <CardDescription>{t('accountDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className='flex gap-8 flex-col w-full' onSubmit={form.handleSubmit(onSubmit)}>

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        {t('address')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            className="h-11 focus-visible:ring-primary bg-white" 
                                            type="text" 
                                            placeholder={t('address')} 
                                            {...field} 
                                        />
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
                                    <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        {t('phoneNumber')}
                                    </FormLabel>
                                    <FormControl>
                                        <PhoneNumberInput field={field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button 
                            disabled={status === 'executing'} 
                            className={cn('h-11 cursor-pointer font-semibold shadow-sm mt-4 transition-all active:scale-[0.98]', status === 'executing' && 'animate-pulse opacity-50')} 
                            type="submit"
                        >
                            {status === 'executing' ? "Updating..." : t('updateAccount')}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <ToastContainer />
        </Card>
    )
}

export default AccountForm
