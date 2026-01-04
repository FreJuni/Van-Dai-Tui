"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useTranslations } from "next-intl";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { VariantsSchema } from "@/types/variants-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import VariantsImage from "./variant-images";
import { useAction } from "next-safe-action/hooks";
import { addProductVariantAction, deleteVariant } from "@/server/actions/product";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { VariantsWithImagesTags } from "@/lib/infer-type";
import { cn } from "@/lib/utils";
import { useRouter } from '@/src/i18n/navigation';
import { Package } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type VariantsModalProps = {
    children: React.ReactNode;
    productId: string;
    editMode?: boolean;
    variant?: VariantsWithImagesTags;
}

const VariantModal = ({ children, productId, editMode, variant }: VariantsModalProps) => {
    const t = useTranslations('Product');
    const router = useRouter();
    const [open, setOpen] = useState(false);


    const form = useForm<z.infer<typeof VariantsSchema>>({
        resolver: zodResolver(VariantsSchema),
        defaultValues: {
            productID: productId,
            variantImages: [],
            color: '#000000',
            editMode,
            storages: [],
            id: undefined,
            name: '',
            condition: 'New',
        }
    })

    const { execute, status, result } = useAction(addProductVariantAction, {
        onSuccess: (result) => {
            form.reset();
            if (result?.data?.success) {
                toast.success(result.data.success);
                // router.push(`/dashboard/products`);
                setOpen(false);
            }
            if (result?.data?.error) {
                toast.error(result.data.error);
            }
        },
    })

    const onSubmit = (values: z.infer<typeof VariantsSchema>) => {
        const { id, name, color, variantImages, storages, editMode, condition } = values;

        execute({
            id,
            productID: productId,
            name,
            color,
            variantImages,
            storages,
            editMode,
            condition
        });
    }

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "storages",
    });

    const getOldData = () => {

        if (!editMode && !variant) {
            form.reset();
            return;
        }

        if (editMode && variant) {
            form.setValue('id', variant.id);
            form.setValue('name', variant.variantName);
            form.setValue('editMode', true)
            form.setValue('color', variant.productVariantColor.color);
            form.setValue('productID', variant.productId);
            form.setValue('condition', variant.productVariantCondition.condition!);
            form.setValue('variantImages', variant?.productVariantImage?.map((image: any) => {
                return {
                    url: image.image_url,
                    name: image.name,
                    size: Number(image.size),
                }
            }));
            form.setValue('storages', variant?.productVariantOption?.map((storage: any) => {
                return {
                    storage: storage.storage,
                    price: storage.price
                }
            }));
        }
    }

    const handleDeleteVariant = useAction(deleteVariant, {
        onSuccess({ data }) {
            setOpen(false);
            form.reset();
            if (data?.success) {
                toast.success(data.success);
            }
            if (data?.error) {
                toast.error(data.error);
            }
        }
    })

    useEffect(() => {
        getOldData();
    }, [editMode, variant, productId]);

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className="h-[43rem] overflow-y-scroll">
                    <DialogHeader>
                        <DialogTitle>{t('createProductVariants')}</DialogTitle>
                        <DialogDescription>
                            {t('addNewProductVariants')}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-7 flex-col">

                            <FormField
                                control={form.control}
                                name="productID"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input {...field} hidden value={productId!} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('variantName')}</FormLabel>
                                        <FormControl>
                                            <Input  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('variantColor')}</FormLabel>
                                        <FormControl>
                                            <Input type="color"  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                            control={form.control}
                            name="condition"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-gray-500" />
                                    Condition
                                </FormLabel>

                                <Select
                                    defaultValue={field.value}
                                    onValueChange={(value) => field.onChange(value)}
                                >
                                    <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue  placeholder="Select a category" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectGroup>
                                    <SelectContent>
                                    <SelectItem value="New">New</SelectItem>
                                    <SelectItem value="Used">Used</SelectItem>
                                    <SelectItem value="Refurbished">Refurbished</SelectItem>
                                    </SelectContent>
                                    </SelectGroup>
                                </Select>

                                <FormMessage />
                                </FormItem>
                            )}
                            />

                            {fields.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <div key={index} className="flex gap-2 justify-end items-end">
                                            <FormField
                                                control={form.control}
                                                name={`storages.${index}.storage`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t('storage')}</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="128GB" />
                                                        </FormControl>
                                                        {/* <FormMessage /> */}
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`storages.${index}.price`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t('price')}</FormLabel>
                                                        <FormControl>
                                                            <Input type="number"
                                                                {...field}
                                                                value={field.value === 0 ? '' : field.value ?? ''}
                                                                onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                                                                placeholder="Price"
                                                            />
                                                        </FormControl>
                                                        {/* <FormMessage /> */}
                                                    </FormItem>
                                                )}
                                            />
                                            <Button className="cursor-pointer" variant={"destructive"} type="button" onClick={() => remove(index)}>{t('remove')}</Button>
                                        </div>
                                    </div>
                                )
                            })}
                            <Button className="cursor-pointer" type="button" onClick={() => append({ storage: "", price: 0 })}>{t('addStorage')}</Button>


                            <VariantsImage />

                            <div className=" w-full flex gap-2">
                                <Button  disabled={status === 'executing'} className={cn("cursor-pointer flex-1", status === 'executing' && 'animate-pulse opacity-50')} type="submit">{editMode ? t('updateVariant') : t('createProductVariants')}</Button>
                                {
                                    editMode && variant && (
                                        <Button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDeleteVariant.execute({
                                                id: variant?.id!
                                            })
                                        }}
                                         type="button" variant="destructive" disabled={status === 'executing'} className={cn("cursor-pointer flex-1", status === 'executing' && 'animate-pulse opacity-50')} >{t('deleteVariant')}</Button>
                                    )
                                }
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default VariantModal;