"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, Truck, ThumbsUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const TrustSection = () => {
    const t = useTranslations("LandingPage.trust");

    const items = [
        {
            icon: ShieldCheck,
            title: t("warrantyTitle"),
            desc: t("warrantyDesc"),
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            icon: Truck,
            title: t("deliveryTitle"),
            desc: t("deliveryDesc"),
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            icon: ThumbsUp,
            title: t("qualityTitle"),
            desc: t("qualityDesc"),
            color: "text-purple-600",
            bg: "bg-purple-50"
        }
    ];

    return (
        <section className="py-24 bg-white border-b border-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {items.map((item, index) => (
                        <Card key={index} className="p-6 border-none shadow-none hover:shadow-lg transition-all duration-300 bg-transparent flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 group rounded-2xl">
                            <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                <item.icon className={`w-7 h-7 ${item.color}`} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
