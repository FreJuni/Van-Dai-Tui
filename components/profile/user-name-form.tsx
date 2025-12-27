"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import z from 'zod';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslations } from 'next-intl';
import { UserNameSchema } from '@/types/upload-profile-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAction } from 'next-safe-action/hooks';
import { UpdateUsernameAction } from '@/server/actions/upload-profile-image';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type UserNameFormProps = {
    name: string,
    userId: string,
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { User } from 'lucide-react';

const UserNameForm = ({ name, userId }: UserNameFormProps) => {
    const t = useTranslations("UserProfile");


    const form = useForm({
        resolver: zodResolver(UserNameSchema),
        defaultValues: {
            name,
            userId
        },
    })

    const { execute, status, result } = useAction(UpdateUsernameAction, {
        onSuccess({ data }) {
            if (data?.success) {
                toast.success(data?.success)
            }

            if (data?.error) {
                toast.error(data?.error);
            }
        }
    })

    const onSubmit = async (values: z.infer<typeof UserNameSchema>) => {
        const { name, userId } = values;

        execute({
            name,
            userId
        });
    }

    return (
        <Card className="border-gray-100 shadow-sm bg-white/50 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                    <User className="w-5 h-5 text-primary" />
                    <CardTitle className="text-xl font-bold">{t('userInfo')}</CardTitle>
                </div>
                <CardDescription>Update your public display name.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className='flex flex-col gap-6' onSubmit={form.handleSubmit(onSubmit)}>
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

                        <FormField
                            name='name'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold text-gray-700">Username</FormLabel>
                                    <FormControl>
                                        <Input 
                                            className='h-11 focus-visible:ring-primary bg-white' 
                                            placeholder="Your display name"
                                            type='text'  {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            disabled={status === 'executing'}
                            className={cn('h-11 cursor-pointer font-semibold shadow-sm transition-all active:scale-[0.98]', status === 'executing' && 'animate-pulse opacity-50')}
                            type='submit'
                        >
                            {status === 'executing' ? t('uploading') : t("saveChanges")}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <ToastContainer />
        </Card>
    )
}

export default UserNameForm
