
import { getUserOrders } from '@/server/actions/get-user-orders'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Package, ChevronRight, Calendar, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Pagination } from '@/components/ui/pagination-custom'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/src/i18n/navigation'
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'

export default async function MyOrdersPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const session = await auth();
    if (!session) redirect('/auth/login');

    const page = typeof params.page === 'string' ? Number(params.page) : 1;
    const limit = 6; // Orders per page
    const t = await getTranslations('MyOrders');

    const { success: orders, error, totalPages, currentPage } = await getUserOrders(page, limit);
    
    if (error) {
         return (
             <div className="container mx-auto p-4 py-8">
                 <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>
                 <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-md">
                     {t('errorLoadingOrders')}: {error}
                 </div>
             </div>
         )
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="py-6 px-6 md:px-12 lg:px-[100px]">
                <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
                <p className="text-muted-foreground mb-8">{t('subtitle')}</p>
                <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed">
                    <div className="bg-muted/50 p-4 rounded-full mb-4">
                        <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{t('noOrders')}</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                        {t('noOrdersDescription')}
                    </p>
                    <Button asChild>
                        <Link href="/">{t('startShopping')}</Link>
                    </Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="py-6 px-6 md:px-12 lg:px-[100px]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                    <p className="text-muted-foreground mt-1">
                         {t('description')}
                    </p>
                </div>
            </div>

            {/* Orders Grid - Responsive: 1 col mobile, 2 col tablet/small laptop, 3 col large screen */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {orders.map((order) => (
                    <Card key={order.id} className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-md flex flex-col h-full group">
                        <CardHeader className="bg-muted/30 pb-4 border-b">
                            <div className="flex justify-between items-start gap-2">
                                <div className="space-y-1">
                                    <CardTitle className="text-base font-semibold">
                                        {t('order')} {order.id}
                                    </CardTitle>
                                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy') : 'N/A'}</span>
                                    </div>
                                </div>
                                <StatusBadge status={order.status} />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 flex-grow space-y-4">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                    <Package className="w-5 h-5 text-primary" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-medium text-sm">{order.quantity} {order.quantity === 1 ? t('item') : t('items')}</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {order.orderProducts.slice(0, 2).map(op => op.products.title).join(', ')}
                                        {order.orderProducts.length > 2 && ` +${order.orderProducts.length - 2} more`}
                                    </p>
                                </div>
                             </div>
                             
                             <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t('totalAmount')}</p>
                                <p className="text-lg font-bold text-primary">
                                    {new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(order.totalPrice)}
                                </p>
                             </div>
                        </CardContent>
                        <CardFooter className="bg-muted/5 py-3 px-5 border-t mt-auto">
                            <Button asChild variant="ghost" size="sm" className="w-full justify-between group-hover:text-primary group-hover:bg-primary/5">
                                <Link href={`/my-orders/${order.id}`}>
                                    {t('viewDetails')} <ChevronRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-8">
                <Pagination totalPages={totalPages || 1} currentPage={currentPage || 1} />
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string | null }) {
    if (!status) return null;
    
    // Colorful badges logic
    const styles = {
        'Completed': "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
        'Delivered': "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
        'Pending': "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
        'Shipped': "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
        'Cancelled': "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    }
    
    const className = styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700 border-gray-200";

    return (
        <Badge variant="outline" className={cn("font-medium border capitalize whitespace-nowrap", className)}>
            {status}
        </Badge>
    )
}
