import React from 'react';
import { db } from "@/server";
import { products, users } from "@/server/schema";
import { count } from "drizzle-orm";
import { 
    Package, 
    Users, 
    TrendingUp, 
    Clock,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

async function getStats() {
    const [productCount, userCount] = await Promise.all([
        db.select({ value: count() }).from(products),
        db.select({ value: count() }).from(users),
    ]);

    return {
        products: productCount[0]?.value || 0,
        users: userCount[0]?.value || 0,
    };
}

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }: any) => (
    <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group">
        <div className="flex justify-between items-start mb-4">
            <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500",
                color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                color === 'purple' ? 'bg-purple-50 text-purple-600' : 
                'bg-primary/10 text-primary'
            )}>
                <Icon size={24} />
            </div>
            {trend && (
                <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black",
                    trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                )}>
                    {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {trendValue}%
                </div>
            )}
        </div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{value}</h3>
        </div>
    </div>
);

export default async function DashboardPage() {
    const stats = await getStats();

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Dashboard Overview</h1>
                <p className="text-gray-500 mt-2 font-medium">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Products" 
                    value={stats.products} 
                    icon={Package} 
                    trend="up" 
                    trendValue="12"
                    color="primary"
                />
                <StatCard 
                    title="Total Users" 
                    value={stats.users} 
                    icon={Users} 
                    trend="up" 
                    trendValue="5"
                    color="blue"
                />
                <StatCard 
                    title="Active Sessions" 
                    value="42" 
                    icon={Clock} 
                    trend="down" 
                    trendValue="2"
                    color="purple"
                />
                <StatCard 
                    title="Revenue (Mock)" 
                    value="RM 12,450" 
                    icon={TrendingUp} 
                    trend="up" 
                    trendValue="8"
                    color="primary"
                />
            </div>

            {/* Recent Activity / Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm min-h-[400px] flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                            <TrendingUp className="text-gray-300" size={32} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Activity Chart</h3>
                        <p className="text-gray-400 max-w-xs font-medium">Detailed analytics and sales charts will appear here as the store grows.</p>
                    </div>
                </div>
                
                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-gray-900 mb-6">Recent Users</h3>
                    <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-400">
                                    U{i}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">New User {i}</p>
                                    <p className="text-xs text-gray-400 truncate">Joined 2 hours ago</p>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/20" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
