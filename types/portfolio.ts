export interface Profile {
  id: string;
  full_name: string;
  professional_title: string;
  hero_heading: string;
  hero_subheadline: string;
  short_bio: string;
  about_content: string;
  career_objective: string;
  professional_interests: string;
  development_philosophy: string;
  current_learning_goals: string;
  location: string;
  country: string;
  email: string;
  phone: string;
  avatar_url: string;
  resume_url: string;
  availability_status: string;
  github_username: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string;
  proficiency_label?: string;
  display_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  detailed_description: string;
  problem_solved: string;
  main_features: string[];
  development_approach: string;
  future_improvements: string;
  category: string;
  technologies: string[];
  primary_language: string | null;
  stars: number;
  forks: number;
  is_fork: boolean;
  is_collaborative?: boolean;
  attribution_note?: string;
  thumbnail_url: string;
  screenshots: string[];
  github_url: string;
  live_demo_url: string | null;
  featured: boolean;
  published: boolean;
  is_github_synced: boolean;
  repo_name?: string;
  default_branch?: string;
  topics?: string[];
  repo_created_at?: string;
  repo_updated_at?: string;
  historical_commits_note?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  display_order: number;
  created_at?: string;
}

export interface Certification {
  id: string;
  title: string;
  organization: string;
  program_name?: string;
  institution?: string;
  technology_track: string;
  issue_date?: string;
  duration?: string;
  grade?: string;
  certificate_number?: string;
  registration_number?: string;
  certificate_url: string;
  credential_url?: string;
  description: string;
  display_order: number;
  created_at?: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  organization: string;
  location?: string;
  type: 'internship' | 'employment' | 'freelance' | 'academic' | 'milestone';
  start_date: string;
  end_date: string;
  description: string;
  highlights: string[];
  certificate_url?: string;
  verification_url?: string;
  display_order: number;
  created_at?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  deliverables: string[];
  display_order: number;
  is_visible: boolean;
  created_at?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  display_order: number;
  is_visible: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read_status: boolean;
  created_at: string;
}

export interface SiteAppearance {
  primary_accent: string;
  secondary_accent: string;
  cyan_accent: string;
  default_theme: 'dark' | 'light';
  brand_text: string;
  logo_url: string;
  hero_background_style: 'mesh' | 'grid' | 'minimal';
  homepage_layout: 'standard' | 'compact';
  footer_tagline: string;
}

export interface SeoSettings {
  site_title: string;
  meta_description: string;
  keywords: string[];
  og_image_url: string;
  canonical_domain: string;
  google_verification?: string;
  enable_indexing: boolean;
}

export interface GitHubSyncConfig {
  username: string;
  last_synced_at: string | null;
  sync_status: 'idle' | 'syncing' | 'success' | 'error';
  last_error: string | null;
  hide_forks: boolean;
  excluded_repos: string[];
  auto_refresh_minutes: number;
}

export interface GitHubUserProfile {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepositoryRaw {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  topics: string[];
  default_branch: string;
  visibility: string;
}

export interface PortfolioDatabase {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  experience: ExperienceItem[];
  services: ServiceItem[];
  social_links: SocialLink[];
  contact_messages: ContactMessage[];
  appearance: SiteAppearance;
  seo: SeoSettings;
  github_config: GitHubSyncConfig;
  github_cache: {
    user: GitHubUserProfile | null;
    repos: GitHubRepositoryRaw[];
    fetched_at: string | null;
  };
  admin_auth: {
    email: string;
    password_hash: string;
    salt: string;
    updated_at: string;
  };
  last_content_update: string;
}
