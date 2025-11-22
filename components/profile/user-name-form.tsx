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
        <Form {...form}>
            <form className='flex flex-col gap-2' onSubmit={form.handleSubmit(onSubmit)}>
                <h2 className=' mb-3 font-medium text-xl'>{t('userInfo')}</h2>

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
                            <FormLabel >Username</FormLabel>
                            <FormControl>
                                <Input className='w-96' type='text'  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    disabled={status === 'executing'}
                    className={cn(' cursor-pointer mt-10', status === 'executing' && 'animate-pulse')}
                    type='submit'
                >
                    {t("saveChanges")}
                </Button>
            </form>
            <ToastContainer />
        </Form>
    )
}

export default UserNameForm
