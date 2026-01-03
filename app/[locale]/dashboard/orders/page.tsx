import { getAllOrders } from '@/server/actions/get-admin-orders'
import { Pagination } from '@/components/ui/pagination-custom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Package, Search } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import OrdersTable from '@/components/dashboard/orders-table'

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const page = typeof params.page === 'string' ? Number(params.page) : 1;
    const status = typeof params.status === 'string' ? params.status : undefined;
    const search = typeof params.search === 'string' ? params.search : undefined;
    const limit = 10;
    const t = await getTranslations('Dashboard.orders');

    const { success: orders, error, totalPages, currentPage, totalCount } = await getAllOrders(page, limit, {
        status,
        searchQuery: search
    });

    if (error) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                    <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
                </div>
                <Card className="border-destructive/50">
                    <CardContent className="pt-6">
                        <p className="text-destructive">{error}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                    <p className="text-muted-foreground mt-1">
                        {totalCount ? t('totalOrders', { count: totalCount }) : t('subtitle')}
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
                    <Package className="w-5 h-5 text-primary" />
                    <span className="font-bold text-primary">{totalCount || 0}</span>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">{t('filters')}</CardTitle>
                    <CardDescription>{t('filterDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="search">{t('searchOrderId')}</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    name="search"
                                    placeholder={t('searchPlaceholder')}
                                    className="pl-9"
                                    defaultValue={search}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">{t('status')}</Label>
                            <Select name="status" defaultValue={status || "all"}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder={t('allStatuses')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('allStatuses')}</SelectItem>
                                    <SelectItem value="Pending">{t('pending')}</SelectItem>
                                    <SelectItem value="Shipped">{t('shipped')}</SelectItem>
                                    <SelectItem value="Delivered">{t('delivered')}</SelectItem>
                                    <SelectItem value="Completed">{t('completed')}</SelectItem>
                                    <SelectItem value="Cancelled">{t('cancelled')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium text-sm"
                            >
                                {t('applyFilters')}
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <OrdersTable orders={orders || []} />

            {/* Pagination */}
            {totalPages && totalPages > 1 ? (
                <Pagination totalPages={totalPages} currentPage={currentPage || 1} />
            ) : null}
        </div>
    )
}
