export interface Post {
  id: number;
  author: string;
  handle: string;
  avatarColor: string;
  content: string;
  imageUrl?: string;
  timestamp: string;
  likes: number;
  comments: number;
  liked?: boolean;
}
