"use client";

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
import { sendContactMessage } from "@/server/actions/contact";
import { toast } from "sonner";
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const t = useTranslations('ContactPage');
  const [isPending, setIsPending] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setIsPending(true);
    try {
      const result = await sendContactMessage(values);
      if (result?.data?.success) {
        toast.success(t('messageSentSuccess') || "Message sent successfully!");
        form.reset();
      } else {
        toast.error(t('messageSentError') || "Failed to send message");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-slate-700">{t('firstName')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="John Doe" 
                    className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-slate-700">{t('email')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="john@example.com" 
                    className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-bold text-slate-700">{t('subject')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Inquiry about..." 
                  className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-bold text-slate-700">{t('message')}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="How can we help you?" 
                  className="min-h-[150px] border-slate-100 bg-slate-50/50 focus:bg-white" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          disabled={isPending} 
          type="submit" 
          className="w-full  h-14 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 transition-all flex items-center gap-3 cursor-pointer"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          {t('sendMessage')}
        </Button>
      </form>
    </Form>
  );
}
