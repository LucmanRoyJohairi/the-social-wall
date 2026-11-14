# The Social Wall

A modern take on the late-2000s social media "Wall" experience, built with **React 19**, **Next.js 15**, **Tailwind CSS**, **shadcn/ui**, and **Supabase**.

## Features

- **Live Real-Time Feed:** Powered by Supabase Realtime (`postgres_changes`), new posts and photo attachments appear across all connected clients instantly without refreshing.
- **Interactive Post Composer:** Supports up to 280 characters with live character counting, text wrapping, and instant local image previews before sharing.
- **Persistent Photo Uploads:** Attach photos to posts via the `post-images` Supabase Storage bucket.
- **Live Avatar Updating:** Hover over the profile picture to upload and overwrite the active avatar (`current-avatar`) in the `avatars` bucket, updating the UI everywhere immediately.
- **Responsive 3-Column Layout:** Adapts seamlessly from a full-width desktop grid (Profile Sidebar, Live Feed, Trending Panel) down to a mobile-friendly single-column layout.

## Tech Stack

- **Framework:** Next.js 15 (App Router) & React 19
- **Styling:** Tailwind CSS & shadcn/ui
- **Icons:** Lucide React
- **Backend & Realtime:** Supabase (PostgreSQL, Realtime WebSockets, Storage)
- **Deployment:** Vercel

---

## Project Structure

```text
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Main feed state, Supabase queries, and Realtime listener
├── components/
│   ├── ui/                   # shadcn/ui primitives (Button, Textarea)
│   └── wall/
│       ├── Navbar.tsx        # Sticky top navigation header
│       ├── PostCard.tsx      # Individual post display with image attachment & likes
│       ├── PostComposer.tsx  # Post input, character counter, and photo preview
│       ├── ProfileSidebar.tsx# Profile details and hover avatar uploader
│       └── TrendingSidebar.tsx
├── lib/
│   └── supabase.ts           # Supabase client initialization
└── types/
    └── post.ts               # Shared TypeScript interfaces
```

---

## Getting Started

### 1. Clone and Install Dependencies

```bash
git clone https://github.com
cd the-social-wall
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Supabase Database & Storage

Run the following SQL in your **Supabase Dashboard → SQL Editor** to create the `posts` table, enable Realtime, configure Row-Level Security (RLS), and create the public storage buckets:

```sql
-- 1. Create the posts table
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  body text check (char_length(body) <= 280),
  image_url text,
  created_at timestamptz default now()
);

-- 2. Enable Realtime broadcasts
alter publication supabase_realtime add table posts;
alter table posts replica identity full;

-- 3. Enable RLS and public policies
alter table posts enable row level security;

create policy "Allow public read access"
on posts for select using (true);

create policy "Allow public insert access"
on posts for insert with check (true);

-- 4. Create public storage buckets for avatars and post images
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true), ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- 5. Storage bucket policies
create policy "Public read avatars"
on storage.objects for select using (bucket_id = 'avatars');

create policy "Public upload avatars"
on storage.objects for insert with check (bucket_id = 'avatars');

create policy "Public update avatars"
on storage.objects for update using (bucket_id = 'avatars');

create policy "Public read post-images"
on storage.objects for select using (bucket_id = 'post-images');

create policy "Public upload post-images"
on storage.objects for insert with check (bucket_id = 'post-images');
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.