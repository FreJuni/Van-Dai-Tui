"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export const Slider = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <div className="relative flex w-full touch-none select-none items-center group">
    <input
      type="range"
      className={cn(
        "h-1.5 w-full appearance-none rounded-full bg-gray-100 accent-primary cursor-pointer transition-all",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
Slider.displayName = "Slider"
