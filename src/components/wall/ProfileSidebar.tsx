"use client";

import React, { useRef, useState } from "react";
import { Camera, GraduationCap, Loader2, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ProfileSidebarProps {
  postCount: number;
  avatarUrl: string;
  onAvatarChange: (newUrl: string) => void;
}

export function ProfileSidebar({
  postCount,
  avatarUrl,
  onAvatarChange,
}: ProfileSidebarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;


    setIsUploading(true);
    const startTime = performance.now();

    try {
      const fileName = "current-avatar";
      console.log("2. Starting upload to Supabase bucket 'avatars'...");

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      const elapsed = Math.round(performance.now() - startTime);
      console.log(`3. Upload finished in ${elapsed}ms`, {
        uploadData,
        uploadError,
      });

      if (uploadError) {
        alert(`Upload failed: ${uploadError.message}`);
        return;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      const freshUrl = `${data.publicUrl}?t=${Date.now()}`;
      console.log("4. Public URL generated:", freshUrl);

      onAvatarChange(freshUrl);
    } catch (err) {
      console.error("Unexpected upload error:", err);
      alert("An unexpected error occurred during upload.");
    } finally {
      console.log("5. Cleaning up upload state.");
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };


  return (
    <aside className="lg:col-span-3 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden lg:sticky lg:top-20">
      <div className="h-14 sm:h-20 bg-gradient-to-r from-blue-600 to-indigo-600" />

      <div className="px-5 pb-4 sm:pb-5">
        {/* Interactive Hover Avatar */}
        <div className="-mt-10 mb-3 relative inline-block group">
          <img
            src={avatarUrl}
            alt="Greg Wientjes"
            className={`w-50 h-50 rounded-xl object-cover border-4 border-white shadow-sm bg-slate-200 transition-all duration-200 ${
              isUploading ? "opacity-40 grayscale" : ""
            }`}
          />

          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            title="Change profile photo"
            className={`absolute inset-0 m-1 rounded-lg bg-slate-900/55 text-white flex flex-col items-center justify-center transition-opacity cursor-pointer ${
              isUploading
                ? "opacity-100 cursor-wait"
                : "opacity-0 group-hover:opacity-100 focus:opacity-100"
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mb-0.5" />
                <span className="text-[10px] font-medium">Saving</span>
              </>
            ) : (
              <>
                <Camera className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-medium">Edit</span>
              </>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
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
