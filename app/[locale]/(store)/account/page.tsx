"use server";
import AccountForm from '@/components/account/account-form';
import ChangePasswordForm from '@/components/account/change-password-form';
import { auth } from '@/server/auth';
import React from 'react'

import { BackButton } from '@/components/ui/back-button';
import { redirect } from 'next/navigation';

const AccountSettings = async () => {
    const session = await auth();
    if(!session?.user ) {
        redirect('/');
    }
    if(session.user.role === 'admin') return redirect('/dashboard/settings/account');
    

    return (
        <div className='max-w-5xl mx-auto py-12 px-6'>
            <div className="mb-8">
                <BackButton />
                <div className="mt-4">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Account Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your security and contact details</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="h-full">
                    <AccountForm user={session?.user!} />
                </div>
                <div className="h-full">
                    <ChangePasswordForm />
                </div>
            </div>
        </div>
    )
}

export default AccountSettings
