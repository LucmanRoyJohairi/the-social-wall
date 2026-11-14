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
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error.message);
      } else if (data) {
        const formattedPosts: Post[] = data.map((row) => ({
          id: row.id,
          author: row.author,
          handle: row.handle,
          avatarColor: row.avatar_color,
          content: row.content,
          timestamp: new Date(row.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          likes: row.likes,
          comments: row.comments,
        }));
        setPosts(formattedPosts);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

    const handleAddPost = async (content: string, imageUrl?: string) => {
    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          author: "Greg Wientjes",
          handle: "@gregw",
          avatar_color: "bg-blue-600",
          content: content || "Shared a photo",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding post:", error.message);
      return;
    }

    if (data) {
      const newPost: Post = {
        id: data.id,
        author: data.author,
        handle: data.handle,
        avatarColor: data.avatar_color,
        content: content,
        imageUrl,
        timestamp: "Just now",
        likes: data.likes,
        comments: data.comments,
      };
      setPosts([newPost, ...posts]);
    }
  };


  const handleToggleLike = async (id: number) => {
    const target = posts.find((p) => p.id === id);
    if (!target) return;

    const updatedLikes = target.liked ? target.likes - 1 : target.likes + 1;

    setPosts(
      posts.map((post) =>
        post.id === id
          ? { ...post, liked: !post.liked, likes: updatedLikes }
          : post
      )
    );

    await supabase
      .from("posts")
      .update({ likes: updatedLikes })
      .eq("id", id);
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
