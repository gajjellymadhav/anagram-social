import { Skeleton } from "@/components/ui/skeleton";

interface StoryCircleProps {
  username?: string;
  avatarUrl?: string;
  hasUnread?: boolean;
  isLoading?: boolean;
}

const StoryCircle = ({ username, avatarUrl, hasUnread = false, isLoading = false }: StoryCircleProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-1.5">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-2.5 w-10 rounded" />
      </div>
    );
  }

  return (
    <button className="flex flex-col items-center gap-1.5 group">
      <div className={`rounded-full p-[2.5px] ${hasUnread ? "gradient-story" : "bg-border"}`}>
        <div className="rounded-full border-2 border-background p-0.5">
          <div className="h-14 w-14 overflow-hidden rounded-full bg-secondary">
            {avatarUrl ? (
              <img src={avatarUrl} alt={username} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground text-lg font-medium">
                {username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>
      <span className="max-w-[70px] truncate text-xs">{username}</span>
    </button>
  );
};

export default StoryCircle;
