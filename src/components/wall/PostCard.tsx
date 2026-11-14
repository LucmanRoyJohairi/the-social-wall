import React from "react";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
  avatarUrl: string;
  onToggleLike: (id: string) => void;
}

export function PostCard({ post, avatarUrl, onToggleLike }: PostCardProps) {
  const author = post.author || "Greg Wientjes";
  const handle = post.handle || "@gregw";
  const likes = post.likes ?? 0;
  const comments = post.comments ?? 0;

  return (
    <article className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 hover:border-slate-300 transition-colors">
      <div className="flex gap-3">
        <img
          src={avatarUrl}
          alt={author}
          className="w-10 h-10 rounded-full object-cover shrink-0 bg-slate-200 border border-slate-200/60"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <h3 className="text-sm font-bold text-slate-900 truncate">
                {author}
              </h3>
              <span className="text-xs text-slate-400 truncate">{handle}</span>
            </div>
            <span className="text-xs text-slate-400 shrink-0">
              {post.timestamp}
            </span>
          </div>

          {post.body && (
            <p className="text-sm text-slate-700 leading-relaxed mt-1.5 break-words">
              {post.body}
            </p>
          )}

          {post.imageUrl && (
            <div className="mt-3 rounded-xl overflow-hidden border border-slate-200/80">
              <img
                src={post.imageUrl}
                alt="Post attachment"
                className="max-h-96 w-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-6 mt-3 pt-2 text-slate-400 text-xs">
            <button
              type="button"
              onClick={() => onToggleLike(post.id)}
              className={`flex items-center gap-1.5 hover:text-rose-600 transition-colors ${
                post.liked ? "text-rose-600 font-semibold" : ""
              }`}
            >
              <Heart
                className={`w-4 h-4 ${post.liked ? "fill-rose-600" : ""}`}
              />
              <span>{likes}</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{comments}</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors"
            >
              <Repeat2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 hover:text-blue-600 transition-colors ml-auto"
            >
              <Share className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
