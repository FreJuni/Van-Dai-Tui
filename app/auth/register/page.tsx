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


const RegisterPage = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof SignupSchema>>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            email: "",
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
            router.push('/auth/login')
        }
    })

    const onSubmit = async (values: z.infer<typeof SignupSchema>) => {
        execute({
            name: values.name,
            email: values.email,
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
            >
                <Form {...form} >
                    <form className='flex gap-5 flex-col' onSubmit={form.handleSubmit(onSubmit)} >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name " {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Email" {...field} />
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
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Password" {...field} />
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
                                    <FormLabel>Phone number</FormLabel>
                                    <FormControl>
                                        <PhoneNumberInput field={field} />
                                        {/* <Input placeholder="Phone number" {...field} /> */}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button disabled={status === 'executing'} className={cn(' cursor-pointer', status === 'executing' && 'animate-pulse')} type="submit">Submit</Button>
                    </form>
                </Form>
            </AuthForm>
            <ToastContainer />
        </div>
    )
}

export default RegisterPage