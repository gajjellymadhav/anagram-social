import { useState, useEffect } from "react";
import { api } from "@/services/api";
import type { User, Post } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/anagram/EmptyState";

import FollowListModal from "@/components/anagram/FollowListModal";
import ProfilePhotoMenu from "@/components/anagram/ProfilePhotoMenu";
import { Grid3X3, Camera, Lock, Globe, Trash2 } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  
  const [followListType, setFollowListType] = useState<"followers" | "following" | null>(null);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [privacyLoading, setPrivacyLoading] = useState(false);

  useEffect(() => {
    api.getUserProfile("me").then(setUser).catch(() => {}).finally(() => setLoadingUser(false));
    api.getUserPosts("me").then(setPosts).catch(() => {}).finally(() => setLoadingPosts(false));
  }, []);

  const handleTogglePrivacy = async () => {
    if (!user) return;
    setPrivacyLoading(true);
    try {
      await api.togglePrivacy(!user.isPrivate);
      setUser({ ...user, isPrivate: !user.isPrivate });
    } catch {
      // handle error
    } finally {
      setPrivacyLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await api.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      // handle error
    }
  };

  return (
    <div className="mx-auto max-w-[935px] px-4">
      {/* Profile header */}
      <div className="flex gap-6 py-8 sm:gap-12">
        <div className="shrink-0">
          {loadingUser ? (
            <Skeleton className="h-20 w-20 rounded-full sm:h-36 sm:w-36" />
          ) : (
            <button onClick={() => setShowPhotoMenu(true)} className="group relative">
              <div className="h-20 w-20 overflow-hidden rounded-full bg-secondary sm:h-36 sm:w-36">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-muted-foreground sm:text-4xl">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/20 group-hover:opacity-100">
                <Camera size={20} className="text-background" />
              </div>
            </button>
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
                <button
                  onClick={handleTogglePrivacy}
                  disabled={privacyLoading}
                  className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-sm transition-colors hover:bg-border disabled:opacity-50"
                  title={user?.isPrivate ? "Switch to Public" : "Switch to Private"}
                >
                  {user?.isPrivate ? <Lock size={14} /> : <Globe size={14} />}
                  <span className="text-xs font-medium">{user?.isPrivate ? "Private" : "Public"}</span>
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
                  <button onClick={() => setFollowListType("followers")} className="text-sm hover:underline">
                    <strong>{user?.followersCount ?? 0}</strong> followers
                  </button>
                  <button onClick={() => setFollowListType("following")} className="text-sm hover:underline">
                    <strong>{user?.followingCount ?? 0}</strong> following
                  </button>
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
            <button onClick={() => setFollowListType("followers")} className="text-center">
              <p className="font-semibold text-sm">{user?.followersCount ?? 0}</p>
              <p className="text-xs text-muted-foreground">followers</p>
            </button>
            <button onClick={() => setFollowListType("following")} className="text-center">
              <p className="font-semibold text-sm">{user?.followingCount ?? 0}</p>
              <p className="text-xs text-muted-foreground">following</p>
            </button>
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
            <div key={post.id} className="group relative aspect-square overflow-hidden">
              <img src={post.imageUrl} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 flex items-center justify-center gap-3 bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/20 group-hover:opacity-100">
                <span className="text-sm font-semibold text-background">♥ {post.likesCount}</span>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="rounded-full bg-background/80 p-1.5 text-destructive transition-colors hover:bg-background"
                  title="Delete post"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      
      {followListType && user && (
        <FollowListModal username={user.username} type={followListType} onClose={() => setFollowListType(null)} />
      )}
      <ProfilePhotoMenu
        open={showPhotoMenu}
        onClose={() => setShowPhotoMenu(false)}
        onUpdated={(avatar) => user && setUser({ ...user, avatar })}
      />
    </div>
  );
};

export default Profile;
