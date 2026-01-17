"use client";

import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import z from 'zod';
import { useAction } from 'next-safe-action/hooks';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { ChangePasswordSchema } from '@/types/change-password-schema';
import { ChangePasswordAction } from '@/server/actions/change-password';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Lock } from 'lucide-react';

const ChangePasswordForm = () => {
    const t = useTranslations("Account");
    const [isPending, setIsPending] = useState(false);

    const form = useForm({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            current_password: "",
            new_password: "",
            confirm_password: "",
        },
    })

    const { execute, status } = useAction(ChangePasswordAction, {
        onSuccess({ data }) {
            setIsPending(false);
            if (data?.success) {
                toast.success(data?.success);
                form.reset();
            }
            if (data?.error) {
                toast.error(data?.error);
            }
        },
        onError(error) {
             setIsPending(false);
             toast.error("An unexpected error occurred.");
        },
        onExecute() {
            setIsPending(true);
        }
    })

    const onSubmit = async (values: z.infer<typeof ChangePasswordSchema>) => {
        execute(values);
    }

    return (
        <Card className="border-gray-100 shadow-sm bg-white/50 backdrop-blur-sm h-full">
            <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-5 h-5 text-primary" />
                    <CardTitle className="text-xl font-bold">{t('changePassword')}</CardTitle>
                </div>
                <CardDescription>{t('changePasswordDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className='flex gap-6 flex-col w-full' onSubmit={form.handleSubmit(onSubmit)}>

                        <FormField
                            control={form.control}
                            name="current_password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-gray-700">
                                        {t('currentPassword')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            className="h-11 focus-visible:ring-primary bg-white" 
                                            type="password" 
                                            placeholder={t('currentPassword')} 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="new_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-gray-700">
                                            {t('newPassword')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                className="h-11 focus-visible:ring-primary bg-white" 
                                                type="password" 
                                                placeholder={t('newPassword')} 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirm_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-gray-700">
                                            {t('confirmNewPassword')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                className="h-11 focus-visible:ring-primary bg-white" 
                                                type="password" 
                                                placeholder={t('confirmNewPassword')} 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button 
                            disabled={isPending} 
                            className={cn('h-11 cursor-pointer font-semibold shadow-sm mt-2 w-full md:w-auto md:self-start min-w-[150px]', isPending && 'animate-pulse opacity-50')} 
                            type="submit"
                        >
                            {isPending ? t('updating') : t('updatePassword')}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default ChangePasswordForm
