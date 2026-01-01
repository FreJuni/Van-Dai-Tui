import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className='max-w-md mx-auto py-12 px-6'>
      <div className="space-y-8">
        <Skeleton className="h-8 w-48 mb-6" />
        
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          
          <Skeleton className="h-11 w-full rounded-md mt-8" />
        </div>
      </div>
    </div>
  )
}
