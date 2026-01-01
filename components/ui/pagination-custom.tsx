"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
}

export const Pagination = ({ totalPages, currentPage }: PaginationProps) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const getPageNumbers = () => {
        const pages = [];
        const showEllipsis = totalPages > 7;

        if (!showEllipsis) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <nav className="flex items-center justify-center gap-2 py-12">
            {/* Previous Button */}
            <Link
                href={createPageURL(currentPage - 1)}
                className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl border border-gray-100 bg-white text-gray-600 transition-all hover:border-primary hover:text-primary active:scale-95",
                    currentPage <= 1 && "pointer-events-none opacity-40"
                )}
            >
                <ChevronLeft size={20} />
            </Link>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
                {getPageNumbers().map((page, index) => {
                    const isEllipsis = page === '...';
                    const isActive = page === currentPage;

                    if (isEllipsis) {
                        return (
                            <div key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-gray-400">
                                <MoreHorizontal size={16} />
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={`page-${page}`}
                            href={createPageURL(page)}
                            className={cn(
                                "relative flex items-center justify-center w-10 h-10 rounded-xl border font-bold text-sm transition-all active:scale-95 overflow-hidden",
                                isActive 
                                    ? "border-primary bg-primary text-white shadow-lg shadow-primary/20" 
                                    : "border-gray-100 bg-white text-gray-600 hover:border-primary/40 hover:text-primary"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="pagination-active"
                                    className="absolute inset-0 bg-primary"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{page}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Next Button */}
            <Link
                href={createPageURL(currentPage + 1)}
                className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl border border-gray-100 bg-white text-gray-600 transition-all hover:border-primary hover:text-primary active:scale-95",
                    currentPage >= totalPages && "pointer-events-none opacity-40"
                )}
            >
                <ChevronRight size={20} />
            </Link>
        </nav>
    );
};
