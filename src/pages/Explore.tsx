import { useState, useEffect } from "react";
import { api } from "@/services/api";
import type { Post } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/anagram/EmptyState";
import { Compass } from "lucide-react";

const Explore = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getExplorePosts().then(setPosts).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-[935px] px-1">
      {/* Search - mobile only shows via navbar, desktop inline */}
      <div className="hidden lg:block py-4 px-3">
        <input
          type="text"
          placeholder="Search"
          className="w-full rounded-lg bg-secondary px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-none" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={<Compass size={28} className="text-muted-foreground" />}
          title="Explore"
          description="Discover new photos and videos."
        />
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {posts.map((post) => (
            <button key={post.id} className="group relative aspect-square overflow-hidden">
              <img src={post.imageUrl} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/20 group-hover:opacity-100">
                <span className="text-sm font-semibold text-background">♥ {post.likesCount}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
