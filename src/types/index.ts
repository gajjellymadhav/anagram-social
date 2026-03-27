export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isPrivate: boolean;
  isFollowing?: boolean;
  hasRequestedFollow?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  imageUrl: string;
  videoUrl?: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  hasUnread: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "follow_request";
  fromUser: {
    id: string;
    username: string;
    avatar?: string;
  };
  postId?: string;
  postImage?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface Chat {
  id: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
}
