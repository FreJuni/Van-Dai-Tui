import React from 'react';
import { useTranslations } from 'next-intl';
import { Shield, ShoppingBag, Wrench, CreditCard, AlertTriangle, UserCheck, ArrowRight, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read our terms and conditions regarding sales, warranty, repairs, and website usage.",
};

const TermsOfServicePage = () => {
    const t = useTranslations('TermsPage');

    return (
        <div className="min-h-screen bg-slate-50/50 pt-20 pb-16 md:pt-32 md:pb-24">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                        {t('title')}
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        {t('lastUpdated')}
                    </p>
                    <div className="w-12 h-1 bg-primary mt-6 rounded-full" />
                </div>

                <div className="space-y-12">
                    {/* Intro */}
                    <p className="text-slate-600 leading-relaxed text-lg italic">
                        {t('intro')}
                    </p>

                    {/* Section 1: Sales & Availability */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">{t('section1Title')}</h2>
                        </div>
                        <div className="pl-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-2">
                                    <h3 className="font-bold text-slate-800 text-sm">{t(`section1_${i}Title`)}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{t(`section1_${i}Content`)}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 2: Warranty & Exchange */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                <Shield className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">{t('section2Title')}</h2>
                        </div>
                        <div className="pl-12 space-y-4">
                            <Card className="border-none shadow-sm bg-white overflow-hidden">
                                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex items-center gap-2 text-primary">
                                                <ArrowRight className="w-4 h-4" />
                                                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">{t(`section2_${i}Title`)}</h3>
                                            </div>
                                            <p className="text-slate-600 text-[13px] leading-relaxed">{t(`section2_${i}Content`)}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Section 3: Repair Policy */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                                <Wrench className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">{t('section3Title')}</h2>
                        </div>
                        <div className="pl-12 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-slate-800 text-sm">{t(`section3_${i}Title`)}</h3>
                                            <p className="text-slate-600 text-sm leading-relaxed">{t(`section3_${i}Content`)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Payments & Cancellations */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">{t('section4Title')}</h2>
                        </div>
                        <div className="pl-12 space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="space-y-1">
                                    <h3 className="font-bold text-slate-800 text-sm">{t(`section4_${i}Title`)}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{t(`section4_${i}Content`)}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 5 & 6: Liability & Conduct */}
                    <div className="pl-12 grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-slate-200">
                        <section className="space-y-4">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5 text-rose-500" />
                                <h2 className="text-xl font-bold text-slate-900">{t('section5Title')}</h2>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {t('section5Content')}
                            </p>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3">
                                <UserCheck className="w-5 h-5 text-indigo-500" />
                                <h2 className="text-xl font-bold text-slate-900">{t('section6Title')}</h2>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {t('section6Content')}
                            </p>
                        </section>
                    </div>

                    {/* Final Note */}
                    <div className="p-6 bg-slate-900 rounded-2xl text-slate-400 text-xs flex items-center gap-3">
                        <Info className="w-4 h-4 shrink-0" />
                        <p className="italic">If you have any questions regarding these terms, please contact VANDAITUI support.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServicePage;
