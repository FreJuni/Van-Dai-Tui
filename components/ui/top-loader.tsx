"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export const TopLoader = () => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const handleStart = () => setIsLoading(true)
        const handleComplete = () => setIsLoading(false)

        // In Next.js App Router, page changes happen on link clicks
        // but we don't have direct access to 'routeChangeStart' events.
        // However, we can simulate it or rely on the fact that
        // the loader will show when we navigate.
        
        // This is a simplified version that shows progress when pathname changes
        handleStart()
        const timer = setTimeout(handleComplete, 400) // Brief animation

        return () => clearTimeout(timer)
    }, [pathname, searchParams])

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ width: "0%", opacity: 1 }}
                    animate={{ width: "100%" }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                        width: { duration: 0.8, ease: "easeInOut" },
                        opacity: { duration: 0.2 }
                    }}
                    className="fixed top-0 left-0 right-0 h-[3px] bg-primary z-9999 shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                />
            )}
        </AnimatePresence>
    )
}
