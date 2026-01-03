'use client'

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { sendResetPasswordEmail } from '@/server/actions/send-reset-password-email';
import { EmailSchema } from '@/types/email-shcema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod';
import { toast, Toaster } from 'sonner';
import AuthForm from '@/components/auth/auth-form';

const ForgotPasswordPage = () => {
    const t = useTranslations('Auth');
    const router = useRouter();
    const form = useForm<z.infer<typeof EmailSchema>>({
        resolver: zodResolver(EmailSchema),
        defaultValues: {
            email: "",
        }
    })

    const { execute, status, result } = useAction(sendResetPasswordEmail, {
        onSuccess({ data }) {
            if (data.error) {
                toast.error(data.error)
            }
            if (data.success) {
                toast.success(data.success, {
                    action: {
                        label: 'Click here',
                        onClick: () => window.open('https://mail.google.com/mail')
                    }
                })
            }
        }
    })

    const onSubmit = async (values: z.infer<typeof EmailSchema>) => {
        execute({
            email: values.email,
        })
    }

    return (
        <div className='flex justify-center items-center mt-20 '>
            <AuthForm
                title="Forget Password"
                description="Enter your email to send reset instructions below."
                href=''
                label=""
                btnText=""
                isProvider={false}
            >
                <Form {...form}  >
                    <form className='flex gap-5 flex-col' onSubmit={form.handleSubmit(onSubmit)} >

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('email')}</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder={t('enterEmail')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button className={cn(' cursor-pointer', status === 'executing' && 'animate-pulse')} type="submit">
                            {t('submit')}
                        </Button>
                    </form>
                </Form>
            </AuthForm>
            <Toaster />
        </div>
    )
}

export default ForgotPasswordPage