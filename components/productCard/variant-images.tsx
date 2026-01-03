"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useTranslations } from "next-intl";
import z from "zod";
import { VariantsSchema } from "@/types/variants-schema";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadDropzone } from "@/app/[locale]/api/uploadthing/uploadthing";

const VariantsImage = () => {
    const t = useTranslations('Product');
    const { control, setError, getValues } = useFormContext<z.infer<typeof VariantsSchema>>();

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "variantImages",
    });

    return (
        <div>
            <FormField
                control={control}
                name="variantImages"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('variantImages')}</FormLabel>
                        <FormDescription>{t('youCanUpload')}</FormDescription>
                        <FormControl>
                            <UploadDropzone
                                endpoint="variantImageUploader"
                                onBeforeUploadBegin={(files) => {
                                    files?.forEach((file) => {
                                        const image = URL.createObjectURL(file);
                                        append({
                                            url: image,
                                            name: file.name,
                                            size: file.size,
                                        })
                                    })

                                    return files;
                                }}
                                onClientUploadComplete={(data) => {
                                    const variantsImages = getValues('variantImages');
                                    variantsImages?.forEach((Img, index) => {
                                        if (Img.url.startsWith("blob:")) {
                                            const image = data.find(img => img.name === Img.name) as any;
                                            if (image) {
                                                update(index, {
                                                    url: image.url,
                                                    name: image.name,
                                                    size: image.size,
                                                })
                                            }
                                        }
                                    })
                                }}
                                onUploadError={(error: Error) => {
                                    setError('variantImages', {
                                        type: 'validate',
                                        message: error.message
                                    })
                                }}
                                config={{ mode: "auto" }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className=' flex flex-wrap gap-2 mt-2'>
                {fields.map((field, index) => {
                    return <div key={index} className={cn('relative h-[90px]', field?.url?.startsWith('blob:') && ' animate-pulse transition-all')}>
                        <Image
                            src={field?.url}
                            alt={field?.name}
                            width={70}
                            height={50}
                            className=' object-cover rounded-sm border border-gray-200 h-full' />
                        <span
                            onClick={(e) => {
                                e.preventDefault();
                                remove(index);
                            }} className=' absolute top-1 right-0.5 cursor-pointer bg-red-500 rounded-full text-white'><X width={20} height={20} /></span>
                    </div>
                })}
            </div>
        </div>
    )
}

export default VariantsImage;
