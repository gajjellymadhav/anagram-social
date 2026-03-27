import { useState, useEffect } from "react";
import { api } from "@/services/api";
import type { Chat, Message } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/anagram/EmptyState";
import { MessageCircle, ArrowLeft, Send } from "lucide-react";

const Messages = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.getChats().then(setChats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const openChat = (chat: Chat) => {
    setActiveChat(chat);
    setLoadingMessages(true);
    api.getChatMessages(chat.id).then(setMessages).catch(() => {}).finally(() => setLoadingMessages(false));
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeChat) return;
    setSending(true);
    try {
      const msg = await api.sendMessage(activeChat.id, text);
      setMessages((prev) => [...prev, msg]);
      setText("");
    } catch {
      // handle error
    } finally {
      setSending(false);
    }
  };

  // Chat detail view
  if (activeChat) {
    return (
      <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-[470px] flex-col lg:h-screen">
        {/* Chat header */}
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <button onClick={() => setActiveChat(null)} className="text-foreground">
            <ArrowLeft size={22} />
          </button>
          <div className="h-8 w-8 overflow-hidden rounded-full bg-secondary">
            {activeChat.user.avatar ? (
              <img src={activeChat.user.avatar} alt={activeChat.user.username} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
                {activeChat.user.username[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-sm font-semibold">{activeChat.user.username}</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loadingMessages ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                <Skeleton className="h-8 w-40 rounded-2xl" />
              </div>
            ))
          ) : messages.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              Say hi to start the conversation!
            </p>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId !== activeChat.user.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                      isMe
                        ? "bg-accent text-accent-foreground rounded-br-sm"
                        : "bg-secondary text-secondary-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex items-center gap-2 border-t px-4 py-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Message..."
            className="flex-1 rounded-full border bg-secondary px-4 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-muted-foreground/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="text-accent font-semibold disabled:opacity-40 transition-opacity"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    );
  }

  // Chat list view
  return (
    <div className="mx-auto max-w-[470px] px-4">
      <h1 className="py-4 text-xl font-semibold">Messages</h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-28 rounded" />
                <Skeleton className="h-3 w-48 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : chats.length === 0 ? (
        <EmptyState
          icon={<MessageCircle size={28} className="text-muted-foreground" />}
          title="Your Messages"
          description="Say hi to your friends to start a chat."
        />
      ) : (
        <div className="space-y-1">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => openChat(chat)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-secondary"
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-secondary">
                {chat.user.avatar ? (
                  <img src={chat.user.avatar} alt={chat.user.username} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-muted-foreground">
                    {chat.user.username[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{chat.user.username}</p>
                <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-muted-foreground">{chat.lastMessageAt}</span>
                {chat.unreadCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;
