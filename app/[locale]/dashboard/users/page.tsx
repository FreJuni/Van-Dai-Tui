import React from 'react';
import { fetchAllUsers } from '@/server/actions/admin-user';
import { Pagination } from '@/components/ui/pagination-custom';
import {
  Users,
  Search,
  MoreVertical,
  Shield,
  Trash2,
  Mail,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import UserSearchInput from '@/components/dashboard/user-search-input';
import ActionDropdown from '@/components/dashboard/action-dropdown';
import { auth } from '@/server/auth';
import { getTranslations } from 'next-intl/server';
import { phoneNumberFormat } from '@/lib/const';

const UsersPage = async ({searchParams}: {searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const query = typeof params.q === 'string' ? params.q : '';
  const pageSize = 10;
  const session = await auth();
  const t = await getTranslations('Dashboard');  

  const { items: users, totalCount } = await fetchAllUsers(
    page,
    pageSize,
    query
  );
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900">
            {t('userManagement')}
          </h1>
          <p className="mt-2 font-medium text-gray-500">
            {t('viewAndManageAllRegisteredCustomersAndTheirRoles')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold">
            <Users size={16} />
            {totalCount} {t('stats.totalUsers')}
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="overflow-hidden rounded-[3rem] border border-gray-100 bg-white shadow-sm">
        {/* Table Header / Search */}
        <div className="flex flex-col justify-between gap-4 border-b border-gray-50 bg-gray-50/30 p-8 md:flex-row md:items-center">
          <UserSearchInput />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="border-b border-gray-50 px-8 py-5 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                  User
                </th>
                <th className="border-b border-gray-50 px-8 py-5 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                  Contact
                </th>
                <th className="border-b border-gray-50 px-8 py-5 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                  Role
                </th>
                <th className="border-b border-gray-50 px-8 py-5 text-right text-[10px] font-black tracking-widest text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="group transition-colors hover:bg-gray-50/30"
                  >
                    <td className="border-b border-gray-50 px-8 py-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarImage className='object-cover' src={user.image!} />
                          <AvatarFallback className="bg-primary/5 text-primary text-xs font-black">
                            {user.name?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                            ID: {user.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="border-b border-gray-50 px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                          <Phone size={12} className="text-gray-400" />
                          {phoneNumberFormat(user.phone_number!) || 'N/A'}
                        </div>
                        {user.address && (
                          <p className="max-w-[200px] truncate text-[10px] text-gray-400">
                            {user.address}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="border-b border-gray-50 px-8 py-6">
                      <div
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black tracking-tight uppercase',
                          user.role === 'admin'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-gray-100 text-gray-500'
                        )}
                      >
                        {user.role === 'admin' && <Shield size={10} />}
                        {user.role}
                      </div>
                    </td>
                    <td className="border-b border-gray-50 px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ActionDropdown
                            currentUser={session?.user!}
                            user={user}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 cursor-pointer rounded-xl hover:bg-gray-100"
                          >
                            <MoreVertical size={18} className="text-gray-400" />
                          </Button>
                        </ActionDropdown>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-4 rounded-3xl bg-gray-50 p-6">
                        <Users className="text-gray-300" size={32} />
                      </div>
                      <p className="font-black text-gray-900">{t('noUsersFound')}</p>
                      <p className="mt-1 text-sm font-medium text-gray-400">
                        {t('tryADifferentSearchTerm')}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-gray-50 p-8">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
            {t('showing')} {users.length} {t('of')} {totalCount} {t('users')}
          </p>
          <Pagination totalPages={totalPages} currentPage={page} />
        </div>
      </div>
    </div>
  );
}

export default UsersPage;

