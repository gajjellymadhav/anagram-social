import { useState, useEffect } from "react";
import { api } from "@/services/api";
import type { User } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";

interface FollowListModalProps {
  username: string;
  type: "followers" | "following";
  onClose: () => void;
}

const FollowListModal = ({ username, type, onClose }: FollowListModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = type === "followers" ? api.getFollowers : api.getFollowing;
    fetcher(username).then(setUsers).catch(() => {}).finally(() => setLoading(false));
  }, [username, type]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-foreground/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md max-h-[70vh] flex flex-col rounded-t-2xl sm:rounded-2xl bg-background animate-slide-up shadow-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-base font-semibold capitalize">{type}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-3.5 w-28 rounded" />
              </div>
            ))
          ) : users.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {type === "followers" ? "No followers yet." : "Not following anyone."}
            </p>
          ) : (
            users.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-secondary">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
                      {user.username[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{user.username}</p>
                  {user.firstName && <p className="text-xs text-muted-foreground">{user.firstName} {user.lastName}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
