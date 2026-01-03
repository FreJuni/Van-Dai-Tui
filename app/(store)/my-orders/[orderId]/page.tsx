
import { getOrder } from '@/server/actions/get-user-orders'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MessageCircle, Truck, Package, MapPin, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { getTranslations } from 'next-intl/server'

export default async function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;
    const { success: order, error } = await getOrder(orderId);
    const t = await getTranslations('MyOrders');

    const WHATSAPP_NUMBER = process.env.ADMIN_PHONE_NUMBER; 
    
    // Construct WhatsApp message with order details
    const whatsappMessage = order ? 
        t('whatsappOrderHelp', { id: order.id.slice(-8).toUpperCase() }) : 
        t('whatsappGeneralHelp');
    
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

    if (error || !order) {
        return (
            <div className="container mx-auto p-4 py-8">
                <Button variant="ghost" asChild className="mb-4">
                    <Link href="/my-orders"><ArrowLeft className="w-4 h-4 mr-2" /> {t('backToOrders')}</Link>
                </Button>
                <div className="flex flex-col items-center justify-center p-8 border border-destructive/20 bg-destructive/5 text-destructive rounded-lg text-center">
                    <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                    <h2 className="text-lg font-semibold mb-2">{t('couldNotLoadOrder')}</h2>
                     <p className="text-sm opacity-80 mb-4">{error || t('orderNotFound')}</p>
                     <Button variant="outline" asChild>
                        <Link href="/my-orders">{t('returnToList')}</Link>
                     </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="py-6 px-6 md:px-12 lg:px-[100px]">
            {/* Header Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-2">
                     <Button variant="outline" size="icon" className="h-9 w-9" asChild>
                        <Link href="/my-orders"><ArrowLeft className="w-4 h-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            {order.id}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t('placedOn')} {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit'
                            }) : 'N/A'}
                        </p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2">
                    <Button className="bg-green-600 hover:bg-green-700 text-white gap-2" asChild>
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="w-4 h-4" />
                            {t('needHelp')}
                        </a>
                    </Button>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Main Content - Left Column (2/3 width) */}
                <div className="md:col-span-2 space-y-6">
                    {/* Order Status & Progress */}
                    <Card>
                        <CardHeader className="bg-muted/30 pb-4">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Truck className="w-4 h-4 text-primary" /> {t('orderStatus')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                             <div className="flex items-center justify-between">
                                 <div>
                                    <p className="text-sm text-muted-foreground mb-1">{t('currentStatus')}</p>
                                    <StatusBadge status={order.status} />
                                 </div>
                                 <div className="text-right hidden sm:block">
                                    <p className="text-sm text-muted-foreground mb-1">{t('lastUpdated')}</p>
                                    <p className="font-medium">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                                 </div>
                             </div>
                        </CardContent>
                    </Card>

                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Package className="w-4 h-4 text-primary" /> {t('orderItems')} ({order.orderProducts.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            {order.orderProducts.map((item, index) => (
                                <div key={item.id}>
                                    <div className="flex gap-4 items-start">
                                        {/* Product Image */}
                                        <div className="relative w-20 h-[110px] sm:h-20 md:w-24 md:h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0 border">
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
                                        
                                        <div className="flex-grow flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                            {/* Product Details */}
                                            <div className="space-y-1">
                                                <h3 className="font-semibold text-base">{item.products.title}</h3>
                                                <div className="text-sm text-muted-foreground space-y-1">
                                                    <p><span className="font-medium text-foreground">{t('color')}:</span> {item.productVariant.variantName}</p>
                                                    
                                                    {/* Optional Details if available */}
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                                                        {item.productVariant.productVariantOption && item.productVariant.productVariantOption.length > 0 && (
                                                            <p><span className="font-medium text-foreground">{t('storage')}:</span> {item.productVariant.productVariantOption[0]?.storage}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="text-left md:text-right">
                                                {item.productVariant.productVariantOption && item.productVariant.productVariantOption.length > 0 && item.productVariant.productVariantOption[0]?.price && (
                                                    <p className="font-semibold text-lg">
                                                        {new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(item.productVariant.productVariantOption[0].price)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {index < order.orderProducts.length - 1 && <Separator className="mt-6" />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Right Column (1/3 width) */}
                <div className="space-y-6">
                    {/* Payment Summary Box */}
                    {/* Changed bg to solid 'bg-background' and added shadow/border for better sticky visibility without transparency issues */}
                    <Card className="bg-background border shadow-sm sticky top-24 z-10">
                        <CardHeader className="bg-muted/20 pb-4 border-b">
                            <CardTitle className="text-lg">{t('paymentSummary')}</CardTitle>
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
                                <span className="font-bold text-lg">{t('total')}</span>
                                <span className="font-bold text-xl text-primary">
                                    {new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(order.totalPrice)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Package className="w-4 h-4 text-primary" /> {t('paymentMethod')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                        <line x1="1" y1="10" x2="23" y2="10"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{t('cashOnDelivery')}</p>
                                    <p className="text-xs text-muted-foreground">{t('payWhenReceive')}</p>
                                </div>
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

            {/* Fixed Mobile Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 md:hidden flex items-center justify-between safe-area-pb">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">{t('totalAmount')}</span>
                    <span className="font-bold text-lg text-primary">
                         {new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(order.totalPrice)}
                    </span>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full" size="sm" asChild>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {t('chatSupport')}
                    </a>
                </Button>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string | null }) {
    if (!status) return null;
    
    // Vibrant solid colors for "Color full" look
    const styles = {
        'Completed': "bg-green-500 hover:bg-green-600 border-transparent text-white",
        'Delivered': "bg-green-500 hover:bg-green-600 border-transparent text-white",
        'Pending': "bg-yellow-500 hover:bg-yellow-600 border-transparent text-white",
        'Shipped': "bg-blue-500 hover:bg-blue-600 border-transparent text-white",
        'Cancelled': "bg-red-500 hover:bg-red-600 border-transparent text-white",
    }
    
    const className = styles[status as keyof typeof styles] || "bg-gray-500 text-white border-transparent";

    return (
        <Badge className={cn("px-3 py-1 text-sm font-medium capitalize", className)}>
            {status}
        </Badge>
    )
}
