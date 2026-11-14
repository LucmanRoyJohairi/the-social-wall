"use client";

import React, { useState } from "react";
import { Post } from "@/types/post";
import { Navbar } from "@/components/wall/Navbar";
import { ProfileSidebar } from "@/components/wall/ProfileSidebar";
import { PostComposer } from "@/components/wall/PostComposer";
import { PostCard } from "@/components/wall/PostCard";
import { TrendingSidebar } from "@/components/wall/TrendingSidebar";

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: "Greg Wientjes",
    handle: "@gregw",
    avatarColor: "bg-blue-600",
    content: "It worked!",
    timestamp: "Just now",
    likes: 4,
    comments: 1,
  },
  {
    id: 2,
    author: "Greg Wientjes",
    handle: "@gregw",
    avatarColor: "bg-blue-600",
    content: "Hello world! This is a live website.",
    timestamp: "2m",
    likes: 12,
    comments: 3,
  },
  {
    id: 3,
    author: "Anna",
    handle: "@anna_dev",
    avatarColor: "bg-emerald-600",
    content:
      "Hey Greg, did you debug your coffee maker yet? Last cup tasted like JavaScript errors.",
    timestamp: "2h",
    likes: 28,
    comments: 5,
  },
  {
    id: 4,
    author: "Adelaida",
    handle: "@adelaida",
    avatarColor: "bg-purple-600",
    content:
      "Greg, saw your last coding session—pretty sure you broke Stack Overflow again! 🧯",
    timestamp: "3h",
    likes: 41,
    comments: 7,
  },
  {
    id: 5,
    author: "Juho",
    handle: "@juho_codes",
    avatarColor: "bg-amber-600",
    content:
      "Greg, are you still coding in pajamas, or have you upgraded to full-time sweatpants mode?",
    timestamp: "4h",
    likes: 19,
    comments: 2,
  },
  {
    id: 6,
    author: "Sheryl",
    handle: "@sheryl",
    avatarColor: "bg-rose-600",
    content:
      "Greg, when are we gonna deploy your latest dance moves to production? #AgileDancer",
    timestamp: "8h",
    likes: 64,
    comments: 9,
  },
];

export default function WallPage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

  const handleAddPost = (content: string) => {
    const newPost: Post = {
      id: Date.now(),
      author: "Greg Wientjes",
      handle: "@gregw",
      avatarColor: "bg-blue-600",
      content,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
    };

    setPosts([newPost, ...posts]);
  };

  const handleToggleLike = (id: number) => {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <ProfileSidebar postCount={posts.length} />

        <section className="lg:col-span-6 space-y-4">
          <PostComposer onAddPost={handleAddPost} />

          <div className="space-y-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleLike={handleToggleLike}
              />
            ))}
          </div>
        </section>

        <TrendingSidebar />
      </main>
    </div>
  );
}
