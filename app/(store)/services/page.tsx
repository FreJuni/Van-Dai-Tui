import { 
    Smartphone, 
    Battery, 
    Wrench, 
    ShieldCheck, 
    Zap, 
    Shield, 
    Clock, 
    MessageSquare,
    ArrowRight,
    MonitorSmartphone,
    Activity,
    MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

const services = [
    {
        title: "Screen Replacement",
        description: "Cracked or bleeding display? We use premium OEM-grade screens to restore your device's visual clarity and touch responsiveness.",
        icon: MonitorSmartphone,
        color: "from-blue-500/20 to-blue-600/20",
        iconColor: "text-blue-600",
        features: ["Genuine Display Panels", "30-Min Rapid Service", "TrueTone Restoration"]
    },
    {
        title: "Battery Replacement",
        description: "Is your battery draining too fast or swelling? Get a high-capacity replacement with optimized power management logic.",
        icon: Battery,
        color: "from-amber-500/20 to-amber-600/20",
        iconColor: "text-amber-600",
        features: ["Health 100% Guaranteed", "Safe Disposal", "Overcharge Protection"]
    },
    {
        title: "Advanced Maintenance",
        description: "Deep internal cleaning, port restoration, and performance optimization to expand your device's lifespan.",
        icon: Wrench,
        color: "from-emerald-500/20 to-emerald-600/20",
        iconColor: "text-emerald-600",
        features: ["Internal Dust Removal", "Charging Port Cleaning", "Thermal Management"]
    },
    {
        title: "Full Diagnostics",
        description: "Not sure what's wrong? Our expert technicians provide comprehensive hardware and software health checks.",
        icon: Activity,
        color: "from-purple-500/20 to-purple-600/20",
        iconColor: "text-purple-600",
        features: ["Logic Board Check", "Water Damage Probing", "Software Optimization"]
    },
    {
        title: "On-Site Repair",
        description: "Can't come to us? We'll bring the expert to you. Experience professional repairs at your home, office, or preferred location.",
        icon: MapPin,
        color: "from-rose-500/20 to-rose-600/20",
        iconColor: "text-rose-600",
        features: ["Home & Office Visit", "Same-Day Appointment", "Secure On-Site Service"]
    }
];

const stats = [
    { label: "Repairs Done", value: "5,000+", icon: ShieldCheck },
    { label: "Avg. Wait Time", value: "45 Min", icon: Clock },
    { label: "Warranty Period", value: "6 Months", icon: Shield },
];

const ServicesPage = async () => {
    const t = await getTranslations('Services');

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
                <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
                    <div className="absolute top-1/2 -right-24 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl opacity-30" />
                </div>
                
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-semibold mb-6">
                        <Zap className="w-4 h-4 fill-primary" />
                        <span>{t('professionalHardwareServices')}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
                        {t('restoreYourDeviceToPerfection')}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        {t('expertRepairsForSmartphonesTabletsAndLaptops')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="rounded-full px-8 h-14 text-lg shadow-lg hover:shadow-xl transition-all gap-2">
                           <MessageSquare className="w-5 h-5" />
                           {t('consultRepairNow')}
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg bg-white/50 backdrop-blur-sm">
                            {t('viewPricing')}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="max-w-7xl mx-auto px-6 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex items-center gap-4 justify-center md:justify-start">
                            <div className="p-3 rounded-2xl bg-slate-50 text-slate-600">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Services Grid */}
            <section className="max-w-7xl mx-auto px-6 mb-24">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div className="text-left max-w-xl">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('ourCoreSpecialities')}</h2>
                        <p className="text-slate-600 leading-relaxed">
                            {t('fromMinorFixesToMajorHardwareOverhaulsOurCertifiedTechniciansEnsureEveryRepairMeetsStrictQualityStandardsBeforeItLeavesOurLab')}
                        </p>
                    </div>
                    <div className="hidden lg:block">
                        <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-xl">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">{t('certifiedTechs')}</div>
                                <div className="text-xs text-slate-500">{t('100QualityAssurance')}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service, i) => (
                        <Card key={i} className="group border-none shadow-none bg-transparent overflow-hidden">
                            <CardContent className="p-0">
                                <div className={cn(
                                    "relative h-full p-8 rounded-[2.5rem] bg-linear-to-br border border-white transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/40",
                                    service.color
                                )}>
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className={cn(
                                            "w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl bg-white shadow-sm transition-transform group-hover:scale-110 duration-300",
                                            service.iconColor
                                        )}>
                                            <service.icon className="w-8 h-8" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.title}</h3>
                                            <p className="text-slate-600 mb-6 leading-relaxed">
                                                {service.description}
                                            </p>
                                            <ul className="space-y-3 mb-8">
                                                {service.features.map((feature, j) => (
                                                    <li key={j} className="flex items-center gap-2 text-slate-700 font-medium">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                            <Button variant="ghost" className="p-0 h-auto hover:bg-transparent text-primary font-bold gap-2 group/btn">
                                                {t('learnDetailProcess')}
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-6 pb-24">
                <div className="relative rounded-[3rem] bg-primary overflow-hidden p-10 md:p-20 text-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full -ml-32 -mb-32 blur-3xl" />
                    
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t('needACustomQuote')}</h2>
                    <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-10 leading-relaxed font-medium">
                        {t('chatWithOurHardwareExpertsTodayForAPreciseEstimateOnYourDeviceRepair')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="secondary" size="lg" className="rounded-full px-10 h-14 text-lg font-bold">
                            {t('whatsappUs')}
                        </Button>
                        <Button variant="ghost" size="lg" className="rounded-full px-10 h-14 text-lg text-white hover:bg-white/10 font-bold border border-white/20">
                            {t('checkFAQ')}
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}


export default ServicesPage;