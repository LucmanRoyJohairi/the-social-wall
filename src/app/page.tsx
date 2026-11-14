"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Post } from "@/types/post";
import { Navbar } from "@/components/wall/Navbar";
import { ProfileSidebar } from "@/components/wall/ProfileSidebar";
import { PostComposer } from "@/components/wall/PostComposer";
import { PostCard } from "@/components/wall/PostCard";
import { TrendingSidebar } from "@/components/wall/TrendingSidebar";

export default function WallPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, user_id, body, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error.message);
      } else if (data) {
        const formattedPosts: Post[] = data.map((row) => ({
          id: row.id,
          userId: row.user_id,
          body: row.body,
          timestamp: new Date(row.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          likes: 0,
          comments: 0,
        }));
        setPosts(formattedPosts);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const handleAddPost = async (body: string) => {
    const { data, error } = await supabase
      .from("posts")
      .insert([{ body }])
      .select("id, user_id, body, created_at")
      .single();

    if (error) {
      console.error("Error saving post to Supabase:", error.message);
      alert(`Failed to post: ${error.message}`);
      return;
    }

    if (data) {
      const newPost: Post = {
        id: data.id,
        userId: data.user_id,
        body: data.body,
        timestamp: "Just now",
        likes: 0,
        comments: 0,
      };
      setPosts((prev) => [newPost, ...prev]);
    }
  };

  const handleToggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== id) return post;
        const currentLikes = post.likes ?? 0;
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? currentLikes - 1 : currentLikes + 1,
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <ProfileSidebar postCount={posts.length} />

        <section className="lg:col-span-6 space-y-4">
          <PostComposer onAddPost={handleAddPost} />

          {loading ? (
            <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center text-sm text-slate-500">
              Loading posts from Supabase...
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center text-sm text-slate-500">
              No posts yet. Be the first to share something!
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onToggleLike={handleToggleLike}
                />
              ))}
            </div>
          )}
        </section>

        <TrendingSidebar />
      </main>
    </div>
  );
}
