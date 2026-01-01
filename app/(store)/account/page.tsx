"use server";
import AccountForm from '@/components/account/account-form';
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
        <div className='max-w-md mx-auto py-12 px-6'>
            <div className="mb-6">
                <BackButton />
            </div>
            <AccountForm user={session?.user!} />
        </div>
    )
}

export default AccountSettings
