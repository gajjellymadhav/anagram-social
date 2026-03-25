import { useState, useEffect } from "react";
import { api } from "@/services/api";
import type { Post, Story } from "@/types";
import PostCard from "@/components/anagram/PostCard";
import PostSkeleton from "@/components/anagram/PostSkeleton";
import StoryCircle from "@/components/anagram/StoryCircle";
import CommentModal from "@/components/anagram/CommentModal";
import EmptyState from "@/components/anagram/EmptyState";

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingStories, setLoadingStories] = useState(true);
  const [commentPostId, setCommentPostId] = useState<string | null>(null);

  useEffect(() => {
    api.getPosts().then(setPosts).catch(() => {}).finally(() => setLoadingPosts(false));
    api.getStories().then(setStories).catch(() => {}).finally(() => setLoadingStories(false));
  }, []);

  const handleLike = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    if (post.isLiked) api.unlikePost(postId).catch(() => {});
    else api.likePost(postId).catch(() => {});
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isLiked: !p.isLiked, likesCount: p.likesCount + (p.isLiked ? -1 : 1) } : p))
    );
  };

  return (
    <div className="mx-auto max-w-[470px]">
      {/* Stories */}
      <div className="flex gap-4 overflow-x-auto border-b px-4 py-4 scrollbar-hide">
        {loadingStories
          ? Array.from({ length: 6 }).map((_, i) => <StoryCircle key={i} isLoading />)
          : stories.map((s) => (
              <StoryCircle key={s.id} username={s.username} avatarUrl={s.userAvatar} hasUnread={s.hasUnread} />
            ))}
        {!loadingStories && stories.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 w-full text-center">No stories yet</p>
        )}
      </div>

      {/* Feed */}
      <div>
        {loadingPosts ? (
          Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
        ) : posts.length === 0 ? (
          <EmptyState title="Welcome to Anagram" description="Follow people to see their photos and videos here." />
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={handleLike} onComment={setCommentPostId} />
          ))
        )}
      </div>

      <CommentModal postId={commentPostId} onClose={() => setCommentPostId(null)} />
    </div>
  );
};

export default Home;
