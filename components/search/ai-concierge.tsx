"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, Loader2, Search, Smartphone, Laptop, Tablet, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateSearchText } from '@/server/actions/gemini/generate-search-text';
import { priceFormatter } from '@/helper/priceFormatter';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link, useRouter } from '@/src/i18n/navigation';
import { useTranslations } from 'next-intl';

export const AIConcierge = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const t = useTranslations('Search');

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setResponse(null);
        try {
            const result = await generateSearchText(query);
            setResponse(result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [response, isLoading]);

    console.log(response);
    

    return (
        <>
            {/* Floating Assistant Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 cursor-pointer right-8 z-100 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 group overflow-hidden"
            >
                <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Sparkles className="text-white w-7 h-7 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                </div>
            </motion.button>

            {/* Concierge Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-101 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-zinc-950 w-full max-w-2xl h-[80vh] rounded-[32px] border border-white/10 shadow-2xl flex flex-col overflow-hidden relative"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                                        <Bot className="text-primary w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg text-balance">
                                            {t('voltAssistant')}
                                        </h3>
                                        <p className="text-zinc-500 text-sm flex items-center gap-1.5">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                            {t('aiPoweredTechConcierge')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 cursor-pointer"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div 
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar scroll-smooth"
                            >
                                <>
                                    {!response && !isLoading && (
                                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-80">
                                            <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center border border-white/5">
                                                <Sparkles className="text-primary w-10 h-10" />
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-white font-bold text-2xl tracking-tight">{t('howCanIHelpYouToday')}</h4>
                                                <p className="text-zinc-400 max-w-xs mx-auto">
                                                    {t('trySomethingLike')} {t('iHave2000RMAndLookingForPhone')} {t('or')} {t('myScreenIsBroken')}
                                                </p>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                                                {[
                                                    { text: "Best phone under 1500RM", icon: Smartphone },
                                                    { text: "Need a laptop for work", icon: Laptop },
                                                    { text: "My device needs repair", icon: Wrench }
                                                ].map((suggest) => (
                                                    <button 
                                                        key={suggest.text}
                                                        onClick={() => {
                                                            setQuery(suggest.text);
                                                            handleSearch();
                                                        }}
                                                        className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-white/5 rounded-2xl text-zinc-300 text-sm font-medium hover:bg-zinc-800 hover:border-white/10 hover:text-white transition-all text-left"
                                                    >
                                                        <suggest.icon className="w-5 h-5 text-primary opacity-70" />
                                                        {suggest.text}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {isLoading && (
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                                                <Bot className="text-primary w-6 h-6 animate-pulse" />
                                            </div>
                                            <div className="bg-zinc-900 border border-white/5 rounded-[22px] p-5 space-y-4 max-w-[85%]">
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                                    <span className="text-zinc-500 text-xs font-bold tracking-widest uppercase">
                                                        {t('analyzingInventory')}
                                                    </span>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="w-48 h-3 bg-white/5 rounded-full animate-pulse" />
                                                    <div className="w-32 h-3 bg-white/5 rounded-full animate-pulse" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {response && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="flex justify-end">
                                                <div className="bg-primary text-white rounded-t-[22px] rounded-bl-[22px] p-4 max-w-[85%] font-medium shadow-lg shadow-primary/20">
                                                    {query}
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shrink-0 border border-primary/20">
                                                    <Bot className="text-primary w-6 h-6" />
                                                </div>
                                                <div className="space-y-6 flex-1">
                                                    <div className="bg-zinc-900/50 border border-white/5 rounded-[22px] p-5 text-zinc-300 leading-relaxed">
                                                        {response.message}
                                                    </div>

                                                    {response.items?.length > 0 && (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            {response.items.map((item: any) => {
                                                                const urlParams = new URLSearchParams();
                                                                if (item.urlParams) {
                                                                    Object.entries(item.urlParams).forEach(([key, value]) => {
                                                                        urlParams.append(key, String(value));
                                                                    });
                                                                }
                                                                const href = item.type === 'service' || item.type === 'repair'
                                                                    ? '/services'
                                                                    : `/listing-page/${item.productId}?${urlParams.toString()}`;

                                                                return (
                                                                    <div 
                                                                        key={item.id}
                                                                        className="group relative bg-zinc-900 border border-white/5 rounded-[24px] p-4 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10"
                                                                    >
                                                                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/40 mb-4 border border-white/5">
                                                                            {item.imageUrl && item.type !== 'service' ? (
                                                                                <Image 
                                                                                    src={item.imageUrl} 
                                                                                    alt={item.name} 
                                                                                    fill 
                                                                                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-500" 
                                                                                />
                                                                            ) : (
                                                                                <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                                                                    {item.type === 'service' || item.type === 'repair' ? <Wrench size={32} /> : <Search size={32} />}
                                                                                </div>
                                                                            )}
                                                                            <Badge className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 text-white font-bold">
                                                                                {item.type.replace('_', ' ')}
                                                                            </Badge>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <h4 className="text-white font-bold text-sm truncate">{item.name}</h4>
                                                                            {item.price > 0 ? (
                                                                                <p className="text-primary font-black text-lg">
                                                                                    {priceFormatter({ price: item.price })}
                                                                                </p>
                                                                            ) : (
                                                                                <p className="text-zinc-500 text-sm font-medium">{t('professionalSupport')}</p>
                                                                            )}
                                                                            <Link 
                                                                                href={href}
                                                                                onClick={() => setIsOpen(false)}
                                                                                className="block w-full"
                                                                            >
                                                                                <Button 
                                                                                    className="w-full rounded-xl bg-white/5 hover:bg-primary transition-all font-bold text-xs h-10 cursor-pointer"
                                                                                >
                                                                                    {item.type === 'service' || item.type === 'repair' ? 'View Services' : 'View Details'}
                                                                                </Button>
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            </div>

                            {/* Input Area */}
                            <div className="p-6 bg-zinc-900/80 backdrop-blur-md border-t border-white/5">
                                <form 
                                    onSubmit={handleSearch}
                                    className="relative flex items-center gap-3"
                                >
                                    <div className="relative flex-1 group">
                                        <Input 
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="Message Volt..."
                                            className="h-16 pl-6 pr-16 bg-zinc-800/50 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-2xl text-white placeholder:text-zinc-500"
                                        />
                                        <div className="absolute left-0 top-0 w-1 h-full bg-primary rounded-l-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                    </div>
                                    <Button 
                                        type="submit"
                                        disabled={isLoading || !query.trim()}
                                        className="h-16 w-16 cursor-pointer rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 shrink-0"
                                    >
                                        <Send size={24} className={cn('cursor-pointer',isLoading ? "animate-pulse" : "")} />
                                    </Button>
                                </form>
                                <p className="mt-3 text-center text-[10px] text-zinc-500 font-medium tracking-wider uppercase">
                                    {t('voltAiCanMakeMistakes')}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
