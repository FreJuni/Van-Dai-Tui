
import AccountForm from '@/components/account/account-form';
import { auth } from '@/server/auth';
import React from 'react'
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

const DashboardAccountPage = async () => {
    const session = await auth();
    const t = await getTranslations('Dashboard');

    if(!session?.user || session.user.role !== 'admin') {
        redirect('/');
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter">{t('accountSettings')}</h1>
                <p className="text-gray-500 mt-2 font-medium">{t('updateYourAddressAndContactInformation')}</p>
            </div>

            <div className='bg-white rounded-[3rem] border border-gray-100 shadow-sm p-12'>
                <div className='max-w-xl bg-gray-50/50 p-8 rounded-3xl border border-gray-50'>
                    <AccountForm user={session?.user!} />
                </div>
            </div>
        </div>
    )
}

export default DashboardAccountPage
