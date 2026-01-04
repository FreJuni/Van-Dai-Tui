import { getAdminOrder } from '@/server/actions/get-admin-orders'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package, User, Mail, Calendar, MapPin, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { OrderStatusSelect } from '@/components/dashboard/order-status-select'
import { phoneNumberFormat } from '@/lib/const'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/src/i18n/navigation'

export default async function AdminOrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;
    const { success: order, error } = await getAdminOrder(orderId);
    const t = await getTranslations('Dashboard.orders');

    console.log("order", order);
    

    if (error || !order) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" asChild>
                    <Link href="/dashboard/orders"><ArrowLeft className="w-4 h-4 mr-2" /> {t('backToOrders')}</Link>
                </Button>
                <Card className="border-destructive/50">
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                        <h2 className="text-lg font-semibold mb-2">{t('couldNotLoadOrder')}</h2>
                        <p className="text-sm text-muted-foreground">{error || t('orderNotFound')}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/dashboard/orders"><ArrowLeft className="w-4 h-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{t('order')} #{order.id.slice(-8).toUpperCase()}</h1>
                        <p className="text-sm text-muted-foreground">
                            {t('placedOn')} {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit'
                            }) : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Customer Information */}
                    <Card>
                        <CardHeader className="bg-muted/30 pb-4">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" /> {t('customerInformation')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-3">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{order?.user?.name || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{phoneNumberFormat(order?.user?.phone_number!) || 'N/A'}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <span className="text-sm text-muted-foreground">{order?.user?.address || t('noAddressProvided')}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Package className="w-4 h-4 text-primary" /> {t('items')} ({order.orderProducts.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            {order.orderProducts.map((item, index) => (
                                <div key={item.id}>
                                    <div className="flex gap-4 items-start">
                                        {/* Product Image */}
                                        <div className="relative w-20 h-20 md:w-24 md:h-24 bg-muted rounded-lg overflow-hidden shrink-0 border">
                                            {item.productVariant.productVariantImage[0]?.image_url ? (
                                                <Image 
                                                    src={item.productVariant.productVariantImage[0].image_url} 
                                                    alt={item.productVariant.productVariantImage[0].name || "Product Image"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                                    {t('noImage')}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="grow flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                            {/* Product Details */}
                                            <div className="space-y-1">
                                                <h3 className="font-semibold text-base">{item.products.title}</h3>
                                                <div className="text-sm text-muted-foreground space-y-1">
                                                    <p><span className="font-medium text-foreground">{t('color')}:</span> {item.productVariant.variantName}</p>
                                                    
                                                    {/* Optional Details */}
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                                                        {item.productVariant.productVariantOption && item.productVariant.productVariantOption.length > 0 && (
                                                            <p><span className="font-medium text-foreground">{t('storage')}:</span> {item.productVariant.productVariantOption[0]?.storage}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="text-left sm:text-right">
                                                {item.productVariant.productVariantOption && item.productVariant.productVariantOption.length > 0 && item.productVariant.productVariantOption[0]?.price && (
                                                    <p className="font-semibold text-lg">
                                                        {new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(item.productVariant.productVariantOption[0].price)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {index < order?.orderProducts?.length - 1 && <Separator className="mt-6" />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Order Status */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">{t('orderStatus')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-xs text-muted-foreground mb-2">{t('currentStatus')}</p>
                                <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">{t('lastUpdated')}</p>
                                <p className="font-medium text-sm">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Summary */}
                    <Card className="bg-background border shadow-sm">
                        <CardHeader className="bg-muted/20 pb-4 border-b">
                            <CardTitle className="text-base">{t('paymentSummary')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t('subtotal')} ({order.quantity} items)</span>
                                <span>{new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(order.totalPrice)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t('shipping')}</span>
                                <span className="text-green-600 font-medium">{t('cashOnDelivery')}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center pt-2">
                                <span className="font-bold text-base">{t('total')}</span>
                                <span className="font-bold text-lg text-primary">
                                    {new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(order.totalPrice)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Delivery Info */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" /> {t('deliveryAddress')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {order?.user?.address ? (
                                <p className="text-sm">{order.user.address}</p>
                            ) : (
                                <p className="text-sm text-muted-foreground">{t('noAddressProvided')}</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
