"use client";


import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ArrowRight, Smartphone, Laptop, Tablet, Cpu, Settings, Sparkles, Search } from 'lucide-react';
import { Link, useRouter } from '@/src/i18n/navigation';
import LandingPageImage from '@/public/images/Gemini_Generated_Image_97rh8b97rh8b97rh.png';

export const Hero = () => {
    const t = useTranslations("LandingPage");

    return (
        <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-zinc-950">
            {/* Background Aesthetic */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 py-20">
                <div className="text-center lg:text-left space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wider uppercase">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        New Collection 2024
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
                        {t("heroTitle")}
                    </h1>
                    
                    <p className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0">
                        {t("heroSubtitle")}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <Link href="/search">
                            <Button size="lg" className="h-14 px-8 text-base font-bold gap-2 rounded-2xl group shadow-lg shadow-primary/25 cursor-pointer">
                                {t("shopNow")}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Button 
                            variant="outline" 
                            size="lg" 
                            onClick={() => {
                                const aiBtn = document.querySelector('button.fixed.bottom-6.right-6') as HTMLButtonElement;
                                if (aiBtn) aiBtn.click();
                            }}
                            className="h-14 px-8 text-base font-bold bg-white/5 border-zinc-800 text-white hover:bg-white/10 hover:text-white rounded-2xl cursor-pointer gap-2"
                        >
                            <Sparkles className="w-5 h-5 text-primary" />
                            {t("askVoltAI")}
                        </Button>
                    </div>

                    {/* Integrated AI Search Box */}
                    <div className="relative group max-w-md mx-auto lg:mx-0">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center bg-zinc-900 border border-white/10 rounded-2xl p-2 pl-4">
                            <Search className="w-5 h-5 text-zinc-500" />
                            <input 
                                type="text" 
                                placeholder="I have 2000RM, find me a phone..." 
                                className="bg-transparent border-none focus:ring-0 text-white text-sm flex-1 px-3 outline-none"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const aiBtn = document.querySelector('button.fixed.bottom-6.right-6') as HTMLButtonElement;
                                        if (aiBtn) aiBtn.click();
                                    }
                                }}
                            />
                            <Button 
                                size="sm" 
                                onClick={() => {
                                    const aiBtn = document.querySelector('button.fixed.bottom-6.right-6') as HTMLButtonElement;
                                    if (aiBtn) aiBtn.click();
                                }}
                                className="rounded-xl h-10 px-4 font-bold bg-primary hover:bg-primary/90 cursor-pointer"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                {t("smartSearch")}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="relative aspect-square flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] opacity-50" />
                    <div className="relative w-full h-full max-w-lg lg:max-w-none">
                        <Image 
                            src={LandingPageImage} 
                            alt="Premium Smartphone" 
                            fill
                            className="object-contain drop-shadow-[0_0_50px_rgba(var(--primary),0.3)] animate-float"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export const Categories = () => {
    const t = useTranslations("LandingPage");
    
    const categories = [
        { name: "Phones", icon: Smartphone, color: "bg-blue-500", href: "/search?category=Phones" },
        // { name: "Tablets", icon: Tablet, color: "bg-purple-500", href: "/search?category=Tablets" },
        // { name: "Accessories", icon: Cpu, color: "bg-orange-500", href: "/search?category=Accessories" },
        { name: "Laptops", icon: Laptop, color: "bg-emerald-500", href: "/search?category=Laptops" },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-12">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900">
                        {t("featuredCategories")}
                    </h2>
                    <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8">
                    {categories.map((cat) => (
                        <Link 
                            key={cat.name} 
                            href={cat.href}
                            className="group flex flex-col items-center p-8 rounded-3xl bg-zinc-50 border border-zinc-100 hover:bg-white hover:shadow-2xl hover:shadow-zinc-200 transition-all duration-300"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                                <cat.icon className="w-8 h-8" />
                            </div>
                            <span className="font-bold text-zinc-900 group-hover:text-primary transition-colors">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
