'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { sendResetPasswordEmail } from '@/server/actions/send-reset-password-email';
import { EmailSchema, NewPasswordSchema } from '@/types/email-shcema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod';
import { toast } from 'sonner';
import { SetNewPassword } from '@/server/actions/set-new-password';
import AuthForm from '@/components/auth/auth-form';

const ResetPasswordPage = () => {
    const t = useTranslations('Auth');
    const router = useRouter();
    const params = useSearchParams().get('token');

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
            confirm_password: "",
            token: params || "",
        }
    })

    const { execute, status, result } = useAction(SetNewPassword, {
        onSuccess({ data }) {
            if (data.error) {
                toast.error(data.error)
            }
            if (data.success) {
                router.push('/auth/login');
                toast.success(data.success)
            }
        }
    })

    const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {
        execute({
            password: values.password,
            confirm_password: values.confirm_password,
            token: params!
        })
    }

    return (
        <div className='flex justify-center items-center mt-20 '>
            <AuthForm
                title="Reset Password"
                description="Enter your new password below."
                href=''
                label=""
                btnText="Reset Password"
                isProvider={false}
            >
                <Form {...form}  >
                    <form className='flex gap-5 flex-col ' onSubmit={form.handleSubmit(onSubmit)} >

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('newPassword')}</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder={t('newPassword')} {...field} />
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
                                    <FormLabel>{t('confirmNewPassword')}</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder={t('confirmNewPassword')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button disabled={status === 'executing'} className={cn(' cursor-pointer', status === 'executing' && 'animate-pulse')} type="submit">
                            {t('resetPassword')}
                        </Button>
                    </form>
                </Form>
            </AuthForm>
        </div>
    )
}

export default ResetPasswordPage