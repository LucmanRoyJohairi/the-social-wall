import React from "react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-blue-600/95 backdrop-blur-md text-white border-b border-blue-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white text-blue-600 font-black flex items-center justify-center text-lg shadow-sm">
            W
          </div>
          <h1 className="text-lg font-bold tracking-tight">The Social Wall</h1>
        </div>
        <div className="text-xs font-medium bg-blue-500/50 px-3 py-1.5 rounded-full border border-blue-400/30">
          Live Feed
        </div>
      </div>
    </header>
  );
}
