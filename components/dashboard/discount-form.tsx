"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createDiscount, updateDiscount } from "@/server/actions/discount";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

const discountSchema = z.object({
    minPrice: z.string().min(1, "Minimum price is required"),
    maxPrice: z.string().min(1, "Maximum price is required"),
    discount: z.string().min(1, "Discount is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
});

type DiscountFormValues = z.infer<typeof discountSchema>;

interface DiscountFormProps {
    initialData?: {
        id: string;
        minPrice: number;
        maxPrice: number;
        discount: number;
        startDate: Date | string;
        endDate: Date | string;
    };
    onSuccess?: () => void;
}

export function DiscountForm({ initialData, onSuccess }: DiscountFormProps) {
    const [loading, setLoading] = useState(false);
    const t = useTranslations("Dashboard.discounts");

    // Format dates for input type="datetime-local" (YYYY-MM-DDTHH:mm)
    const formatDateForInput = (date: Date | string) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toISOString().slice(0, 16);
    };

    const form = useForm<DiscountFormValues>({
        resolver: zodResolver(discountSchema),
        defaultValues: initialData ? {
            minPrice: initialData.minPrice.toString(),
            maxPrice: initialData.maxPrice.toString(),
            discount: initialData.discount.toString(),
            startDate: formatDateForInput(initialData.startDate),
            endDate: formatDateForInput(initialData.endDate),
        } : {
            minPrice: "0",
            maxPrice: "0",
            discount: "0",
            startDate: "",
            endDate: "",
        },
    });

    async function onSubmit(values: DiscountFormValues) {
        setLoading(true);
        const submissionData = {
            minPrice: parseFloat(values.minPrice),
            maxPrice: parseFloat(values.maxPrice),
            discount: parseFloat(values.discount),
            startDate: new Date(values.startDate),
            endDate: new Date(values.endDate),
            id: initialData?.id,
        };

        try {
            const result = initialData 
                ? await updateDiscount(submissionData)
                : await createDiscount(submissionData);

            if (result?.data?.success) {
                toast.success(initialData ? t("toast.updated") : t("toast.added"));
                if (!initialData) form.reset();
                onSuccess?.();
            } else {
                toast.error(t("toast.error"));
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="minPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("form.minPrice")}</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="maxPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("form.maxPrice")}</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("form.discount")}</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("form.startDate")}</FormLabel>
                                <FormControl>
                                    <Input type="datetime-local" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("form.endDate")}</FormLabel>
                                <FormControl>
                                    <Input type="datetime-local" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button disabled={loading} type="submit" className="w-full cursor-pointer">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? t("editDiscount") : t("addDiscount")}
                </Button>
            </form>
        </Form>
    );
}
