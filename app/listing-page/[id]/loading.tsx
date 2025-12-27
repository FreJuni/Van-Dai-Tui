import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col lg:flex-row gap-10 px-4 md:px-10 lg:px-20 mt-10 md:mt-14 justify-center items-center lg:items-start max-w-7xl mx-auto">
      {/* Skeleton for Image Carousel */}
      <div className="w-full lg:w-auto flex flex-col gap-4 items-center">
        <Skeleton className="w-full max-w-[550px] aspect-square rounded-xl" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="w-[80px] h-[70px]" />
          ))}
        </div>
      </div>

      {/* Skeleton for Listing Details */}
      <div className="flex-1 w-full flex flex-col gap-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="flex flex-col gap-2 mt-4">
          <Skeleton className="h-8 w-1/4" />
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-8 h-8 rounded-full" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <Skeleton className="h-8 w-1/4" />
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-16 h-8" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
