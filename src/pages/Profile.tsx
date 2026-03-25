import { useState, useEffect } from "react";
import { api } from "@/services/api";
import type { User, Post } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/anagram/EmptyState";
import { Grid3X3, Settings, Camera } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    api.getUserProfile("me").then(setUser).catch(() => {}).finally(() => setLoadingUser(false));
    api.getUserPosts("me").then(setPosts).catch(() => {}).finally(() => setLoadingPosts(false));
  }, []);

  return (
    <div className="mx-auto max-w-[935px] px-4">
      {/* Profile header */}
      <div className="flex gap-6 py-8 sm:gap-12">
        <div className="shrink-0">
          {loadingUser ? (
            <Skeleton className="h-20 w-20 rounded-full sm:h-36 sm:w-36" />
          ) : (
            <div className="h-20 w-20 overflow-hidden rounded-full bg-secondary sm:h-36 sm:w-36">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-muted-foreground sm:text-4xl">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {loadingUser ? (
              <Skeleton className="h-6 w-32 rounded" />
            ) : (
              <>
                <h1 className="text-xl font-normal">{user?.username}</h1>
                <button className="rounded-lg bg-secondary px-4 py-1.5 text-sm font-semibold transition-colors hover:bg-border">
                  Edit profile
                </button>
                <button className="text-foreground">
                  <Settings size={22} />
                </button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="hidden sm:flex gap-8">
            {loadingUser
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-4 w-20 rounded" />)
              : (
                <>
                  <span className="text-sm"><strong>{user?.postsCount ?? 0}</strong> posts</span>
                  <span className="text-sm"><strong>{user?.followersCount ?? 0}</strong> followers</span>
                  <span className="text-sm"><strong>{user?.followingCount ?? 0}</strong> following</span>
                </>
              )}
          </div>

          {!loadingUser && user?.bio && <p className="text-sm">{user.bio}</p>}
        </div>
      </div>

      {/* Mobile stats */}
      <div className="flex justify-around border-y py-3 sm:hidden">
        {loadingUser ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8 w-16 rounded" />)
        ) : (
          <>
            <div className="text-center">
              <p className="font-semibold text-sm">{user?.postsCount ?? 0}</p>
              <p className="text-xs text-muted-foreground">posts</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm">{user?.followersCount ?? 0}</p>
              <p className="text-xs text-muted-foreground">followers</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm">{user?.followingCount ?? 0}</p>
              <p className="text-xs text-muted-foreground">following</p>
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-t">
        <button className="flex items-center gap-1.5 border-t border-foreground px-4 py-3 text-xs font-semibold uppercase tracking-wider">
          <Grid3X3 size={12} /> Posts
        </button>
      </div>

      {/* Posts grid */}
      {loadingPosts ? (
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-none" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={<Camera size={28} className="text-muted-foreground" />}
          title="Share Photos"
          description="When you share photos, they will appear on your profile."
        />
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {posts.map((post) => (
            <button key={post.id} className="group relative aspect-square overflow-hidden">
              <img src={post.imageUrl} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
