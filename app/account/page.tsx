"use server";
import AccountForm from '@/components/account/account-form';
import { auth } from '@/server/auth';
import React from 'react'

const AccountSettings = async () => {
    const session = await auth();

    return (
        <div className='px-30 py-10 flex flex-row gap-20  justify-center'>
            <div className='w-96'>
                <AccountForm user={session?.user!} />
            </div>
        </div>
    )
}

export default AccountSettings
