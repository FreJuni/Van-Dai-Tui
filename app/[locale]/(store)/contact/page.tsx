import React from 'react';
import { getTranslations } from 'next-intl/server';
import { MapPin, Phone, MessageCircle, Clock, Send, Mail, Facebook } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ContactPage = async () => {
    const t = await getTranslations('ContactPage');
    const adminPhone = process.env.ADMIN_PHONE_NUMBER || "+60183570581";

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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-none shadow-sm bg-white">
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-2xl bg-primary/5 text-primary shrink-0">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-bold text-slate-900">{t('visitUs')}</h3>
                                            <p className="text-slate-500 text-sm leading-relaxed">
                                                {t('shopLocation')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-2xl bg-primary/5 text-primary shrink-0">
                                            <Clock className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-bold text-slate-900">{t('operatingHoursTitle')}</h3>
                                            <p className="text-slate-500 text-sm">
                                                {t('operatingHours')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-8 border-t border-slate-100">
                                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">{t('directSupport')}</h3>
                                    <div className="flex flex-col gap-3">
                                        <a 
                                            href={`https://wa.me/${adminPhone}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition-colors font-bold text-sm"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            {t('chatOnWhatsApp')}
                                        </a>
                                        <a 
                                            href="https://www.facebook.com/messages/e2ee/t/10036837059744982" 
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-bold text-sm"
                                        >
                                            <Facebook className="w-5 h-5" />
                                            {t('chatOnMessenger')}
                                        </a>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-none shadow-sm bg-white overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <CardContent className="p-8 md:p-12 space-y-8 md:col-span-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className='mb-2'>
                                                <label className="text-sm font-bold text-slate-700">{t('firstName')}</label>
                                            </div>
                                            <Input placeholder="John" className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className='mb-2'>
                                                <label className="text-sm font-bold text-slate-700">{t('lastName')}</label>
                                            </div>
                                            <Input placeholder="Doe" className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white" />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className='mb-2'>
                                            <label className="text-sm font-bold text-slate-700">{t('email')}</label>
                                        </div>
                                        <Input type="email" placeholder="john@example.com" className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white" />
                                    </div>

                                    <div className="space-y-2">
                                        <div className='mb-2'>
                                            <label className="text-sm font-bold text-slate-700">{t('subject')}</label>
                                        </div>
                                        <Input placeholder="Inquiry about mt-2 repair services" className="h-12 border-slate-100 bg-slate-50/50 focus:bg-white" />
                                    </div>

                                    <div className="space-y-2">
                                        <div className='mb-2'>
                                            <label className="text-sm font-bold text-slate-700">{t('message')}</label>
                                        </div>
                                        <Textarea />
                                    </div>

                                    <Button disabled={true} className="w-full! cursor-pointer md:w-fit h-14 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 transition-all flex items-center gap-3">
                                        {t('sendMessage')}
                                        <Send className="w-5 h-5" />
                                    </Button>
                                </CardContent>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
