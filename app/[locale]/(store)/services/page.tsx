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
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Our Services - Repairs & More",
  description: "Professional hardware repair services for smartphones, tablets, and laptops. Screen replacement, battery replacement, and more.",
};

const services = [
  {
    title: 'Screen Replacement',
    description:
      "Cracked or bleeding display? We use premium OEM-grade screens to restore your device's visual clarity and touch responsiveness.",
    icon: MonitorSmartphone,
    color: 'from-blue-500/20 to-blue-600/20',
    iconColor: 'text-blue-600',
    features: [
      'Genuine Display Panels',
      '30-Min Rapid Service',
      'TrueTone Restoration',
    ],
  },
  {
    title: 'Battery Replacement',
    description:
      'Is your battery draining too fast or swelling? Get a high-capacity replacement with optimized power management logic.',
    icon: Battery,
    color: 'from-amber-500/20 to-amber-600/20',
    iconColor: 'text-amber-600',
    features: [
      'Health 100% Guaranteed',
      'Safe Disposal',
      'Overcharge Protection',
    ],
  },
  {
    title: 'Advanced Maintenance',
    description:
      "Deep internal cleaning, port restoration, and performance optimization to expand your device's lifespan.",
    icon: Wrench,
    color: 'from-emerald-500/20 to-emerald-600/20',
    iconColor: 'text-emerald-600',
    features: [
      'Internal Dust Removal',
      'Charging Port Cleaning',
      'Thermal Management',
    ],
  },
  {
    title: 'Full Diagnostics',
    description:
      "Not sure what's wrong? Our expert technicians provide comprehensive hardware and software health checks.",
    icon: Activity,
    color: 'from-purple-500/20 to-purple-600/20',
    iconColor: 'text-purple-600',
    features: [
      'Logic Board Check',
      'Water Damage Probing',
      'Software Optimization',
    ],
  },
  {
    title: 'On-Site Repair',
    description:
      "Can't come to us? We'll bring the expert to you. Experience professional repairs at your home, office, or preferred location.",
    icon: MapPin,
    color: 'from-rose-500/20 to-rose-600/20',
    iconColor: 'text-rose-600',
    features: [
      'Home & Office Visit',
      'Same-Day Appointment',
      'Secure On-Site Service',
    ],
  },
];

const stats = [
  { label: 'Repairs Done', value: '5,000+', icon: ShieldCheck },
  { label: 'Avg. Wait Time', value: '45 Min', icon: Clock },
  { label: 'Warranty Period', value: '6 Months', icon: Shield },
];

const ServicesPage = async () => {
  const t = await getTranslations('Services');

  const WhatsAppNumber = process.env.ADMIN_PHONE_NUMBER! || '60183570581';

  const whatsappUrl = `https://wa.me/${WhatsAppNumber.replace(/[^0-9]/g, '')}`;

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="absolute top-0 left-0 -z-10 h-full w-full overflow-hidden">
          <div className="bg-primary/10 absolute -top-24 -left-24 h-96 w-96 rounded-full opacity-50 blur-3xl" />
          <div className="absolute top-1/2 -right-24 h-64 w-64 rounded-full bg-blue-400/10 opacity-30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="bg-primary/5 border-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold">
            <Zap className="fill-primary h-4 w-4" />
            <span>{t('professionalHardwareServices')}</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
            {t('restoreYourDeviceToPerfection')}
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600">
            {t('expertRepairsForSmartphonesTabletsAndLaptops')}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-14 gap-2 rounded-full px-8 text-lg shadow-lg transition-all hover:shadow-xl"
            >
              <MessageSquare className="h-5 w-5" />
              {t('consultRepairNow')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 rounded-full bg-white/50 px-8 text-lg backdrop-blur-sm"
            >
              {t('viewPricing')}
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="mx-auto mb-20 max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm md:grid-cols-3">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex items-center justify-center gap-4 md:justify-start"
            >
              <div className="rounded-2xl bg-slate-50 p-3 text-slate-600">
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {stat.value}
                </div>
                <div className="text-sm font-medium tracking-wider text-slate-500 uppercase">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="mx-auto mb-24 max-w-7xl px-6">
        <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div className="max-w-xl text-left">
            <h2 className="mb-4 text-3xl font-bold text-slate-900">
              {t('ourCoreSpecialities')}
            </h2>
            <p className="leading-relaxed text-slate-600">
              {t(
                'fromMinorFixesToMajorHardwareOverhaulsOurCertifiedTechniciansEnsureEveryRepairMeetsStrictQualityStandardsBeforeItLeavesOurLab'
              )}
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold text-slate-900">
                  {t('certifiedTechs')}
                </div>
                <div className="text-xs text-slate-500">
                  {t('100QualityAssurance')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {services.map((service, i) => (
            <Card
              key={i}
              className="group overflow-hidden border-none bg-transparent shadow-none"
            >
              <CardContent className="p-0">
                <div
                  className={cn(
                    'group-hover:shadow-primary/40 relative h-full rounded-[2.5rem] border border-white bg-linear-to-br p-8 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl',
                    service.color
                  )}
                >
                  <div className="flex flex-col gap-6 md:flex-row">
                    <div
                      className={cn(
                        'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm transition-transform duration-300 group-hover:scale-110',
                        service.iconColor
                      )}
                    >
                      <service.icon className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-3 text-2xl font-bold text-slate-900">
                        {service.title}
                      </h3>
                      <p className="mb-6 leading-relaxed text-slate-600">
                        {service.description}
                      </p>
                      <ul className="mb-8 space-y-3">
                        {service.features.map((feature, j) => (
                          <li
                            key={j}
                            className="flex items-center gap-2 font-medium text-slate-700"
                          >
                            <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant="ghost"
                        className="text-primary group/btn h-auto gap-2 p-0 font-bold hover:bg-transparent"
                      >
                        {t('learnDetailProcess')}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
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
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="bg-primary relative overflow-hidden rounded-[3rem] p-10 text-center md:p-20">
          <div className="absolute top-0 right-0 -mt-32 -mr-32 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-32 -ml-32 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />

          <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
            {t('needACustomQuote')}
          </h2>
          <p className="text-primary-foreground/80 mx-auto mb-10 max-w-xl text-lg leading-relaxed font-medium">
            {t(
              'chatWithOurHardwareExpertsTodayForAPreciseEstimateOnYourDeviceRepair'
            )}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href={whatsappUrl}
              target="_blank"
              className="h-14 gap-2 rounded-full px-8 text-lg shadow-lg transition-all hover:shadow-xl"
            >
              <Button
                variant="secondary"
                size="lg"
                className="h-14 cursor-pointer rounded-full px-10 text-lg font-bold"
              >
                {t('whatsappUs')}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="lg"
              className="h-14 cursor-pointer rounded-full border border-white/20 px-10 text-lg font-bold hover:text-white! text-white hover:bg-white/10"
            >
              {t('checkFAQ')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
