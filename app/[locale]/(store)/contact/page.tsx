import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent } from '@/components/ui/card';
import { Metadata } from 'next';
import { getLocations } from '@/server/actions/location';
import { LocationSection } from '@/components/contact/location-section';
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with us for inquiries, repairs, or support. Visit our shop or contact us via WhatsApp or Messenger.",
};

const ContactPage = async () => {
    const t = await getTranslations('ContactPage');
    const adminPhone = process.env.ADMIN_PHONE_NUMBER || "+60183570581";
    const locations = await getLocations();

    return (
        <div className="min-h-screen bg-slate-50/50 pt-20 pb-16 md:pt-32 md:pb-24">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                        {t('headline')}
                    </h1>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        {t('intro')}
                    </p>
                    <div className="w-16 h-1.5 bg-primary mx-auto mt-8 rounded-full" />
                </div>

                {/* Interactive Location Section */}
                <LocationSection locations={locations} adminPhone={adminPhone} />

                {/* Contact Form Section */}
                <div className="mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('sendMessage')}</h2>
                        <p className="text-slate-500">{t('formIntro')}</p>
                    </div>
                    
                    <div className="max-w-4xl mx-auto">
                        <Card className="border-none shadow-sm bg-white overflow-hidden">
                            <CardContent className="p-8 md:p-12">
                                <ContactForm />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
