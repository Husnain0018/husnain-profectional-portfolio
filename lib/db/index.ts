import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { INITIAL_DATABASE } from './seed-data';
import {
  PortfolioDatabase,
  Profile,
  Skill,
  Project,
  Education,
  Certification,
  ExperienceItem,
  ServiceItem,
  SocialLink,
  ContactMessage,
  SiteAppearance,
  SeoSettings,
  GitHubSyncConfig,
} from '@/types/portfolio';

const DB_FILE_PATH = path.join(process.cwd(), 'database', 'local-store.json');

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')
  );
}

export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false },
    }
  );
}

function ensureLocalDbExists(): PortfolioDatabase {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE_PATH)) {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(INITIAL_DATABASE, null, 2), 'utf-8');
      return structuredClone(INITIAL_DATABASE);
    }
    const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as PortfolioDatabase;
    // Ensure any newly added top-level keys exist
    return {
      ...INITIAL_DATABASE,
      ...parsed,
      profile: { ...INITIAL_DATABASE.profile, ...(parsed.profile || {}) },
      appearance: { ...INITIAL_DATABASE.appearance, ...(parsed.appearance || {}) },
      seo: { ...INITIAL_DATABASE.seo, ...(parsed.seo || {}) },
      github_config: { ...INITIAL_DATABASE.github_config, ...(parsed.github_config || {}) },
    };
  } catch (err) {
    console.error('Error reading local database, falling back to INITIAL_DATABASE:', err);
    return structuredClone(INITIAL_DATABASE);
  }
}

export function readLocalDb(): PortfolioDatabase {
  return ensureLocalDbExists();
}

export function writeLocalDb(data: PortfolioDatabase): PortfolioDatabase {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    data.last_content_update = new Date().toISOString();
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write local DB file:', err);
  }
  return data;
}

// ============================================================================
// Unified Async Repository Methods (Supabase + Local JSON Persistence)
// ============================================================================

export async function getPortfolioData(): Promise<PortfolioDatabase & { storage_mode: 'supabase' | 'local_json' }> {
  const localData = readLocalDb();
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const [
        profileRes,
        skillsRes,
        projectsRes,
        eduRes,
        certRes,
        expRes,
        srvRes,
        socRes,
        msgRes,
        settingsRes,
      ] = await Promise.all([
        supabase.from('profiles').select('*').limit(1).maybeSingle(),
        supabase.from('skills').select('*').order('display_order', { ascending: true }),
        supabase.from('projects').select('*').order('display_order', { ascending: true }),
        supabase.from('education').select('*').order('display_order', { ascending: true }),
        supabase.from('certifications').select('*').order('display_order', { ascending: true }),
        supabase.from('experience').select('*').order('display_order', { ascending: true }),
        supabase.from('services').select('*').order('display_order', { ascending: true }),
        supabase.from('social_links').select('*').order('display_order', { ascending: true }),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('*'),
      ]);

      if (!profileRes.error && profileRes.data) {
        const settingsMap: Record<string, unknown> = {};
        (settingsRes.data || []).forEach((row: { setting_key: string; setting_value: unknown }) => {
          settingsMap[row.setting_key] = row.setting_value;
        });

        return {
          ...localData,
          profile: profileRes.data as Profile,
          skills: (skillsRes.data as Skill[]) || localData.skills,
          projects: (projectsRes.data as Project[]) || localData.projects,
          education: (eduRes.data as Education[]) || localData.education,
          certifications: (certRes.data as Certification[]) || localData.certifications,
          experience: (expRes.data as ExperienceItem[]) || localData.experience,
          services: (srvRes.data as ServiceItem[]) || localData.services,
          social_links: (socRes.data as SocialLink[]) || localData.social_links,
          contact_messages: (msgRes.data as ContactMessage[]) || localData.contact_messages,
          appearance: (settingsMap.appearance as SiteAppearance) || localData.appearance,
          seo: (settingsMap.seo as SeoSettings) || localData.seo,
          github_config: (settingsMap.github_config as GitHubSyncConfig) || localData.github_config,
          storage_mode: 'supabase',
        };
      }
    } catch (e) {
      console.warn('Supabase query error, falling back to local persistence store:', e);
    }
  }

  return {
    ...localData,
    storage_mode: 'local_json',
  };
}

