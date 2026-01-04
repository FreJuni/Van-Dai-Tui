'use client'

import AuthForm from '@/components/auth/auth-form';
import PhoneNumberInput from '@/components/phoneInput/phone-number-input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { LoginAction } from '@/server/actions/login';
import { LoginSchema } from '@/types/login-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';
import { Link, useRouter } from '@/src/i18n/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import z from 'zod';

const LoginPage = () => {
    const t = useTranslations('Auth');
    const router = useRouter();
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            phone_number: "",
            password: "",
        }
    })

    const { execute, status, result } = useAction(LoginAction, {
        onSuccess({ data }) {
            if (data.error) {
                toast.error(data.error)
            }
            if (data?.success) {
                toast.success(data.success);
                
                // Redirect based on role using localized router
                if (data.role === 'admin') {
                    router.push('/dashboard');
                } else {
                    router.push('/');
                }
            }
        }
    })

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        execute({
            phone_number: values.phone_number,
            password: values.password,
        })

    }

    return (
        <div className='flex justify-center items-center mt-20'>
            <AuthForm
                title="Sign in"
                description="Login to your account."
                href='/auth/register'
                label="Don't have an account? "
                btnText="Sign up"
                isProvider={true}
            >
                <Form {...form} >
                    <form className='flex gap-5 flex-col' onSubmit={form.handleSubmit(onSubmit)} >

                        <FormField
                            control={form.control}
                            name="phone_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('phoneNumber')}</FormLabel>
                                    <FormControl>
                                        <PhoneNumberInput field={field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('password')}</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder={t('password')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div>
                            <Link href="/auth/forgot-password" className='text-sm text-blue-600 hover:underline'>{t('forgetPassword')}</Link>
                        </div>

                        <Button disabled={status === 'executing'} className={cn(' cursor-pointer', status === 'executing' && 'animate-pulse')} type="submit">{t('submit')}</Button>
                    </form>
                </Form>
            </AuthForm>
            <ToastContainer />
        </div>
    )
}

export default LoginPage