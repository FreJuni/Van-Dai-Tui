"use client";

import { Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const ProductSearchInput = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [searchValue, setSearchValue] = useState(searchParams.get('q')?.toString() || '');

    const handleSearchProduct = async (param : string) => {
        const params = new URLSearchParams();
        params.set('page', '1');
       if(param) {
        params.set('q', param);
       } else {
        params.delete('q');
       }
       replace(`${pathname}?${params.toString()}`);
    }

    useEffect(() => {
        setTimeout(() => {
            handleSearchProduct(searchValue);
        }, 500)
    }, [searchValue])

    const handleClear = () => {
        setSearchValue('');
        handleSearchProduct('');
    };

  return (
    <div className="relative w-full md:w-96">
            <Search
                className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                size={18}
            />
            <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search products by title or description..."
                className="focus:ring-primary/20 h-12 rounded-2xl border-gray-100 bg-white pl-10 pr-10 font-medium transition-all"
            />
            {searchValue && (
                <button 
                    onClick={handleClear}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={16} />
                </button>
            )}
        </div>
  )
}

export default ProductSearchInput