import type { AuthResponse, Post, Comment, User, Story, Notification, Chat, Message, SignupData } from "@/types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("anagram_token");
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Something went wrong" }));
    throw { message: error.message, status: res.status };
  }
  return res.json();
}

export const api = {
  login: (credentials: { email: string; password: string }) =>
    request<AuthResponse>("/login", { method: "POST", body: JSON.stringify(credentials) }),

  loginWithGoogle: (token: string) =>
    request<AuthResponse>("/auth/google", { method: "POST", body: JSON.stringify({ token }) }),

  signup: (data: SignupData) =>
    request<AuthResponse>("/signup", { method: "POST", body: JSON.stringify(data) }),

  verifyOtp: (data: { email: string; otp: string }) =>
    request<{ verified: boolean }>("/verify-otp", { method: "POST", body: JSON.stringify(data) }),

  getPosts: () => request<Post[]>("/posts"),

  getStories: () => request<Story[]>("/stories"),

  getUserProfile: (username: string) => request<User>(`/users/${username}`),

  getUserPosts: (username: string) => request<Post[]>(`/users/${username}/posts`),

  likePost: (postId: string) => request<void>(`/posts/${postId}/like`, { method: "POST" }),

  unlikePost: (postId: string) => request<void>(`/posts/${postId}/unlike`, { method: "POST" }),

  getComments: (postId: string) => request<Comment[]>(`/posts/${postId}/comments`),

  addComment: (postId: string, text: string) =>
    request<Comment>(`/posts/${postId}/comments`, { method: "POST", body: JSON.stringify({ text }) }),

  createPost: (data: { imageUrl: string; caption: string; videoUrl?: string }) =>
    request<Post>("/posts", { method: "POST", body: JSON.stringify(data) }),

  deletePost: (postId: string) => request<void>(`/posts/${postId}`, { method: "DELETE" }),

  searchUsers: (query: string) => request<User[]>(`/users/search?q=${encodeURIComponent(query)}`),

  getFollowers: (username: string) => request<User[]>(`/users/${username}/followers`),

  getFollowing: (username: string) => request<User[]>(`/users/${username}/following`),

  followUser: (userId: string) => request<void>(`/users/${userId}/follow`, { method: "POST" }),

  unfollowUser: (userId: string) => request<void>(`/users/${userId}/unfollow`, { method: "POST" }),

  requestFollow: (userId: string) => request<void>(`/users/${userId}/request-follow`, { method: "POST" }),

  updateProfile: (data: Partial<User>) =>
    request<User>("/users/me", { method: "PATCH", body: JSON.stringify(data) }),

  updateAvatar: (imageUrl: string) =>
    request<User>("/users/me/avatar", { method: "PUT", body: JSON.stringify({ imageUrl }) }),

  removeAvatar: () => request<void>("/users/me/avatar", { method: "DELETE" }),

  togglePrivacy: (isPrivate: boolean) =>
    request<void>("/users/me/privacy", { method: "PUT", body: JSON.stringify({ isPrivate }) }),

  deleteAccount: () => request<void>("/users/me", { method: "DELETE" }),

  deactivateAccount: () => request<void>("/users/me/deactivate", { method: "POST" }),

  getNotifications: () => request<Notification[]>("/notifications"),

  getChats: () => request<Chat[]>("/chats"),

  getChatMessages: (chatId: string) => request<Message[]>(`/chats/${chatId}/messages`),

  sendMessage: (chatId: string, text: string) =>
    request<Message>(`/chats/${chatId}/messages`, { method: "POST", body: JSON.stringify({ text }) }),

  createChat: (userId: string) =>
    request<Chat>("/chats", { method: "POST", body: JSON.stringify({ userId }) }),

  logout: () => {
    localStorage.removeItem("anagram_token");
  },
};
