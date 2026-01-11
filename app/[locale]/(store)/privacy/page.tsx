import React from 'react';
import { useTranslations } from 'next-intl';
import { Shield, FileText, Lock, Users, ArrowRight, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how we collect, use, and protect your personal information at VANDAITUI.",
};

const PrivacyPolicyPage = () => {
    const t = useTranslations('PrivacyPage');

    return (
        <div className="min-h-screen bg-slate-50/50 pt-20 pb-16 md:pt-32 md:pb-24">
            <div className="max-w-3xl mx-auto px-6">
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

                <div className="space-y-10">
                    {/* Intro */}
                    <p className="text-slate-600 leading-relaxed text-lg">
                        {t('intro')}
                    </p>

                    {/* Section 1: Info Collection */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">{t('section1Title')}</h2>
                        </div>
                        <div className="pl-12 space-y-4">
                            <p className="text-slate-600">{t('section1Content')}</p>
                            <ul className="space-y-3">
                                {[1, 2].map((i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-600">
                                        <ArrowRight className="w-4 h-4 mt-1 text-primary shrink-0" />
                                        <span>{t(`section1Point${i}`)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Section 2: Data Security */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                <Lock className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">{t('section2Title')}</h2>
                        </div>
                        <div className="pl-12 space-y-4">
                            <p className="text-slate-600">{t('section2Content')}</p>
                            <Card className="border-none shadow-sm bg-white overflow-hidden">
                                <CardContent className="p-6 space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                                            <Shield className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                                            <span>{t(`section2Point${i}`)}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Section 3: Data Sharing */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                                <Users className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">{t('section3Title')}</h2>
                        </div>
                        <div className="pl-12 space-y-4">
                            <p className="text-slate-600 font-semibold text-slate-800">{t('section3Content')}</p>
                            <ul className="space-y-3">
                                {[1, 2].map((i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                                        <span>{t(`section3Point${i}`)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Section 4: Your Rights */}
                    <section className="space-y-4 pt-10 border-t border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900">{t('section4Title')}</h2>
                        <p className="text-slate-600 leading-relaxed">
                            {t('section4Content')}
                        </p>
                    </section>

                    {/* Compliance Note */}
                    <div className="p-6 bg-slate-900 rounded-2xl text-slate-400 text-xs flex items-start gap-3">
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        <p className="italic">{t('compliance')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
