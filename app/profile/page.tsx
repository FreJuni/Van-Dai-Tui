"use server"

import UploadProfileForm from '@/components/profile/upload-profile-form';
import UserNameForm from '@/components/profile/user-name-form';
import { auth } from '@/server/auth';
import React from 'react'

const Profile = async () => {
    const session = await auth();

    return (
        <div className='px-30 py-10 flex flex-row gap-20  justify-center'>
            <div >
                <UploadProfileForm
                    name={session?.user?.name!}
                    image={session?.user?.image!}
                    userId={session?.user?.id!}
                />
            </div>
            <div>
                <UserNameForm
                    name={session?.user?.name!}
                    userId={session?.user?.id!}
                />
            </div>
        </div>
    )
}

export default Profile