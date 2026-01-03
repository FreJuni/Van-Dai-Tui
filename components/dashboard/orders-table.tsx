"use client"

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card } from '@/components/ui/card'
import { phoneNumberFormat } from '@/lib/const'
import { useTranslations } from 'next-intl'

type Order = {
    id: string
    userId: string
    quantity: number
    status: string | null
    totalPrice: number
    createdAt: Date | null
    user: {
        id: string
        name: string | null
        phone_number: string | null
    }
    orderProducts: any[]
}

type OrdersTableProps = {
    orders: Order[]
}

const OrdersTable = ({ orders }: OrdersTableProps) => {
    const t = useTranslations('Dashboard');

    if (orders.length === 0) {
        return (
            <Card className="p-12 text-center">
                <p className="text-muted-foreground">{t('noOrdersFound')}</p>
            </Card>
        )
    }

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="font-semibold">Order ID</TableHead>
                            <TableHead className="font-semibold">Customer</TableHead>
                            <TableHead className="font-semibold">Date</TableHead>
                            <TableHead className="font-semibold">Items</TableHead>
                            <TableHead className="font-semibold">Total</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} className="hover:bg-muted/30">
                                <TableCell className="font-mono text-sm">
                                    {order.id}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{order.user.name || 'N/A'}</p>
                                        <p className="text-xs text-muted-foreground">{phoneNumberFormat(order.user.phone_number!) || 'N/A'}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm">
                                    {order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy') : 'N/A'}
                                </TableCell>
                                <TableCell className="text-sm">
                                    {order.quantity} {order.quantity === 1 ? 'item' : 'items'}
                                </TableCell>
                                <TableCell className="font-semibold">
                                    {new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(order.totalPrice)}
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={order.status} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/dashboard/orders/${order.id}`}>
                                            <Eye className="w-4 h-4 mr-1" />
                                            View
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {orders.map((order) => (
                    <Card key={order.id} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="font-mono text-sm font-semibold">#{order.id.slice(-8).toUpperCase()}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy') : 'N/A'}
                                </p>
                            </div>
                            <StatusBadge status={order.status} />
                        </div>
                        
                        <div className="space-y-2 mb-3">
                            <div>
                                <p className="text-xs text-muted-foreground">Customer</p>
                                <p className="font-medium text-sm">{order.user.name || 'N/A'}</p>
                                <p className="text-xs" >{phoneNumberFormat(order.user.phone_number!) || 'N/A'}</p>
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">Items</p>
                                    <p className="font-medium text-sm">{order.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">Total</p>
                                    <p className="font-semibold text-sm">
                                        {new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(order.totalPrice)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link href={`/dashboard/orders/${order.id}`}>
                                View Details <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        </Button>
                    </Card>
                ))}
            </div>
        </>
    )
}

export default OrdersTable;

function StatusBadge({ status }: { status: string | null }) {
    if (!status) return <Badge variant="outline">Unknown</Badge>;
    
    const styles = {
        'Completed': "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
        'Delivered': "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
        'Pending': "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
        'Shipped': "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
        'Cancelled': "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    }
    
    const className = styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700 border-gray-200";

    return (
        <Badge variant="outline" className={cn("font-medium border capitalize whitespace-nowrap text-xs", className)}>
            {status}
        </Badge>
    )
}