export async function updateProfile(updates: Partial<Profile>): Promise<Profile> {
  const db = readLocalDb();
  db.profile = {
    ...db.profile,
    ...updates,
    updated_at: new Date().toISOString(),
  };
  writeLocalDb(db);

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      await supabase.from('profiles').upsert(db.profile);
    } catch (e) {
      console.warn('Supabase profile sync warning:', e);
    }
  }
  return db.profile;
}

export async function saveSkills(skills: Skill[]): Promise<Skill[]> {
  const db = readLocalDb();
  db.skills = skills;
  writeLocalDb(db);
  return db.skills;
}

export async function saveProjects(projects: Project[]): Promise<Project[]> {
  const db = readLocalDb();
  db.projects = projects;
  writeLocalDb(db);
  return db.projects;
}

export async function saveEducation(education: Education[]): Promise<Education[]> {
  const db = readLocalDb();
  db.education = education;
  writeLocalDb(db);
  return db.education;
}

export async function saveCertifications(certifications: Certification[]): Promise<Certification[]> {
  const db = readLocalDb();
  db.certifications = certifications;
  writeLocalDb(db);
  return db.certifications;
}

export async function saveExperience(experience: ExperienceItem[]): Promise<ExperienceItem[]> {
  const db = readLocalDb();
  db.experience = experience;
  writeLocalDb(db);
  return db.experience;
}

export async function saveServices(services: ServiceItem[]): Promise<ServiceItem[]> {
  const db = readLocalDb();
  db.services = services;
  writeLocalDb(db);
  return db.services;
}

export async function saveSocialLinks(social_links: SocialLink[]): Promise<SocialLink[]> {
  const db = readLocalDb();
  db.social_links = social_links;
  writeLocalDb(db);
  return db.social_links;
}

export async function addContactMessage(msg: Omit<ContactMessage, 'id' | 'read_status' | 'created_at'>): Promise<ContactMessage> {
  const db = readLocalDb();
  const newMsg: ContactMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: msg.name.trim(),
    email: msg.email.trim(),
    subject: msg.subject.trim(),
    message: msg.message.trim(),
    read_status: false,
    created_at: new Date().toISOString(),
  };
  db.contact_messages = [newMsg, ...db.contact_messages];
  writeLocalDb(db);

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      await supabase.from('contact_messages').insert({
        name: newMsg.name,
        email: newMsg.email,
        subject: newMsg.subject,
        message: newMsg.message,
        read_status: false,
      });
    } catch (e) {
      console.warn('Supabase insert contact message warning:', e);
    }
  }
  return newMsg;
}

export async function saveContactMessages(messages: ContactMessage[]): Promise<ContactMessage[]> {
  const db = readLocalDb();
  db.contact_messages = messages;
  writeLocalDb(db);
  return db.contact_messages;
}

export async function saveAppearance(appearance: Partial<SiteAppearance>): Promise<SiteAppearance> {
  const db = readLocalDb();
  db.appearance = { ...db.appearance, ...appearance };
  writeLocalDb(db);
  return db.appearance;
}

export async function saveSeo(seo: Partial<SeoSettings>): Promise<SeoSettings> {
  const db = readLocalDb();
  db.seo = { ...db.seo, ...seo };
  writeLocalDb(db);
  return db.seo;
}

export async function saveGitHubConfig(config: Partial<GitHubSyncConfig>): Promise<GitHubSyncConfig> {
  const db = readLocalDb();
  db.github_config = { ...db.github_config, ...config };
  writeLocalDb(db);
  return db.github_config;
}
