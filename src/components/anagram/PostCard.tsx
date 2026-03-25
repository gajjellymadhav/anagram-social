import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

const PostCard = ({ post, onLike, onComment }: PostCardProps) => {
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [animating, setAnimating] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    if (!liked) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 400);
    }
    onLike?.(post.id);
  };

  const handleDoubleClick = () => {
    if (!liked) handleLike();
    else {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 400);
    }
  };

  return (
    <article className="border-b bg-background animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 overflow-hidden rounded-full bg-secondary">
            {post.userAvatar ? (
              <img src={post.userAvatar} alt={post.username} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
                {post.username[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-sm font-semibold">{post.username}</span>
        </div>
        <button className="text-foreground transition-colors hover:text-muted-foreground">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Image */}
      <div className="relative aspect-square w-full bg-secondary" onDoubleClick={handleDoubleClick}>
        <img src={post.imageUrl} alt="Post" className="h-full w-full object-cover" loading="lazy" />
        {animating && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Heart size={80} className="animate-heart-pop fill-accent text-accent drop-shadow-lg" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className="transition-transform active:scale-90">
            <Heart
              size={24}
              className={`transition-colors ${liked ? "fill-accent text-accent" : "text-foreground hover:text-muted-foreground"}`}
            />
          </button>
          <button onClick={() => onComment?.(post.id)} className="transition-transform active:scale-90">
            <MessageCircle size={24} className="text-foreground hover:text-muted-foreground transition-colors" />
          </button>
          <button className="transition-transform active:scale-90">
            <Send size={22} className="text-foreground hover:text-muted-foreground transition-colors" />
          </button>
        </div>
        <button onClick={() => setSaved(!saved)} className="transition-transform active:scale-90">
          <Bookmark
            size={24}
            className={`transition-colors ${saved ? "fill-foreground text-foreground" : "text-foreground hover:text-muted-foreground"}`}
          />
        </button>
      </div>

      {/* Likes & Caption */}
      <div className="px-4 pb-4 space-y-1">
        <p className="text-sm font-semibold">{likesCount.toLocaleString()} likes</p>
        {post.caption && (
          <p className="text-sm">
            <span className="font-semibold">{post.username}</span>{" "}
            <span>{post.caption}</span>
          </p>
        )}
        {post.commentsCount > 0 && (
          <button
            onClick={() => onComment?.(post.id)}
            className="text-sm text-muted-foreground"
          >
            View all {post.commentsCount} comments
          </button>
        )}
        <p className="text-[10px] uppercase text-muted-foreground tracking-wide">
          {post.createdAt}
        </p>
      </div>
    </article>
  );
};

export default PostCard;
