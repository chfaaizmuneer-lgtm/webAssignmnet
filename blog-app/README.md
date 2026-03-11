# 🖊️ The Blog — Full-Stack Blog Platform

A modern, full-featured blog website with complete CRUD functionality, dark/light mode, animations, authentication, and more. Built with Next.js, Express.js, and MongoDB.

---

## ✨ Features

- **Full CRUD** — Create, Read, Update, Delete blog posts
- **JWT Authentication** — Register, Login, protected routes
- **Dark / Light Mode** — Smooth transitions, system-preference aware, persisted
- **Framer Motion Animations** — Page transitions, card animations, skeleton loading
- **Rich Text Editor** — Quill.js for post content
- **Image Upload** — Multer-powered, with URL fallback
- **Category Filtering** — Filter posts by category
- **Search** — Full-text search across posts
- **Pagination** — Server-side pagination
- **Like System** — Toggle likes on posts (authenticated)
- **Comment System** — Add/delete comments (authenticated)
- **Reading Time** — Auto-calculated from content
- **View Counter** — Tracks views per post
- **Related Posts** — Shown on single post pages
- **Admin Dashboard** — View all posts, stats, edit/delete
- **SEO** — Open Graph tags, per-page titles
- **Responsive** — Mobile, tablet, desktop
- **Share Buttons** — Twitter, LinkedIn, copy link

---

## 🗂️ Project Structure

```
blog-app/
├── blog-backend/
│   ├── config/
│   │   └── seed.js             # Database seeder
│   ├── controllers/
│   │   ├── authController.js   # Auth logic
│   │   ├── commentController.js
│   │   └── postController.js   # Full CRUD
│   ├── middleware/
│   │   └── auth.js             # JWT middleware
│   ├── models/
│   │   ├── Comment.js
│   │   ├── Post.js             # With slug, readingTime auto-calc
│   │   └── User.js             # With bcrypt password hashing
│   ├── routes/
│   │   ├── auth.js
│   │   ├── comments.js
│   │   ├── posts.js
│   │   └── upload.js           # Multer image upload
│   ├── uploads/                # Created automatically
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── blog-frontend/
    ├── components/
    │   ├── BlogCard/
    │   │   └── BlogCard.js      # Animated cards + skeleton
    │   ├── Footer/
    │   │   └── Footer.js
    │   ├── Hero/
    │   │   └── Hero.js          # Featured + trending layout
    │   ├── Modal/
    │   │   └── DeleteModal.js   # Animated confirm dialog
    │   ├── Navbar/
    │   │   └── Navbar.js        # Animated, dropdown, mobile
    │   └── Layout.js
    ├── context/
    │   ├── AuthContext.js       # Global auth state
    │   └── ThemeContext.js      # Dark/light mode
    ├── hooks/
    │   └── useApi.js            # Axios client + API helpers
    ├── pages/
    │   ├── admin/index.js       # Admin dashboard
    │   ├── auth/login.js
    │   ├── auth/register.js
    │   ├── posts/
    │   │   ├── [slug].js        # Single post + comments
    │   │   ├── create.js        # New post form
    │   │   └── edit/[id].js     # Edit form
    │   ├── profile/index.js
    │   ├── 404.js
    │   ├── _app.js
    │   ├── _document.js
    │   └── index.js             # Homepage
    └── styles/
        └── globals.css
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

---

### 1. Clone / extract the project

```bash
cd blog-app
```

---

### 2. Set up the Backend

```bash
cd blog-backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blogdb
JWT_SECRET=your_super_secret_key_here_make_it_long
JWT_EXPIRE=30d
NODE_ENV=development
```

> **MongoDB Atlas?** Replace the URI with:
> `mongodb+srv://<user>:<password>@cluster.mongodb.net/blogdb`

**Seed the database with sample data:**

```bash
npm run seed
```

This creates 6 sample posts, 2 users:
- **Admin:** admin@blogapp.com / admin123
- **User:**  user@blogapp.com / user123

**Start the backend:**

```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

### 3. Set up the Frontend

```bash
cd ../blog-frontend
npm install
```

Create your `.env.local` file:

```bash
cp .env.example .env.local
```

`.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Start the frontend:**

```bash
npm run dev
```

App runs at: `http://localhost:3000`

---

## 📡 API Endpoints

### Auth
| Method | Endpoint           | Auth | Description          |
|--------|--------------------|------|----------------------|
| POST   | /api/auth/register | —    | Register new user    |
| POST   | /api/auth/login    | —    | Login                |
| GET    | /api/auth/me       | ✅   | Get current user     |
| PUT    | /api/auth/profile  | ✅   | Update profile       |

