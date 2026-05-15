# ✦ BlogSphere

A modern, full-stack blog platform built with Next.js, MongoDB, and NextAuth.js. Features user authentication, markdown-powered writing, and a polished editorial design.

## Features

- 🔐 **Auth** — Register & sign-in with JWT sessions (NextAuth.js)
- ✍️ **Write** — Rich markdown editor with live preview
- 📋 **Dashboard** — Manage all your posts with stats
- 🗑️ **CRUD** — Create, read, update, delete posts
- 🔒 **Authorization** — Only authors can edit/delete their posts
- 🏷️ **Tags** — Tag and filter posts
- 👁️ **View tracking** — Automatic view counting
- 📱 **Responsive** — Mobile-first design
- 🔍 **Search** — Full-text post search

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/blogsphere.git
cd blogsphere
npm install
```

### 2. Set up MongoDB

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) and create a free cluster
2. Create a database user and whitelist your IP (or `0.0.0.0/0` for Vercel)
3. Copy your connection string

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blogsphere
NEXTAUTH_SECRET=your-random-secret-here   # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### Option A: Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option B: GitHub + Vercel Dashboard

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: BlogSphere"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/blogsphere.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo

3. Add Environment Variables in Vercel dashboard:
   - `MONGODB_URI` — your Atlas connection string
   - `NEXTAUTH_SECRET` — your secret key
   - `NEXTAUTH_URL` — your Vercel deployment URL (e.g. `https://blogsphere.vercel.app`)

4. Click **Deploy**!

---

## Project Structure

```
blogsphere/
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth].ts   # NextAuth config
│   │   │   └── register.ts        # User registration
│   │   ├── posts/
│   │   │   ├── index.ts           # GET all, POST new
│   │   │   └── [slug].ts          # GET/PUT/DELETE by slug
│   │   └── user/
│   │       └── profile.ts         # User profile
│   ├── auth/
│   │   ├── signin.tsx             # Sign in page
│   │   └── register.tsx           # Register page
│   ├── posts/
│   │   └── [slug].tsx             # Post reader
│   ├── edit/
│   │   └── [slug].tsx             # Edit post
│   ├── dashboard.tsx              # Author dashboard
│   ├── write.tsx                  # New post editor
│   └── index.tsx                  # Home / discover
├── components/
│   ├── Layout.tsx                 # Page wrapper
│   ├── Navbar.tsx                 # Navigation
│   └── PostCard.tsx               # Post preview card
├── lib/
│   ├── dbConnect.ts               # MongoDB connection
│   └── models/
│       ├── User.ts                # User schema
│       └── Post.ts                # Post schema
└── styles/                        # CSS modules
```

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (Pages Router) |
| Database | MongoDB + Mongoose |
| Auth | NextAuth.js (JWT) |
| Styling | CSS Modules + Google Fonts |
| Markdown | react-markdown + remark-gfm |
| Deployment | Vercel |

## License

MIT
