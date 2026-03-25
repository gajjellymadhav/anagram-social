import type { AuthResponse, Post, Comment, User, Story } from "@/types";

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

  signup: (data: { username: string; email: string; password: string }) =>
    request<AuthResponse>("/signup", { method: "POST", body: JSON.stringify(data) }),

  getPosts: () => request<Post[]>("/posts"),

  getExplorePosts: () => request<Post[]>("/explore"),

  getStories: () => request<Story[]>("/stories"),

  getUserProfile: (username: string) => request<User>(`/users/${username}`),

  getUserPosts: (username: string) => request<Post[]>(`/users/${username}/posts`),

  likePost: (postId: string) => request<void>(`/posts/${postId}/like`, { method: "POST" }),

  unlikePost: (postId: string) => request<void>(`/posts/${postId}/unlike`, { method: "POST" }),

  getComments: (postId: string) => request<Comment[]>(`/posts/${postId}/comments`),

  addComment: (postId: string, text: string) =>
    request<Comment>(`/posts/${postId}/comments`, { method: "POST", body: JSON.stringify({ text }) }),

  createPost: (data: { imageUrl: string; caption: string }) =>
    request<Post>("/posts", { method: "POST", body: JSON.stringify(data) }),
};
