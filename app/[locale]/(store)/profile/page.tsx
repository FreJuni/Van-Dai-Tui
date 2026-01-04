"use server"

import UploadProfileForm from '@/components/profile/upload-profile-form';
import UserNameForm from '@/components/profile/user-name-form';
import { auth } from '@/server/auth';
import React from 'react'

import { BackButton } from '@/components/ui/back-button';
import { redirect } from 'next/navigation';

const Profile = async () => {
    const session = await auth();

    if(!session?.user) return redirect('/auth/login');
    if(session.user.role === 'admin') return redirect('/dashboard/settings/profile');

    return (
        <div className='max-w-5xl mx-auto py-12 px-6'>
            <div className="mb-8">
                <BackButton />
                <div className="mt-4">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Profile Settings</h1>
                    <p className="text-muted-foreground mt-1">Update your public profile information</p>
                </div>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-start'>
                <div className='md:col-span-1 flex justify-center bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-gray-100 shadow-sm'>
                   <UploadProfileForm
                        name={session?.user?.name!}
                        image={session?.user?.image!}
                        userId={session?.user?.id!}
                    />
                </div>
                <div className='md:col-span-2 w-full'>
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