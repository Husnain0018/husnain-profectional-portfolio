# Ali Husnain — Full-Stack Developer Portfolio & CMS Platform

A complete, production-ready personal developer portfolio website and Content Management System (CMS) engineered for **Ali Husnain** (`@Husnain0018`).

Built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, **Zod**, **Supabase PostgreSQL / Auth / Storage integration**, and **live GitHub REST API synchronization**.

---

## 1. Architecture & Tech Stack

- **Framework:** Next.js 16 (App Router, Server Components, Server Route Handlers)
- **Language:** TypeScript 5
- **Styling & Theme System:** Tailwind CSS v4, custom dark-first palette (`#080B14`, `#101624`, `#141B2A`, `#4F8CFF`, `#8B5CF6`, `#22D3EE`) with persistent Dark/Light theme switching and `prefers-reduced-motion` accessibility support
- **Database & Persistence:**
  - **Cloud Production Mode:** Supabase PostgreSQL with Row Level Security (RLS) migrations (`database/migrations/001_initial_schema.sql`) and seed data (`database/seed/001_seed_data.sql`)
  - **Zero-Config Local Persistence Mode:** Automatically persists all CMS edits, contact messages, and GitHub synchronization cache to `database/local-store.json` when Supabase environment variables are not yet configured
- **Live GitHub Integration:** Server-side integration with `GET https://api.github.com/users/Husnain0018` and `GET https://api.github.com/users/Husnain0018/repos?sort=updated&per_page=100` featuring pagination, rate-limit protection, language distribution calculation, and cached fallback

---

## 2. Verified Profile & Assets Included

All uploaded official documents and profile data have been integrated into `/public/uploads/` and wired into the CMS:
- **Profile Photograph:** `/uploads/ali_husnain_profile.jpg`
- **Official Resume / CV (PDF):** `/uploads/Ali_Husnain_CV.pdf`
- **NAVTTC Full-Stack (MEAN/MERN) Certificate (A+ Grade):** `/uploads/navttc_certificate.jpg`
- **Innovate Technologies Experience Certificate (`DOC-2026-00011`):** `/uploads/innovate_experience_letter.jpg`
- **Contact Channels:** `hafizhusnain018@gmail.com` | `+923171784724` (Phone/WhatsApp) | [LinkedIn](https://www.linkedin.com/in/ali-husnain-426311385) | [GitHub](https://github.com/Husnain0018)

---

## 3. Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables (optional for local development):**
   ```bash
   cp .env.example .env.local
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

---

## 4. Accessing the Admin CMS Dashboard

- **Login URL:** `http://localhost:3000/admin/login`
- **Dashboard URL:** `http://localhost:3000/admin`
- **Default Administrator Email:** `hafizhusnain018@gmail.com`
- **Default Initial Password:** `AliAdmin@2026` *(Changeable anytime inside **18. Admin Account** in the dashboard or via `ADMIN_INITIAL_PASSWORD` in `.env.local`)*

Inside `/admin`, all **19 management sections** are active:
1. Dashboard Overview (real database statistics)
2. Profile Management (with photo upload)
3. Hero Section
4. About Me
5. Skills Management (CRUD, categories, ordering, experience labels)
6. Projects Management (CRUD, screenshot upload, featured toggle, delete confirmation)
7. GitHub Integration (manual & automatic sync, fork toggle)
8. Education Management
9. Certifications Management (with certificate image/PDF upload)
10. Experience & Journey Management
11. Services Management
12. Social Links Management
13. Resume / CV Management (PDF upload, live preview, download, remove)
14. Contact Messages Inbox (read/unread status, search, filter, delete)
15. Website Appearance
16. SEO Settings
17. General Settings
18. Admin Account Security
19. Logout

---

## 5. Setting Up Supabase (Production Cloud Database)

1. Create a new project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and run:
   - `database/migrations/001_initial_schema.sql` (creates all 11 tables and Row Level Security policies)
   - `database/seed/001_seed_data.sql` (seeds initial profile, education, and certifications)
3. Create a public storage bucket named `portfolio-assets` in **Supabase Storage**.
4. Add your project credentials to `.env.local` (or Vercel Environment Variables):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

---

## 6. Deploying to Vercel

1. Push this repository to GitHub.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Add the environment variables from `.env.example` (`ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD`, `ADMIN_SESSION_SECRET`, `GITHUB_USERNAME`, and your Supabase keys).
4. Click **Deploy**.
