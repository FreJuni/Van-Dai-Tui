
import UploadProfileForm from '@/components/profile/upload-profile-form';
import UserNameForm from '@/components/profile/user-name-form';
import { auth } from '@/server/auth';
import React from 'react'
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

const DashboardProfilePage = async () => {
    const session = await auth();   
    const t = await getTranslations('Dashboard');

    if(!session?.user || session.user.role !== 'admin') return redirect('/');

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter">{t('profileSettings')}</h1>
                <p className="text-gray-500 mt-2 font-medium">{t('manageYourPublicInformationAndAvatar')}</p>
            </div>

            <div className='bg-white rounded-[3rem] border border-gray-100 shadow-sm p-12'>
                <div className='flex flex-col lg:flex-row gap-16 items-start'>
                    <div className='w-full lg:w-auto flex flex-col items-center gap-4'>
                        <UploadProfileForm
                            name={session?.user?.name!}
                            image={session?.user?.image!}
                            userId={session?.user?.id!}
                        />
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{t('profileAvatar')}</p>
                    </div>
                    <div className='flex-1 w-full max-w-xl'>
                        <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-50">
                            <UserNameForm
                                name={session?.user?.name!}
                                userId={session?.user?.id!}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardProfilePage
