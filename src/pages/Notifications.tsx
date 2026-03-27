import { useState, useEffect } from "react";
import { api } from "@/services/api";
import type { Notification } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/anagram/EmptyState";
import { Heart, Bell } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNotifications().then(setNotifications).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "like":
        return <Heart size={14} className="fill-accent text-accent" />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-[470px] px-4">
      <h1 className="py-4 text-xl font-semibold">Notifications</h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-3/4 rounded" />
                <Skeleton className="h-2.5 w-1/4 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<Bell size={28} className="text-muted-foreground" />}
          title="No New Notifications"
          description="When someone likes or comments on your posts, you'll see it here."
        />
      ) : (
        <div className="space-y-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-colors ${
                !n.isRead ? "bg-accent/5" : ""
              }`}
            >
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-secondary">
                {n.fromUser.avatar ? (
                  <img src={n.fromUser.avatar} alt={n.fromUser.username} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
                    {n.fromUser.username[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">{n.fromUser.username}</span>{" "}
                  {n.message}
                </p>
                <p className="text-xs text-muted-foreground">{n.createdAt}</p>
              </div>
              <div className="flex items-center gap-2">
                {getIcon(n.type)}
                {n.postImage && (
                  <div className="h-10 w-10 overflow-hidden rounded bg-secondary">
                    <img src={n.postImage} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
                {n.type === "follow_request" && (
                  <button className="rounded-lg bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    Confirm
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
