
import React from "react";
import { GraduationCap, MapPin } from "lucide-react";

interface ProfileSidebarProps {
  postCount: number;
}

export function ProfileSidebar({ postCount }: ProfileSidebarProps) {
  return (
    <aside className="lg:col-span-3 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden lg:sticky lg:top-20">
      <div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-600" />

      <div className="px-5 pb-5">
        <div className="-mt-10 mb-3">
          <img
            src="/profile.jpg"
            alt="Greg Wientjes"
            className="w-50 h-50 rounded-xl object-cover border-4 border-white shadow-sm bg-slate-200"
          />
        </div>

        <h2 className="text-lg font-bold text-slate-900 leading-tight">
          Greg Wientjes
        </h2>
        <p className="text-xs text-slate-500 mb-4">@gregw · The Social Wall</p>

        <div className="flex gap-4 py-3 border-y border-slate-100 text-xs mb-4">
          <div>
            <span className="font-bold text-slate-900">{postCount}</span>{" "}
            <span className="text-slate-500">Posts</span>
          </div>
          <div>
            <span className="font-bold text-slate-900">428</span>{" "}
            <span className="text-slate-500">Connections</span>
          </div>
        </div>

        <div className="space-y-2.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Stanford Alum</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Palo Alto, CA</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
