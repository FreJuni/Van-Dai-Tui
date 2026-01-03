"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from '@/src/i18n/navigation';
import { Button } from "./button";
import { cn } from "@/lib/utils";

type BackButtonProps = {
    className?: string;
    label?: string;
};

export const BackButton = ({ className, label = "Back" }: BackButtonProps) => {
    const router = useRouter();

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className={cn(
                "group flex items-center gap-1 px-2 py-1 text-gray-500 hover:text-primary transition-colors cursor-pointer",
                className
            )}
        >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">{label}</span>
        </Button>
    );
};
