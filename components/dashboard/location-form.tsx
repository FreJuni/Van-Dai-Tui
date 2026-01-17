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
import { Textarea } from "@/components/ui/textarea";
import { addLocation, updateLocation } from "@/server/actions/location";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";

const locationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  openingHours: z.string().min(1, "Opening hours are required"),
  googleMapsEmbed: z.string().min(1, "Google Maps embed HTML is required"),
});

type LocationFormValues = z.infer<typeof locationSchema>;

interface LocationFormProps {
  initialData?: LocationFormValues & { id: string };
  onSuccess?: () => void;
}

export function LocationForm({ initialData, onSuccess }: LocationFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("Dashboard.locations");

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: initialData || {
      name: "",
      phone: "",
      address: "",
      openingHours: "",
      googleMapsEmbed: "",
    },
  });

  async function onSubmit(values: LocationFormValues) {
    setLoading(true);
    try {
      if (initialData) {
        const result = await updateLocation({ ...values, id: initialData.id });
        if (result?.data?.success) {
          toast.success(t("toast.updated"));
          onSuccess?.();
        } else {
            toast.error(t("toast.updateFailed"));
        }
      } else {
        const result = await addLocation(values);
        if (result?.data?.success) {
          toast.success(t("toast.added"));
          form.reset();
          onSuccess?.();
        } else {
            toast.error(t("toast.addFailed"));
        }
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.name")}</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Main Store" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.phone")}</FormLabel>
              <FormControl>
                <Input placeholder="+60 123 456 789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.address")}</FormLabel>
              <FormControl>
                <Textarea placeholder="123 Street, City, Country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="openingHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.hours")}</FormLabel>
              <FormControl>
                <Input placeholder="Mon - Sun: 9:00 AM - 9:00 PM" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="googleMapsEmbed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.maps")}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder='<iframe src="..." ...></iframe>' 
                  className="font-mono text-xs"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                {t("form.title")}
              </p>
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit" className="w-full cursor-pointer">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? t("updateLocation") : t("addLocation")}
        </Button>
      </form>
    </Form>
  );
}
