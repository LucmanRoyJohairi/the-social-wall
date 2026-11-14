"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Post {
  id: number;
  author: string;
  content: string;
  timestamp: string;
}

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: "Greg Wientjes",
    content: "It worked!",
    timestamp: "now",
  },
  {
    id: 2,
    author: "Greg Wientjes",
    content: "Hello world! This is a live website.",
    timestamp: "now",
  },
  {
    id: 3,
    author: "Anna",
    content:
      "Hey Greg, did you debug your coffee maker yet? Last cup tasted like JavaScript errors.",
    timestamp: "2h",
  },
  {
    id: 4,
    author: "Adelaida",
    content:
      "Greg, saw your last coding session—pretty sure you broke Stack Overflow again! 🧯",
    timestamp: "3h",
  },
  {
    id: 5,
    author: "Juho",
    content:
      "Greg, are you still coding in pajamas, or have you upgraded to full-time sweatpants mode?",
    timestamp: "4h",
  },
  {
    id: 6,
    author: "Maija",
    content:
      "Greg, rumor has it your computer has more stickers than code running on it. Confirm?",
    timestamp: "5h",
  },
  {
    id: 7,
    author: "Alex",
    content:
      "Yo Greg, just pulled an all-nighter on the assignment. Turns out sleep deprivation doesn't improve coding skills. Weird!",
    timestamp: "6h",
  },
  {
    id: 8,
    author: "Sheryl",
    content:
      "Greg, when are we gonna deploy your latest dance moves to production? #AgileDancer",
    timestamp: "8h",
  },
];

export default function WallPage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [input, setInput] = useState("");
  const maxChars = 280;

  const handleShare = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newPost: Post = {
      id: Date.now(),
      author: "Greg Wientjes",
      content: trimmed,
      timestamp: "now",
    };

    setPosts([newPost, ...posts]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* Top Blue Header */}
      <header className="bg-[#3b82f6] text-white px-6 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-lg font-bold tracking-tight">The Social Wall</h1>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row gap-8">
        {/* Left Sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <div className="w-48 h-56 bg-slate-200 rounded-sm overflow-hidden mb-4 border border-slate-200">
            <img
              src="/profile.jpg"
              alt="Greg Wientjes"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-xl font-bold text-slate-900 leading-tight">
            Greg Wientjes
          </h2>
          <p className="text-sm text-slate-500 mb-4">The social Wall</p>

          <div className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-sm inline-block mb-6">
            Information
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <p className="font-bold text-slate-800">Networks</p>
              <p className="text-slate-600">Stanford Alum</p>
            </div>
            <div>
              <p className="font-bold text-slate-800">Current City</p>
              <p className="text-slate-600">Palo Alto, CA</p>
            </div>
          </div>
        </aside>

        {/* Right Feed Section */}
        <section className="flex-1">
          {/* Post Composer */}
          <div className="mb-8">
            <Textarea
              placeholder="What's on your mind?"
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, maxChars))}
              className="min-h-[96px] bg-[#f1f5f9] border-dashed border-slate-300 focus-visible:ring-blue-500 resize-none text-sm placeholder:text-slate-400"
            />

            <div className="flex flex-col mt-2">
              <span className="text-xs text-slate-500">
                {maxChars - input.length} characters remaining
              </span>
              <div className="flex justify-end mt-2">
                <Button
                  onClick={handleShare}
                  disabled={!input.trim()}
                  className="bg-[#3b82f6] hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 px-6 rounded-sm text-xs font-semibold"
                >
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="divide-y divide-slate-200 border-t border-slate-200">
            {posts.map((post) => (
              <article key={post.id} className="py-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-bold text-slate-900">
                    {post.author}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {post.timestamp}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {post.content}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
