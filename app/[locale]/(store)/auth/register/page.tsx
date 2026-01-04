'use client';

import AuthForm from '@/components/auth/auth-form';
import PhoneNumberInput from '@/components/phoneInput/phone-number-input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RegisterAction } from '@/server/actions/register';
import { SignupSchema } from '@/types/signup-shcema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from "next-safe-action/hooks";
import React from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ToastContainer, toast } from 'react-toastify';
import { redirect, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';


const RegisterPage = () => {
    const t = useTranslations('Auth');
    const router = useRouter();
    const form = useForm<z.infer<typeof SignupSchema>>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            address: "",
            name: "",
            password: "",
            phone_number: ""
        }
    })

    const { execute, status, result } = useAction(RegisterAction, {
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
            if (typeof window !== 'undefined') {
                window.location.href = '/';
            }
        }
    })

    const onSubmit = async (values: z.infer<typeof SignupSchema>) => {
        execute({
            name: values.name,
            address: values.address,
            password: values.password,
            phone_number: values.phone_number
        })

    }

    return (
        <div className='flex justify-center items-center mt-20'>
            <AuthForm
                title="Sign up"
                description="Sign up account to continue shopping."
                href='/auth/login'
                label='Already have an account? '
                btnText="Sign in"
                isProvider={true}
            >
                <Form {...form} >
                    <form className='flex gap-5 flex-col' onSubmit={form.handleSubmit(onSubmit)} >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('name')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name " {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('address')}</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Address" {...field} />
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

                        <FormField
                            control={form.control}
                            name="phone_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('phoneNumber')}</FormLabel>
                                    <FormControl>
                                        <PhoneNumberInput field={field} />
                                        {/* <Input placeholder="Phone number" {...field} /> */}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button disabled={status === 'executing'} className={cn(' cursor-pointer', status === 'executing' && 'animate-pulse')} type="submit">{t('submit')}</Button>
                    </form>
                </Form>
            </AuthForm>
            <ToastContainer />
        </div>
    )
}

export default RegisterPage