### Posts
| Method | Endpoint                | Auth    | Description            |
|--------|-------------------------|---------|------------------------|
| GET    | /api/posts              | —       | Get all posts (filtered/paginated) |
| GET    | /api/posts/featured     | —       | Get top 5 by views     |
| GET    | /api/posts/:slug        | —       | Get single post        |
| POST   | /api/posts              | ✅      | Create post            |
| PUT    | /api/posts/:id          | ✅      | Update post            |
| DELETE | /api/posts/:id          | ✅      | Delete post            |
| POST   | /api/posts/:id/like     | ✅      | Toggle like            |
| GET    | /api/posts/admin/all    | ✅ Admin| Admin post list        |

### Query params for GET /api/posts:
- `page` — Page number (default: 1)
- `limit` — Results per page (default: 9)
- `category` — Filter by category
- `search` — Text search
- `tag` — Filter by tag
- `sort` — Sort field (default: -createdAt)

### Comments
| Method | Endpoint              | Auth | Description         |
|--------|-----------------------|------|---------------------|
| GET    | /api/comments/:postId | —    | Get post comments   |
| POST   | /api/comments/:postId | ✅   | Add comment         |
| DELETE | /api/comments/:id     | ✅   | Delete comment      |

### Upload
| Method | Endpoint    | Auth | Description    |
|--------|-------------|------|----------------|
| POST   | /api/upload | ✅   | Upload image   |

---

## 🗄️ Database Schema

### User
```js
{
  name:      String (required, max 50)
  email:     String (required, unique)
  password:  String (hashed, select: false)
  avatar:    String
  bio:       String (max 200)
  role:      'user' | 'admin'
  timestamps: true
}
```

### Post
```js
{
  title:         String (required, max 150)
  slug:          String (auto-generated, unique)
  description:   String (required, max 300)
  content:       String (required, HTML)
  featuredImage: String
  author:        ObjectId → User
  category:      Enum (Technology|Design|Development|...)
  tags:          [String]
  likes:         [ObjectId → User]
  views:         Number (auto-incremented)
  readingTime:   Number (auto-calculated)
  published:     Boolean
  timestamps:    true
}
```

### Comment
```js
{
  post:       ObjectId → Post
  author:     ObjectId → User
  content:    String (max 500)
  timestamps: true
}
```

---

## 🎨 UI Pages

| Page | URL | Auth |
|------|-----|------|
| Homepage | / | Public |
| Single Post | /posts/[slug] | Public |
| Create Post | /posts/create | Required |
| Edit Post | /posts/edit/[id] | Required (author/admin) |
| Admin Dashboard | /admin | Admin only |
| Profile | /profile | Required |
| Login | /auth/login | Public |
| Register | /auth/register | Public |

---

## 🎭 Animations

All animations powered by **Framer Motion**:

- **Page Load** — Fade + slide-up on all pages
- **Blog Cards** — Staggered fade-in grid, hover scale + shadow
- **Navbar** — Slides down on mount, dropdowns animate in/out
- **Hero** — Featured post slides from left, trending slides from right
- **Delete Modal** — Scale + fade spring animation
- **Skeleton** — CSS shimmer on all loading states
- **Like Button** — Scale bounce on click
- **Pagination** — Buttons tap scale

---

## 🌙 Dark Mode

- Respects system `prefers-color-scheme` on first visit
- Toggle button in navbar (sun/moon icon)
- Preference saved to `localStorage`
- Smooth CSS variable transitions (0.3s)
- No flash on page load (script in `_document.js`)

---

## 📦 Tech Stack

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Bcrypt (password hashing)
- Multer (image upload)
- Slugify (URL-friendly slugs)

**Frontend**
- Next.js 14 (Pages Router)
- React 18
- Tailwind CSS
- Framer Motion
- Axios
- React Quill (rich text editor)
- React Hot Toast (notifications)
- React Icons
- date-fns

---

## 🔒 Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with expiry
- Protected routes check author ownership
- Admin-only routes check role
- File upload restricted to images (5MB max)
- CORS configured for frontend origin

---

## 🛠️ Customization

**Add a new category:**
1. Add to `enum` in `models/Post.js`
2. Add to `CATEGORIES` arrays in frontend components

**Change accent color:**
Edit `--accent` in `styles/globals.css`

**Increase token expiry:**
Change `JWT_EXPIRE` in `.env`

---

## 🐛 Troubleshooting

**MongoDB connection error**
- Ensure MongoDB is running: `mongod`
- Or check your Atlas URI + IP whitelist

**Images not showing**
- Ensure backend is running (images served from `/uploads/`)
- Check `NEXT_PUBLIC_API_URL` is correct

**CORS errors**
- Set `CLIENT_URL=http://localhost:3000` in backend `.env`

**Rich text editor SSR error**
- ReactQuill is imported with `dynamic(..., { ssr: false })` — this is correct

---

Built with ❤️ — Happy blogging!
