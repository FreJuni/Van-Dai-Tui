import React from 'react';
import { db } from "@/server";
import { products, users, orders } from "@/server/schema";
import { count, eq, sum } from "drizzle-orm";
import { 
    Package, 
    Users, 
    TrendingUp, 
    DollarSign,
    ShoppingCart,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/src/i18n/navigation';
import { getTranslations } from 'next-intl/server';

async function getStats() {
    const [productCount, userCount, orderCount, completedOrders, pendingOrders] = await Promise.all([
        db.select({ value: count() }).from(products),
        db.select({ value: count() }).from(users),
        db.select({ value: count() }).from(orders),
        db.select({ 
            count: count(),
            totalRevenue: sum(orders.totalPrice)
        }).from(orders).where(eq(orders.status, 'Completed')),
        db.select({ value: count() }).from(orders).where(eq(orders.status, 'Pending')),
    ]);

    return {
        products: productCount[0]?.value || 0,
        users: userCount[0]?.value || 0,
        totalOrders: orderCount[0]?.value || 0,
        completedOrders: completedOrders[0]?.count || 0,
        totalRevenue: completedOrders[0]?.totalRevenue || 0,
        pendingOrders: pendingOrders[0]?.value || 0,
    };
}

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, href }: any) => {
    const CardContent = (
        <div className="bg-white p-6 rounded-4xl border cursor-pointer border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group">
            <div className="flex justify-between items-start mb-4">
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500",
                    color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                    color === 'purple' ? 'bg-purple-50 text-purple-600' : 
                    color === 'green' ? 'bg-green-50 text-green-600' :
                    color === 'orange' ? 'bg-orange-50 text-orange-600' :
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

    return href ? <Link href={href}>{CardContent}</Link> : CardContent;
};

const DashboardPage = async () => {
    const stats = await getStats();
    const t = await getTranslations('Dashboard');

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter">{t('overview.title')}</h1>
                <p className="text-gray-500 mt-2 font-medium">{t('overview.subtitle')}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title={t('stats.totalRevenue')}
                    value={new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(stats.totalRevenue as number)}
                    icon={DollarSign} 
                    color="green"
                    href="/dashboard/orders"
                />
                <StatCard 
                    title={t('stats.totalOrders')}
                    value={stats.totalOrders} 
                    icon={ShoppingCart} 
                    color="primary"
                    href="/dashboard/orders"
                />
                <StatCard 
                    title={t('stats.completedOrders')}
                    value={stats.completedOrders} 
                    icon={CheckCircle2} 
                    color="blue"
                    href="/dashboard/orders"
                />
                <StatCard 
                    title={t('stats.pendingOrders')}
                    value={stats.pendingOrders} 
                    icon={Clock} 
                    color="orange"
                    href="/dashboard/orders"
                />
                <StatCard 
                    title={t('stats.totalProducts')}
                    value={stats.products} 
                    icon={Package} 
                    color="purple"
                    href="/dashboard/products"
                />
                <StatCard 
                    title={t('stats.totalUsers')}
                    value={stats.users} 
                    icon={Users} 
                    color="blue"
                    href="/dashboard/users"
                />
            </div>

            {/* Recent Activity / Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm min-h-[400px] flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                            <TrendingUp className="text-gray-300" size={32} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">{t('charts.activityChartTitle')}</h3>
                        <p className="text-gray-400 max-w-xs font-medium">{t('charts.activityChartDescription')}</p>
                    </div>
                </div>
                
                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-gray-900 mb-6">{t('charts.quickStatsTitle')}</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-2xl">
                            <span className="text-sm font-bold text-green-900">{t('charts.revenue')}</span>
                            <span className="text-lg font-black text-green-600">
                                {new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', minimumFractionDigits: 0 }).format(stats.totalRevenue as number)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-2xl">
                            <span className="text-sm font-bold text-blue-900">{t('charts.completed')}</span>
                            <span className="text-lg font-black text-blue-600">{stats.completedOrders}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-orange-50 rounded-2xl">
                            <span className="text-sm font-bold text-orange-900">{t('charts.pending')}</span>
                            <span className="text-lg font-black text-orange-600">{stats.pendingOrders}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-purple-50 rounded-2xl">
                            <span className="text-sm font-bold text-purple-900">{t('charts.products')}</span>
                            <span className="text-lg font-black text-purple-600">{stats.products}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default DashboardPage;
