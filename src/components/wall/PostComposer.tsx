"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Smile, X } from "lucide-react";

interface PostComposerProps {
  onAddPost: (content: string, imageUrl?: string) => void;
}

export function PostComposer({ onAddPost }: PostComposerProps) {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxChars = 280;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed && !previewUrl) return;

    onAddPost(trimmed, previewUrl || undefined);
    setInput("");
    clearImage();
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

          {/* Local Photo Preview */}
          {previewUrl && (
            <div className="relative mt-3 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <img
                src={previewUrl}
                alt={selectedFile?.name || "Upload preview"}
                className="max-h-72 w-full object-cover"
              />
              <button
                type="button"
                onClick={clearImage}
                aria-label="Remove image"
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/75 text-white hover:bg-slate-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              {selectedFile && (
                <div className="px-3 py-1.5 text-xs text-slate-500 bg-white/90 border-t border-slate-100 truncate">
                  {selectedFile.name} · Local preview only
                </div>
              )}
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`p-1.5 rounded-full transition-colors ${
                  previewUrl
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-slate-100 hover:text-blue-600"
                }`}
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
              disabled={!input.trim() && !previewUrl}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 px-5 rounded-full text-xs font-semibold shadow-sm"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
