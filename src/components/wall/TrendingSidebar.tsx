import React from "react";
import { Sparkles } from "lucide-react";

export function TrendingSidebar() {
  return (
    <aside className="hidden lg:block lg:col-span-3 space-y-4 sticky top-20">
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-3">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Trending on the Wall</span>
        </div>
        <div className="space-y-3 text-xs">
          <div>
            <p className="font-semibold text-slate-800">#AgileDancer</p>
            <p className="text-slate-400">142 posts today</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Stack Overflow</p>
            <p className="text-slate-400">89 engineers discussing</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Latest News</p>
            <p className="text-slate-400">Trending in California</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
