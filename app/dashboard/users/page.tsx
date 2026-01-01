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
    Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default async function UsersPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const query = typeof params.q === 'string' ? params.q : '';
    const pageSize = 10;

    const { items: users, totalCount } = await fetchAllUsers(page, pageSize, query);
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6'>
                <div>
                    <h1 className='text-4xl font-black text-gray-900 tracking-tighter'>User Management</h1>
                    <p className='text-gray-500 mt-2 font-medium'>View and manage all registered customers and their roles.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                        <Users size={16} />
                        {totalCount} Total Users
                    </div>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                {/* Table Header / Search */}
                <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <form className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input 
                            name="q"
                            defaultValue={query}
                            placeholder="Search users by name or phone..." 
                            className="pl-10 h-12 bg-white border-gray-100 rounded-2xl focus:ring-primary/20 transition-all font-medium"
                        />
                    </form>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-12 px-6 rounded-2xl font-bold border-gray-100 hover:bg-gray-50">
                            Export CSV
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">User</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">Contact</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">Role</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.length > 0 ? users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-6 border-b border-gray-50">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                                                <AvatarImage src={user.image!} />
                                                <AvatarFallback className="bg-primary/5 text-primary text-xs font-black">
                                                    {user.name?.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">ID: {user.id.slice(0, 8)}...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 border-b border-gray-50">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                                <Phone size={12} className="text-gray-400" />
                                                {user.phone_number || 'N/A'}
                                            </div>
                                            {user.address && (
                                                <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{user.address}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 border-b border-gray-50">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                                            user.role === 'admin' 
                                                ? "bg-primary/10 text-primary" 
                                                : "bg-gray-100 text-gray-500"
                                        )}>
                                            {user.role === 'admin' && <Shield size={10} />}
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 border-b border-gray-50 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-gray-100">
                                                <MoreVertical size={18} className="text-gray-400" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="bg-gray-50 p-6 rounded-3xl mb-4">
                                                <Users className="text-gray-300" size={32} />
                                            </div>
                                            <p className="text-gray-900 font-black">No users found</p>
                                            <p className="text-sm text-gray-400 font-medium mt-1">Try a different search term.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-8 border-t border-gray-50 flex justify-between items-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Showing {users.length} of {totalCount} users
                    </p>
                    <Pagination totalPages={totalPages} currentPage={page} />
                </div>
            </div>
        </div>
    );
}
