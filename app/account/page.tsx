"use server";
import AccountForm from '@/components/account/account-form';
import { auth } from '@/server/auth';
import React from 'react'

import { BackButton } from '@/components/ui/back-button';

const AccountSettings = async () => {
    const session = await auth();

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
