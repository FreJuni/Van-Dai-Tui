import React from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, Heart, Users, Sparkles, Wrench, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us',
};

const AboutPage = () => {
    const t = useTranslations('AboutPage');
    const commonT = useTranslations('NavBar');

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full -z-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl -ml-48 -mb-48" />
                </div>
                
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-semibold mb-6">
                        <Heart className="w-4 h-4 fill-primary" />
                        <span>Founded in 2025</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tight">
                        {t('headline')}
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                        {t('welcome', { projectName: commonT('projectName') })}
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="max-w-4xl mx-auto px-6 pb-24">
                <div className="space-y-12">
                    <div className="prose prose-slate max-w-none">
                        <p className="text-lg text-slate-700 leading-relaxed mb-6">
                            {t('intro')}
                        </p>
                        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm mb-8">
                            <p className="text-lg text-slate-700 leading-relaxed italic">
                                "{t('mission')}"
                            </p>
                        </div>
                    </div>

                    {/* Why Us Grid */}
                    <div className="pt-12">
                        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">{t('whyShopWithUs')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="border-none shadow-sm bg-white">
                                <CardContent className="p-8 text-center">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <Eye className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-3">{t('expertlyVetted')}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {t('expertlyVettedDesc')}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm bg-white">
                                <CardContent className="p-8 text-center">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <Wrench className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-3">{t('technicalSupport')}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {t('technicalSupportDesc')}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm bg-white">
                                <CardContent className="p-8 text-center">
                                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-3">{t('honestyFirst')}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {t('honestyFirstDesc')}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Community Section */}
                    <div className="relative mt-20 p-10 md:p-16 bg-slate-900 rounded-[3rem] text-center overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <Users className="w-64 h-64 -translate-y-12 -translate-x-12" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 relative z-10">
                            {t('closing', { projectName: commonT('projectName') })}
                        </h2>
                        <div className="relative z-10 flex justify-center">
                            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
