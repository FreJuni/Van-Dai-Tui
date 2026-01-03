import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className='max-w-4xl mx-auto py-12 px-6'>
      <div className="flex flex-col md:flex-row gap-12 items-start justify-center">
        {/* Avatar Skeleton */}
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="w-32 h-32 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
        
        {/* Form Skeleton */}
        <div className="flex-1 w-full max-w-md space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <Skeleton className="h-11 w-full rounded-md mt-6" />
        </div>
      </div>
    </div>
  )
}
