import { useState, useEffect } from "react";
import { X, Send } from "lucide-react";
import { api } from "@/services/api";
import type { Comment } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface CommentModalProps {
  postId: string | null;
  onClose: () => void;
}

const CommentModal = ({ postId, onClose }: CommentModalProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    api.getComments(postId).then(setComments).catch(() => {}).finally(() => setLoading(false));
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !postId) return;
    setPosting(true);
    try {
      const comment = await api.addComment(postId, text);
      setComments((prev) => [...prev, comment]);
      setText("");
    } catch {
      // handle error
    } finally {
      setPosting(false);
    }
  };

  if (!postId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-foreground/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg max-h-[80vh] flex flex-col rounded-t-2xl sm:rounded-2xl bg-background animate-slide-up shadow-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-base font-semibold">Comments</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="h-3 w-full rounded" />
                </div>
              </div>
            ))
          ) : comments.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No comments yet. Be the first!</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3 animate-fade-in">
                <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-secondary">
                  {c.userAvatar ? (
                    <img src={c.userAvatar} alt={c.username} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
                      {c.username[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-semibold">{c.username}</span>{" "}
                    {c.text}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">{c.createdAt}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t px-4 py-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!text.trim() || posting}
            className="text-accent font-semibold text-sm disabled:opacity-40 transition-opacity"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;
