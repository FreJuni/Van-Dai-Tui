"use server"

import UploadProfileForm from '@/components/profile/upload-profile-form';
import UserNameForm from '@/components/profile/user-name-form';
import { auth } from '@/server/auth';
import React from 'react'

import { BackButton } from '@/components/ui/back-button';
import { redirect } from 'next/navigation';

const Profile = async () => {
    const session = await auth();

    if(!session?.user) return redirect('/');
    if(session.user.role === 'admin') return redirect('/dashboard/settings/profile');

    return (
        <div className='max-w-4xl mx-auto py-12 px-6'>
            <div className="mb-6">
                <BackButton />
            </div>
            <div className='flex flex-col md:flex-row gap-12 items-start justify-center'>
                <div className='w-full md:w-auto flex justify-center'>
                    <UploadProfileForm
                        name={session?.user?.name!}
                        image={session?.user?.image!}
                        userId={session?.user?.id!}
                    />
                </div>
                <div className='flex-1 w-full max-w-md'>
                    <UserNameForm
                        name={session?.user?.name!}
                        userId={session?.user?.id!}
                    />
                </div>
            </div>
        </div>
    )
}

export default Profile