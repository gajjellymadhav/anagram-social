import { Skeleton } from "@/components/ui/skeleton";

const PostSkeleton = () => (
  <div className="border-b bg-background">
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-3 w-24 rounded" />
    </div>
    <Skeleton className="aspect-square w-full rounded-none" />
    <div className="space-y-2 px-4 py-3">
      <Skeleton className="h-3 w-20 rounded" />
      <Skeleton className="h-3 w-48 rounded" />
      <Skeleton className="h-3 w-32 rounded" />
    </div>
  </div>
);

export default PostSkeleton;
