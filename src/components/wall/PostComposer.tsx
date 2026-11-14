"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Smile } from "lucide-react";

interface PostComposerProps {
  onAddPost: (content: string) => void;
}

export function PostComposer({ onAddPost }: PostComposerProps) {
  const [input, setInput] = useState("");
  const maxChars = 280;

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onAddPost(trimmed);
    setInput("");
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
      <div className="flex gap-3">
        <img
          src="/profile.jpg"
          alt="Greg"
          className="w-10 h-10 rounded-full object-cover shrink-0 bg-slate-200"
        />
        <div className="flex-1">
          <Textarea
            placeholder="What's on your mind?"
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, maxChars))}
            className="min-h-[84px] bg-slate-50/70 border-slate-200 focus-visible:ring-blue-500 resize-none text-sm rounded-lg"
          />

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                className="p-1.5 hover:bg-slate-100 hover:text-blue-600 rounded-full transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-1.5 hover:bg-slate-100 hover:text-blue-600 rounded-full transition-colors"
              >
                <Smile className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-400 ml-2">
                {maxChars - input.length} left
              </span>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 px-5 rounded-full text-xs font-semibold shadow-sm"
            >
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
