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
  const [avatarUrl, setAvatarUrl] = useState("/profile.jpg");

  // Load latest avatar from Supabase Storage on mount
  useEffect(() => {
    const loadLatestAvatar = async () => {
      const { data } = await supabase.storage.from("avatars").list("", {
        search: "current-avatar",
      });

      if (data && data.some((file) => file.name === "current-avatar")) {
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl("current-avatar");
        setAvatarUrl(`${urlData.publicUrl}?t=${Date.now()}`);
      }
    };

    loadLatestAvatar();
  }, []);

  // Fetch initial posts and subscribe to Realtime updates
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, user_id, body, image_url, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error.message);
      } else if (data) {
        const formattedPosts: Post[] = data.map((row) => ({
          id: row.id,
          userId: row.user_id,
          body: row.body,
          imageUrl: row.image_url || undefined,
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

    const channel = supabase
      .channel("realtime-posts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
        },
        (payload) => {
          const newRow = payload.new as {
            id: string;
            user_id: string | null;
            body: string;
            image_url?: string | null;
            created_at: string;
          };

          setPosts((prev) => {
            if (prev.some((p) => p.id === newRow.id)) return prev;

            return [
              {
                id: newRow.id,
                userId: newRow.user_id,
                body: newRow.body,
                imageUrl: newRow.image_url || undefined,
                timestamp: "Just now",
                likes: 0,
                comments: 0,
              },
              ...prev,
            ];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAddPost = async (body: string, file?: File | null) => {
    let uploadedImageUrl: string | null = null;

    // 1. Upload image to Supabase Storage if a file was selected
    if (file) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(fileName, file, {
          contentType: file.type,
        });

      if (uploadError) {
        alert(`Image upload failed: ${uploadError.message}`);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("post-images")
        .getPublicUrl(fileName);

      uploadedImageUrl = urlData.publicUrl;
    }

    // 2. Insert post row with text and optional image_url
    const { data, error } = await supabase
      .from("posts")
      .insert([{ body, image_url: uploadedImageUrl }])
      .select("id, user_id, body, image_url, created_at")
      .single();

    if (error) {
      alert(`Failed to post: ${error.message}`);
      return;
    }

    if (data) {
      setPosts((prev) => {
        if (prev.some((p) => p.id === data.id)) return prev;
        return [
          {
            id: data.id,
            userId: data.user_id,
            body: data.body,
            imageUrl: data.image_url || undefined,
            timestamp: "Just now",
            likes: 0,
            comments: 0,
          },
          ...prev,
        ];
      });
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
        <ProfileSidebar
          postCount={posts.length}
          avatarUrl={avatarUrl}
          onAvatarChange={setAvatarUrl}
        />

        <section className="lg:col-span-6 space-y-4">
          <PostComposer avatarUrl={avatarUrl} onAddPost={handleAddPost} />

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
                  avatarUrl={avatarUrl}
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
