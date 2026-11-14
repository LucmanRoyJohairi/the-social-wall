export interface Post {
  id: string;
  body: string;
  userId?: string | null;
  author?: string;
  handle?: string;
  avatarColor?: string;
  imageUrl?: string;
  timestamp: string;
  likes?: number;
  comments?: number;
  liked?: boolean;
}
