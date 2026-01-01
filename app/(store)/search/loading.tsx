import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className='my-10 mx-6 md:mx-12 max-w-7xl lg:mx-auto'>
      <div className="flex justify-between items-center mb-10">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-11 w-36 rounded-md" />
      </div>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col gap-4 border border-gray-100 rounded-xl p-4">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
            </div>
            <div className="space-y-2 mt-4">
              <Skeleton className="h-4 w-1/3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <Skeleton className="h-10 w-20 rounded-md" />
              <Skeleton className="h-10 w-20 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
