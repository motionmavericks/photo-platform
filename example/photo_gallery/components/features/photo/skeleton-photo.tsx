import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function SkeletonPhoto() {
  return (
    <Card className="group relative overflow-hidden cursor-pointer w-full">
      <CardContent className="p-0">
        <div className="relative aspect-square w-full">
          <Skeleton className="absolute inset-0" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="absolute top-2 left-2 h-8 w-8 rounded-full" />
        <Skeleton className="absolute top-2 right-2 h-8 w-8 rounded-full" />
        <Skeleton className="absolute bottom-2 right-2 h-8 w-8 rounded-full" />
      </CardContent>
    </Card>
  )
}

