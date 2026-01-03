"use client"

import { useState, useTransition } from 'react'
import { updateOrderStatus } from '@/server/actions/get-admin-orders'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from '@/src/i18n/navigation';
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

type OrderStatusSelectProps = {
    orderId: string
    currentStatus: string | null
}

const statuses = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' },
]

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter();
    const t = useTranslations('Dashboard');

    const handleStatusChange = (newStatus: string) => {
        setSelectedStatus(newStatus)
        setShowConfirmDialog(true)
    }

    const confirmStatusChange = async () => {
        if (!selectedStatus) return

        startTransition(async () => {
            const result = await updateOrderStatus(orderId, selectedStatus)
            
            if (result.error) {
                toast.error('Failed to update status', {
                    description: result.error
                })
            } else {
                toast.success('Status updated successfully', {
                    description: `Order status changed to ${selectedStatus}`
                })
                router.refresh()
            }
            
            setShowConfirmDialog(false)
            setSelectedStatus(null)
        })
    }

    return (
        <>
            <Select 
                value={currentStatus || undefined} 
                onValueChange={handleStatusChange}
                disabled={isPending}
            >
                <SelectTrigger className="w-[180px]">
                    {isPending ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Updating...</span>
                        </div>
                    ) : (
                        <SelectValue placeholder="Select status" />
                    )}
                </SelectTrigger>
                <SelectContent>
                    {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                            {status.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('confirmStatusChange')}</AlertDialogTitle>
                        <AlertDialogDescription>
                           {t('confirmStatusChangeDescription', { currentStatus: currentStatus || '', selectedStatus: selectedStatus || '' })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className='cursor-pointer' disabled={isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction className='cursor-pointer' onClick={confirmStatusChange} disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Confirm'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
