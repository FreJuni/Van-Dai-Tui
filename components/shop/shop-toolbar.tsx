"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { LayoutGrid, List, AlignJustify, ChevronDown } from 'lucide-react';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ShopToolbarProps {
    count: number;
}

export const ShopToolbar = ({ count }: ShopToolbarProps) => {
    const t = useTranslations('Shop');

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8">
            <div className="flex items-center gap-2">
                <button className="p-2.5 bg-primary text-white rounded-lg shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                    <LayoutGrid size={18} />
                </button>
                <button className="p-2.5 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-100 transition-all">
                    <List size={18} />
                </button>
                <button className="p-2.5 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-100 transition-all">
                    <AlignJustify size={18} />
                </button>
            </div>

            <div className="flex-1 text-sm font-medium text-gray-400 text-center sm:text-left sm:ml-4">
                {t('productsCount', { count })}
            </div>

            <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-900 whitespace-nowrap">{t('sortBy')}:</span>
                <Select defaultValue="relevance">
                    <SelectTrigger className="w-[180px] h-10 bg-gray-50 border-gray-200 rounded-xl font-semibold text-gray-600 focus:ring-primary/20">
                        <SelectValue placeholder={t('sortBy')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                        <SelectItem value="relevance" className="focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer">{t('relevance')}</SelectItem>
                        <SelectItem value="price-low" className="focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer">{t('priceLowHigh')}</SelectItem>
                        <SelectItem value="price-high" className="focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer">{t('priceHighLow')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
