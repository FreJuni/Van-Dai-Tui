import React from 'react';
import { getTranslations } from 'next-intl/server';
import { ShoppingCart, MessageCircle, Package, CheckCircle, Search, FileText, Wrench, Shield, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@/src/i18n/navigation';

const HowItWorksPage = async () => {
    const t = await getTranslations('HowItWorksPage');

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

                {/* Shopping Guide Section */}
                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-10">
                        <ShoppingCart className="w-8 h-8 text-primary" />
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{t('shoppingGuide')}</h2>
                    </div>

                    <div className="space-y-12">
                        {/* Step 1: Finding Your Perfect Phone */}
                        <Card className="border-none shadow-sm bg-white">
                            <CardContent className="p-8 md:p-10">
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <Search className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 md:mt-2 text-center md:text-left">{t('step1Title')}</h3>
                                </div>
                                <div className="space-y-4 md:ml-16">
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-1">{t('step1Browse')}</h4>
                                        <p className="text-slate-600 leading-relaxed">{t('step1BrowseDesc')}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-1">{t('step1Details')}</h4>
                                        <p className="text-slate-600 leading-relaxed">{t('step1DetailsDesc')}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-1">{t('step1Special')}</h4>
                                        <p className="text-slate-600 leading-relaxed">{t('step1SpecialDesc')}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Step 2: Placing an Order */}
                        <Card className="border-none shadow-sm bg-white">
                            <CardContent className="p-8 md:p-10">
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 md:mt-2 text-center md:text-left">{t('step2Title')}</h3>
                                </div>
                                <div className="space-y-4 md:ml-16">
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-1">{t('step2Cart')}</h4>
                                        <p className="text-slate-600 leading-relaxed">{t('step2CartDesc')}</p>
                                    </div>
                                    <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <MessageCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-green-800 mb-1">{t('step2WhatsApp')}</h4>
                                                <p className="text-green-700 text-sm leading-relaxed">{t('step2WhatsAppDesc')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-1">{t('step2Checkout')}</h4>
                                        <p className="text-slate-600 leading-relaxed">{t('step2CheckoutDesc')}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-1">{t('step2Confirmation')}</h4>
                                        <p className="text-slate-600 leading-relaxed">{t('step2ConfirmationDesc')}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Step 3: Getting Your Phone */}
                        <Card className="border-none shadow-sm bg-white">
                            <CardContent className="p-8 md:p-10">
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <Package className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 md:mt-2 text-center md:text-left">{t('step3Title')}</h3>
                                </div>
                                <div className="space-y-4 md:ml-16">
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-1">{t('step3Delivery')}</h4>
                                        <p className="text-slate-600 leading-relaxed">{t('step3DeliveryDesc')}</p>
                                    </div>
                                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-amber-800 mb-1">{t('step3Trial')}</h4>
                                                <p className="text-amber-700 text-sm leading-relaxed">{t('step3TrialDesc')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Repair Guide Section */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-10">
                        <Wrench className="w-8 h-8 text-primary" />
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{t('repairGuide')}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Repair Step 1 */}
                        <Card className="border-none shadow-sm bg-white">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mt-1.5">{t('repairStep1Title')}</h3>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed ml-13">{t('repairStep1Desc')}</p>
                            </CardContent>
                        </Card>

                        {/* Repair Step 2 */}
                        <Card className="border-none shadow-sm bg-white">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Package className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mt-1.5">{t('repairStep2Title')}</h3>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed ml-13">{t('repairStep2Desc')}</p>
                            </CardContent>
                        </Card>

                        {/* Repair Step 3 */}
                        <Card className="border-none shadow-sm bg-white">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Wrench className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mt-1.5">{t('repairStep3Title')}</h3>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed ml-13">{t('repairStep3Desc')}</p>
                            </CardContent>
                        </Card>

                        {/* Repair Step 4 */}
                        <Card className="border-none shadow-sm bg-white">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mt-1.5">{t('repairStep4Title')}</h3>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed ml-13">{t('repairStep4Desc')}</p>
                            </CardContent>
                        </Card>

                        {/* Repair Step 5 - Full Width */}
                        <Card className="border-none shadow-sm bg-white md:col-span-2">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mt-1.5">{t('repairStep5Title')}</h3>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed ml-13">{t('repairStep5Desc')}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Need Help Section */}
                <Card className="border-none shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
                    <CardContent className="p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
                                <Phone className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{t('needHelp')}</h3>
                        <p className="text-slate-600 mb-6 max-w-2xl mx-auto">{t('contactUs')}</p>
                        <Link href="/contact">
                            <button className="bg-primary cursor-pointer hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
                                {t('contactUs').split('via')[0]}
                            </button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default HowItWorksPage;
