import React from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, RefreshCcw, Wrench, AlertTriangle, Clock, Shield, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Warranty Policy",
  description: "Understand our warranty terms, return policies, and service agreements for repairs and product purchases.",
};

const WarrantyPolicyPage = () => {
    const t = useTranslations('PolicyPage');

    return (
        <div className="min-h-screen bg-slate-50/50 pt-20 pb-16 md:pt-32 md:pb-24">
            <div className="max-w-4xl mx-auto px-6">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                        {t('title')}
                    </h1>
                    <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
                </div>

                <div className="space-y-12">
                    {/* Return & Exchange Policy */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <RefreshCcw className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">{t('returnExchangeTitle')}</h2>
                        </div>
                        <Card className="border-none shadow-sm bg-white">
                            <CardContent className="p-8">
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                            24h
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900 mb-1">{t('initial24HourWindow')}</h3>
                                            <p className="text-slate-600 leading-relaxed">
                                                {t('returnDescription')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Warranty Terms */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">{t('warrantyTermsTitle')}</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-none shadow-sm bg-white">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Wrench className="w-5 h-5 text-primary" />
                                        {t('manufacturerDefects')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600 leading-relaxed">
                                        {t('manufacturerDefectsDescription')}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm bg-white border-l-4 border-amber-400">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
                                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                                        {t('userInflictedDamage')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-slate-600 font-medium">
                                        {t('userInflictedDamageDescription')}
                                    </p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2 text-slate-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                            {t('freeServiceLabor')}
                                        </li>
                                        <li className="flex items-start gap-2 text-slate-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                            {t('payForParts')}
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Repair & Service Agreement */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <Info className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">{t('repairAgreementTitle')}</h2>
                        </div>
                        <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Wrench className="w-32 h-32" />
                            </div>
                            <CardContent className="p-8 md:p-10 space-y-8 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-primary-foreground font-bold">
                                            <Clock className="w-5 h-5" />
                                            {t('partWarranty')}
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            {t('partWarrantyDescription')}
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-primary-foreground font-bold">
                                            <ShieldCheck className="w-5 h-5" />
                                            {t('inspectionRequired')}
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            {t('inspectionDescription')}
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-8 border-t border-slate-700">
                                    <div className="flex items-center gap-2 text-amber-400 font-bold mb-3">
                                        <AlertTriangle className="w-5 h-5" />
                                        {t('liabilityDisclaimer')}
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed italic">
                                        "{t('liabilityDescription')}"
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>

                <div className="mt-16 p-8 bg-primary/5 rounded-[2rem] border border-primary/10 text-center">
                    <p className="text-slate-600 font-medium">
                        Need more information? Our support team is here to help.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WarrantyPolicyPage;
