-- =============================================================================
-- Ali Husnain Portfolio — Supabase PostgreSQL Schema & Row Level Security (RLS)
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL DEFAULT 'Ali Husnain',
  professional_title TEXT NOT NULL DEFAULT 'Full-Stack Web Developer | Web Designer | App Developer | AI & Automation Enthusiast',
  hero_heading TEXT NOT NULL DEFAULT 'Hi, I''m Ali Husnain.',
  hero_subheadline TEXT NOT NULL DEFAULT 'Full-Stack Web Developer Building Modern Digital Experiences.',
  short_bio TEXT NOT NULL,
  about_content TEXT NOT NULL,
  career_objective TEXT,
  professional_interests TEXT,
  development_philosophy TEXT,
  current_learning_goals TEXT,
  location TEXT NOT NULL DEFAULT 'Gujranwala, Pakistan',
  country TEXT NOT NULL DEFAULT 'Pakistan',
  email TEXT NOT NULL DEFAULT 'hafizhusnain018@gmail.com',
  phone TEXT DEFAULT '+923171784724',
  avatar_url TEXT DEFAULT '/uploads/ali_husnain_profile.jpg',
  resume_url TEXT DEFAULT '/uploads/Ali_Husnain_CV.pdf',
  availability_status TEXT NOT NULL DEFAULT 'Available for Opportunities & Freelance Projects',
  github_username TEXT NOT NULL DEFAULT 'Husnain0018',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Code2',
  proficiency_label TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  detailed_description TEXT NOT NULL,
  problem_solved TEXT,
  main_features JSONB DEFAULT '[]'::jsonb,
  development_approach TEXT,
  future_improvements TEXT,
  category TEXT NOT NULL,
  technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
  primary_language TEXT,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  is_fork BOOLEAN DEFAULT FALSE,
  thumbnail_url TEXT,
  screenshots JSONB DEFAULT '[]'::jsonb,
  github_url TEXT,
  live_demo_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  is_github_synced BOOLEAN NOT NULL DEFAULT FALSE,
  repo_name TEXT,
  repo_created_at TIMESTAMPTZ,
  repo_updated_at TIMESTAMPTZ,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. EDUCATION TABLE
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  location TEXT DEFAULT 'Pakistan',
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL DEFAULT 'Present',
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CERTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  program_name TEXT,
  institution TEXT,
  technology_track TEXT,
  issue_date TEXT,
  duration TEXT,
  grade TEXT,
  certificate_number TEXT,
  registration_number TEXT,
  certificate_url TEXT,
  credential_url TEXT,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. EXPERIENCE & JOURNEY TABLE
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  location TEXT,
  type TEXT NOT NULL DEFAULT 'milestone', -- 'internship', 'employment', 'freelance', 'academic', 'milestone'
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL DEFAULT 'Present',
  description TEXT NOT NULL,
  highlights JSONB DEFAULT '[]'::jsonb,
  certificate_url TEXT,
  verification_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Layers',
  deliverables JSONB DEFAULT '[]'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read_status BOOLEAN NOT NULL DEFAULT FALSE,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. SITE SETTINGS TABLE (Appearance, SEO, GitHub Sync Config)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'owner',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE auth_user_id = auth.uid()
       OR email = (auth.jwt() ->> 'email')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public Read Policies (Visitors can read published content)
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public read visible skills" ON public.skills FOR SELECT USING (is_visible = true OR public.is_admin());
CREATE POLICY "Public read published projects" ON public.projects FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "Public read education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Public read certifications" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Public read experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Public read visible services" ON public.services FOR SELECT USING (is_visible = true OR public.is_admin());
CREATE POLICY "Public read visible social_links" ON public.social_links FOR SELECT USING (is_visible = true OR public.is_admin());
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);

-- Contact Messages Policies (Visitors can INSERT only; only admins can SELECT/UPDATE/DELETE)
CREATE POLICY "Public insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read contact_messages" ON public.contact_messages FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin update contact_messages" ON public.contact_messages FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete contact_messages" ON public.contact_messages FOR DELETE USING (public.is_admin());

-- Admin Full Management Policies
CREATE POLICY "Admin all profiles" ON public.profiles FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all skills" ON public.skills FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all projects" ON public.projects FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all education" ON public.education FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all certifications" ON public.certifications FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all experience" ON public.experience FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all services" ON public.services FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all social_links" ON public.social_links FOR ALL USING (public.is_admin());
CREATE POLICY "Admin all site_settings" ON public.site_settings FOR ALL USING (public.is_admin());
CREATE POLICY "Admin read admin_users" ON public.admin_users FOR SELECT USING (public.is_admin());
