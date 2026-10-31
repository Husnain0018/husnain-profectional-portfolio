'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  User,
  Sparkles,
  FileText,
  Code2,
  FolderGit2,
  GraduationCap,
  Award,
  Briefcase,
  Layers,
  Share2,
  FileUp,
  Inbox,
  Palette,
  Search,
  Settings,
  ShieldCheck,
  LogOut,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Upload,
  Eye,
  Menu,
  X,
  ArrowUp,
  ArrowDown,
  MailOpen,
  Mail,
  Download,
} from 'lucide-react';
import { AHMonogram } from '@/components/brand/Logo';
import { Github } from '@/components/ui/DynamicIcon';
import { EliteOverviewView } from '@/components/dashboard/EliteOverviewView';
import {
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

type AdminTab =
  | 'dashboard'
  | 'profile'
  | 'hero'
  | 'about'
  | 'skills'
  | 'projects'
  | 'github'
  | 'education'
  | 'certifications'
  | 'experience'
  | 'services'
  | 'social'
  | 'resume'
  | 'messages'
  | 'appearance'
  | 'seo'
  | 'general'
  | 'account';

interface AdminPayload {
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
    user: { public_repos: number; followers: number } | null;
    repos: { id: number; name: string; language: string | null; stargazers_count: number; fork: boolean; html_url: string }[];
    fetched_at: string | null;
  };
  storage_mode: 'supabase' | 'local_json';
  last_content_update: string;
  admin_email: string;
}

const SIDEBAR_ITEMS: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Products', icon: FolderGit2 },
  { id: 'messages', label: 'Customers', icon: Inbox },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'skills', label: 'Skills & Tech', icon: Code2 },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'services', label: 'Services', icon: Layers },
  { id: 'hero', label: 'Hero Section', icon: Sparkles },
  { id: 'about', label: 'About Me', icon: FileText },
  { id: 'github', label: 'GitHub Sync', icon: Github },
  { id: 'social', label: 'Social Links', icon: Share2 },
  { id: 'resume', label: 'Resume / CV', icon: FileUp },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'seo', label: 'SEO Settings', icon: Search },
  { id: 'account', label: 'Admin Security', icon: ShieldCheck },
];

export function AdminDashboardClient({
  initialData,
}: {
  initialData: AdminPayload;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState<AdminPayload>(initialData);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Project editing modal / state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Messages filter state
  const [msgSearch, setMsgSearch] = useState('');
  const [msgFilter, setMsgFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Admin account update state
  const [newAdminEmail, setNewAdminEmail] = useState(initialData.admin_email);
  const [newAdminPassword, setNewAdminPassword] = useState('');

  // GitHub sync loading
  const [syncingGitHub, setSyncingGitHub] = useState(false);

  const showNotice = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4500);
  };

  const refreshAdminData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/cms');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    refreshAdminData();
  }, [refreshAdminData]);

  const saveSection = async (section: string, payload: unknown, successMessage = 'Changes saved successfully.') => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, payload }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        showNotice('error', json.error || 'Failed to save changes.');
      } else {
        showNotice('success', successMessage);
        await refreshAdminData();
      }
    } catch {
      showNotice('error', 'Network error while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (
    file: File,
    category: string,
    onUploaded: (url: string) => void
  ) => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        showNotice('error', json.error || 'File upload failed.');
      } else {
        onUploaded(json.url);
        showNotice('success', `Uploaded ${file.name} successfully.`);
      }
    } catch {
      showNotice('error', 'Error uploading file.');
    } finally {
      setSaving(false);
    }
  };

  const handleTriggerGitHubSync = async () => {
    setSyncingGitHub(true);
    try {
      const res = await fetch('/api/admin/github-sync', { method: 'POST' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        showNotice('error', json.error || 'GitHub synchronization failed.');
      } else {
        showNotice('success', json.message || 'GitHub repositories synchronized.');
        await refreshAdminData();
      }
    } catch {
      showNotice('error', 'Failed to reach GitHub sync endpoint.');
    } finally {
      setSyncingGitHub(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    router.push('/admin/login');
    router.refresh();
  };

  const unreadMessagesCount = data.contact_messages.filter((m) => !m.read_status).length;
  const featuredProjectsCount = data.projects.filter((p) => p.featured).length;

  return (
    <div className="min-h-screen bg-[#090B10] text-[#F5F7FC] flex flex-col lg:flex-row">
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3.5 bg-[#10141C] border-b border-[rgba(255,255,255,0.08)] sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle admin sidebar"
            className="p-2 rounded-lg bg-[#151B25] border border-[rgba(255,255,255,0.08)] text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-heading font-bold text-sm text-[#F5F7FC]">Ali Husnain — CMS Admin</span>
        </div>
        <Link
          href="/"
          target="_blank"
          className="text-xs font-semibold text-[#6C8CFF] flex items-center gap-1"
        >
          <span>View Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0B0D14] border-r border-[rgba(255,255,255,0.06)] flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* User Identity Top (Exact Mockup Match: Vanessa / Ali Husnain + Email) */}
        <div className="p-6 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AHMonogram className="w-9 h-9 shrink-0" />
              <div className="min-w-0">
                <h2 className="font-heading text-base font-bold text-[#FFFFFF] tracking-tight truncate">
                  {data.profile.full_name || 'Ali Husnain'}
                </h2>
                <p className="text-[11px] text-[#8E95A5] truncate max-w-[160px] font-mono">
                  {data.admin_email || 'hafizhusnain018@gmail.com'}
                </p>
              </div>
            </div>
            <Link
              href="/"
              target="_blank"
              title="Open Public Website"
              className="p-1.5 rounded-lg bg-[#151827] border border-[rgba(255,255,255,0.06)] text-[#8E95A5] hover:text-white hover:border-[#7C5CFC] transition-colors shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#181B2B] border border-[rgba(255,255,255,0.08)] text-[#FFFFFF] shadow-sm'
                    : 'text-[#8E95A5] hover:text-[#FFFFFF] hover:bg-[#121522]'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#8B5CF6]' : 'text-[#6C7284]'}`} />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.id === 'messages' && unreadMessagesCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#EC4899] text-white text-[10px] font-bold">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[rgba(255,255,255,0.06)]">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl">
        {/* Global Notification Toast */}
        {toast && (
          <div
            role="status"
            className={`mb-6 p-4 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm ${
              toast.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{toast.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ===================================================================
            1. DASHBOARD OVERVIEW (Exact Pixel-Perfect Match to Mockup)
           =================================================================== */}
        {activeTab === 'dashboard' && (
          <EliteOverviewView
            profileName={data.profile.full_name || 'Ali Husnain'}
            profileEmail={data.admin_email || 'hafizhusnain018@gmail.com'}
            avatarUrl={data.profile.avatar_url || '/uploads/ali_husnain_profile.jpg'}
            projects={data.projects}
            skills={data.skills}
            contactMessages={data.contact_messages}
            githubCache={data.github_cache}
            storageMode={data.storage_mode}
            lastContentUpdate={data.last_content_update}
            onSyncGitHub={handleTriggerGitHubSync}
            syncingGitHub={syncingGitHub}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* ===================================================================
            2. PROFILE MANAGEMENT
           =================================================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#F5F7FF]">
              Profile Management
            </h2>
            <div className="rounded-2xl bg-[#141B2A] border border-slate-800 p-6 space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-5 border-b border-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.profile.avatar_url || '/uploads/ali_husnain_profile.jpg'}
                  alt={data.profile.full_name}
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-700"
                />
                <div className="space-y-2">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4F8CFF] text-white text-xs font-semibold cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Upload / Replace Profile Photograph</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          handleFileUpload(f, 'avatar', (url) => {
                            const next = { ...data.profile, avatar_url: url };
                            setData({ ...data, profile: next });
                            saveSection('profile', next, 'Profile photo updated.');
                          });
                        }
                      }}
                    />
                  </label>
                  <p className="text-xs text-[#9BA7BA]">
                    Current path: <code>{data.profile.avatar_url}</code>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#9BA7BA] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={data.profile.full_name}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: { ...data.profile, full_name: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9BA7BA] mb-1">
                    Availability Status
                  </label>
                  <input
                    type="text"
                    value={data.profile.availability_status}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: {
                          ...data.profile,
                          availability_status: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#9BA7BA] mb-1">
                    Professional Title / Headline
                  </label>
                  <input
                    type="text"
                    value={data.profile.professional_title}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: {
                          ...data.profile,
                          professional_title: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9BA7BA] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={data.profile.email}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: { ...data.profile, email: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9BA7BA] mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={data.profile.phone}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: { ...data.profile, phone: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9BA7BA] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={data.profile.location}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: { ...data.profile, location: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9BA7BA] mb-1">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    value={data.profile.github_username}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: {
                          ...data.profile,
                          github_username: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  saveSection('profile', data.profile, 'Profile settings saved.')
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F8CFF] text-white text-xs font-semibold cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Information</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            3. HERO SECTION MANAGEMENT
           =================================================================== */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#F5F7FF]">
              Hero Section Content
            </h2>
            <div className="rounded-2xl bg-[#141B2A] border border-slate-800 p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#9BA7BA] mb-1">
                  Main Hero Heading
                </label>
                <input
                  type="text"
                  value={data.profile.hero_heading}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: { ...data.profile, hero_heading: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9BA7BA] mb-1">
                  Hero Subheadline
                </label>
                <input
                  type="text"
                  value={data.profile.hero_subheadline}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: {
                        ...data.profile,
                        hero_subheadline: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9BA7BA] mb-1">
                  Supporting Paragraph (Short Introduction)
                </label>
                <textarea
                  rows={4}
                  value={data.profile.short_bio}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: { ...data.profile, short_bio: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                />
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  saveSection('profile', data.profile, 'Hero section updated.')
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F8CFF] text-white text-xs font-semibold cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Hero Section</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            4. ABOUT ME MANAGEMENT
           =================================================================== */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#F5F7FF]">
              About Me Section Management
            </h2>
            <div className="rounded-2xl bg-[#141B2A] border border-slate-800 p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#9BA7BA] mb-1">
                  Personal Introduction & Biography
                </label>
                <textarea
                  rows={6}
                  value={data.profile.about_content}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: {
                        ...data.profile,
                        about_content: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9BA7BA] mb-1">
                  Career Objective
                </label>
                <textarea
                  rows={3}
                  value={data.profile.career_objective}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: {
                        ...data.profile,
                        career_objective: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9BA7BA] mb-1">
                  Professional Interests
                </label>
                <textarea
                  rows={3}
                  value={data.profile.professional_interests}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: {
                        ...data.profile,
                        professional_interests: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9BA7BA] mb-1">
                  Development Philosophy
                </label>
                <textarea
                  rows={3}
                  value={data.profile.development_philosophy}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: {
                        ...data.profile,
                        development_philosophy: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9BA7BA] mb-1">
                  Current Learning Goals
                </label>
                <textarea
                  rows={3}
                  value={data.profile.current_learning_goals}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: {
                        ...data.profile,
                        current_learning_goals: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                />
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  saveSection('profile', data.profile, 'About section saved.')
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F8CFF] text-white text-xs font-semibold cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save About Me Content</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            5. SKILLS MANAGEMENT
           =================================================================== */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#F5F7FF]">
                  Skills Management ({data.skills.length})
                </h2>
                <p className="text-xs text-[#9BA7BA]">
                  Add, categorize, reorder, toggle visibility, or update experience-level labels (no arbitrary percentages).
                </p>
              </div>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const newSkill: Skill = {
                      id: `sk-${Date.now()}`,
                      name: 'New Skill',
                      category: 'Frontend Development',
                      icon: 'Code2',
                      proficiency_label: 'Practical Experience',
                      display_order: data.skills.length + 1,
                      is_visible: true,
                      created_at: new Date().toISOString(),
                    };
                    setData({ ...data, skills: [newSkill, ...data.skills] });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#141B2A] border border-slate-700 text-xs font-semibold text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#22D3EE]" />
                  <span>Add Skill</span>
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    saveSection('skills', data.skills, 'Skills updated.')
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4F8CFF] text-white text-xs font-semibold cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Skills</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {data.skills.map((skill, idx) => (
                <div
                  key={skill.id}
                  className="rounded-xl bg-[#141B2A] border border-slate-800 p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                >
                  <div className="sm:col-span-3">
                    <label className="text-[10px] text-[#9BA7BA] block">Skill Name</label>
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => {
                        const next = [...data.skills];
                        next[idx] = { ...skill, name: e.target.value };
                        setData({ ...data, skills: next });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080B14] border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-[10px] text-[#9BA7BA] block">Category</label>
                    <input
                      type="text"
                      value={skill.category}
                      onChange={(e) => {
                        const next = [...data.skills];
                        next[idx] = { ...skill, category: e.target.value };
                        setData({ ...data, skills: next });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080B14] border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-[10px] text-[#9BA7BA] block">Experience Label (Optional)</label>
                    <input
                      type="text"
                      value={skill.proficiency_label || ''}
                      onChange={(e) => {
                        const next = [...data.skills];
                        next[idx] = { ...skill, proficiency_label: e.target.value };
                        setData({ ...data, skills: next });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080B14] border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-3 flex items-center justify-end gap-2 pt-3 sm:pt-0">
                    <label className="flex items-center gap-1.5 text-xs text-[#9BA7BA] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={skill.is_visible}
                        onChange={(e) => {
                          const next = [...data.skills];
                          next[idx] = { ...skill, is_visible: e.target.checked };
                          setData({ ...data, skills: next });
                        }}
                      />
                      <span>Visible</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (idx === 0) return;
                        const next = [...data.skills];
                        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                        next.forEach((s, i) => (s.display_order = i + 1));
                        setData({ ...data, skills: next });
                      }}
                      title="Move Up"
                      className="p-1.5 rounded bg-[#080B14] text-[#9BA7BA] hover:text-white cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const next = data.skills.filter((s) => s.id !== skill.id);
                        setData({ ...data, skills: next });
                      }}
                      title="Delete Skill"
                      className="p-1.5 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            6. PROJECTS MANAGEMENT (FULL CRUD + CONFIRMATION + IMAGE UPLOAD)
           =================================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#F5F7FF]">
                  Projects Management ({data.projects.length})
                </h2>
                <p className="text-xs text-[#9BA7BA]">
                  Create, edit, reorder, upload screenshots, toggle featured/published status, or delete projects.
                </p>
              </div>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const blank: Project = {
                      id: `proj-${Date.now()}`,
                      title: 'New Portfolio Project',
                      slug: `project-${Date.now()}`,
                      description: 'Short verified summary of the project.',
                      detailed_description: 'Detailed overview of the project architecture and features.',
                      problem_solved: 'Describe the problem solved.',
                      main_features: ['Feature 1', 'Feature 2'],
                      development_approach: 'Built using modern full-stack architecture.',
                      future_improvements: 'Planned enhancements.',
                      category: 'Full Stack',
                      technologies: ['TypeScript', 'React.js', 'Next.js'],
                      primary_language: 'TypeScript',
                      stars: 0,
                      forks: 0,
                      is_fork: false,
                      thumbnail_url: '/images/projects/noor-ul-quran.svg',
                      screenshots: [],
                      github_url: 'https://github.com/Husnain0018',
                      live_demo_url: null,
                      featured: true,
                      published: true,
                      is_github_synced: false,
                      display_order: data.projects.length + 1,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    };
                    setEditingProject(blank);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4F8CFF] text-white text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Project</span>
                </button>
              </div>
            </div>

            {/* Project Editor Drawer / Panel */}
            {editingProject && (
              <div className="rounded-2xl bg-[#141B2A] border-2 border-[#4F8CFF] p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-base font-bold text-[#F5F7FF]">
                    Editing Project: {editingProject.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="p-1.5 rounded-lg bg-[#080B14] text-[#9BA7BA] hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#9BA7BA] block mb-1">Project Title</label>
                    <input
                      type="text"
                      value={editingProject.title}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, title: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#9BA7BA] block mb-1">URL Slug</label>
                    <input
                      type="text"
                      value={editingProject.slug}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, slug: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#9BA7BA] block mb-1">Category</label>
                    <input
                      type="text"
                      value={editingProject.category}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, category: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#9BA7BA] block mb-1">
                      Technologies (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editingProject.technologies.join(', ')}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          technologies: e.target.value
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#9BA7BA] block mb-1">GitHub URL</label>
                    <input
                      type="url"
                      value={editingProject.github_url}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, github_url: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#9BA7BA] block mb-1">
                      Live Deployment URL (leave blank if none)
                    </label>
                    <input
                      type="url"
                      value={editingProject.live_demo_url || ''}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          live_demo_url: e.target.value.trim() || null,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#9BA7BA] block mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={editingProject.description}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#9BA7BA] block mb-1">Detailed Overview</label>
                  <textarea
                    rows={3}
                    value={editingProject.detailed_description}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        detailed_description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#080B14] border border-slate-700 text-xs font-semibold text-[#22D3EE] cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Upload Project Cover Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          handleFileUpload(f, 'project', (url) => {
                            setEditingProject({
                              ...editingProject,
                              thumbnail_url: url,
                            });
                          });
                        }
                      }}
                    />
                  </label>

                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.featured}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          featured: e.target.checked,
                        })
                      }
                    />
                    <span>Featured Project</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.published}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          published: e.target.checked,
                        })
                      }
                    />
                    <span>Published</span>
                  </label>
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const exists = data.projects.some((p) => p.id === editingProject.id);
                      const nextProjects = exists
                        ? data.projects.map((p) =>
                            p.id === editingProject.id ? editingProject : p
                          )
                        : [editingProject, ...data.projects];
                      setData({ ...data, projects: nextProjects });
                      saveSection('projects', nextProjects, 'Project saved.');
                      setEditingProject(null);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F8CFF] text-white text-xs font-semibold cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Project</span>
                  </button>
                </div>
              </div>
            )}

            {/* Existing Projects List */}
            <div className="space-y-3">
              {data.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl bg-[#141B2A] border border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-[#F5F7FF]">
                        {proj.title}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#080B14] border border-slate-800 text-[10px] text-[#22D3EE]">
                        {proj.category}
                      </span>
                      {proj.featured && (
                        <span className="px-2 py-0.5 rounded bg-[#4F8CFF]/20 text-[10px] font-semibold text-[#4F8CFF]">
                          Featured
                        </span>
                      )}
                      {!proj.published && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-[10px] font-semibold text-amber-300">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#9BA7BA] line-clamp-1">
                      {proj.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingProject(proj)}
                      className="px-3 py-1.5 rounded-lg bg-[#080B14] border border-slate-700 text-xs font-semibold text-white hover:border-[#4F8CFF] cursor-pointer"
                    >
                      Edit
                    </button>

                    {deleteConfirmId === proj.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const next = data.projects.filter((p) => p.id !== proj.id);
                            setData({ ...data, projects: next });
                            saveSection('projects', next, 'Project deleted.');
                            setDeleteConfirmId(null);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-bold cursor-pointer"
                        >
                          Confirm Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1.5 rounded-lg bg-[#080B14] text-xs text-[#9BA7BA] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(proj.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            7. GITHUB INTEGRATION & SYNCHRONIZATION
           =================================================================== */}
        {activeTab === 'github' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#F5F7FF]">
                  GitHub Synchronization & Controls
                </h2>
                <p className="text-xs text-[#9BA7BA]">
                  Sync live repositories from github.com/{data.github_config.username || 'Husnain0018'} while preserving custom project descriptions.
                </p>
              </div>
              <button
                type="button"
                onClick={handleTriggerGitHubSync}
                disabled={syncingGitHub}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white text-xs font-semibold cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${syncingGitHub ? 'animate-spin' : ''}`} />
                <span>{syncingGitHub ? 'Synchronizing...' : 'Sync GitHub Repositories'}</span>
              </button>
            </div>

            <div className="rounded-2xl bg-[#141B2A] border border-slate-800 p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#080B14] border border-slate-800">
                  <span className="text-[#9BA7BA] block">GitHub Account</span>
                  <span className="text-sm font-bold text-white">
                    @{data.github_config.username}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#080B14] border border-slate-800">
                  <span className="text-[#9BA7BA] block">Last Successful Sync</span>
                  <span className="text-sm font-bold text-[#22D3EE]">
                    {data.github_config.last_synced_at
                      ? new Date(data.github_config.last_synced_at).toLocaleString()
                      : 'Ready to sync'}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#080B14] border border-slate-800">
                  <span className="text-[#9BA7BA] block">Cached Repositories</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {data.github_cache.repos?.length || 28} Public Repos
                  </span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.github_config.hide_forks}
                    onChange={(e) => {
                      const next = {
                        ...data.github_config,
                        hide_forks: e.target.checked,
                      };
                      setData({ ...data, github_config: next });
                      saveSection('github_config', next, 'GitHub filter saved.');
                    }}
                  />
                  <span>Hide forked repositories on public portfolio</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            8. EDUCATION MANAGEMENT
           =================================================================== */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#F5F7FF]">
                Education Management
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const item: Education = {
                      id: `edu-${Date.now()}`,
                      degree: 'Degree / Program Title',
                      institution: 'Institution Name',
                      location: 'Pakistan',
                      start_date: '2024',
                      end_date: 'Present',
                      description: '',
                      display_order: data.education.length + 1,
                    };
                    setData({ ...data, education: [...data.education, item] });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#141B2A] border border-slate-700 text-xs font-semibold text-white cursor-pointer"
                >
                  + Add Education Entry
                </button>
                <button
                  type="button"
                  onClick={() =>
                    saveSection('education', data.education, 'Education saved.')
                  }
                  className="px-4 py-2 rounded-xl bg-[#4F8CFF] text-white text-xs font-semibold cursor-pointer"
                >
                  Save Education
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {data.education.map((edu, idx) => (
                <div
                  key={edu.id}
                  className="rounded-2xl bg-[#141B2A] border border-slate-800 p-5 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const next = [...data.education];
                        next[idx] = { ...edu, degree: e.target.value };
                        setData({ ...data, education: next });
                      }}
                      placeholder="Degree"
                      className="px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                    />
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const next = [...data.education];
                        next[idx] = { ...edu, institution: e.target.value };
                        setData({ ...data, education: next });
                      }}
                      placeholder="University / Institution"
                      className="px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                    />
                    <input
                      type="text"
                      value={edu.start_date}
                      onChange={(e) => {
                        const next = [...data.education];
                        next[idx] = { ...edu, start_date: e.target.value };
                        setData({ ...data, education: next });
                      }}
                      placeholder="Start Year"
                      className="px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                    />
                    <input
                      type="text"
                      value={edu.end_date}
                      onChange={(e) => {
                        const next = [...data.education];
                        next[idx] = { ...edu, end_date: e.target.value };
                        setData({ ...data, education: next });
                      }}
                      placeholder="End Year / Present"
                      className="px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={edu.description}
                    onChange={(e) => {
                      const next = [...data.education];
                      next[idx] = { ...edu, description: e.target.value };
                      setData({ ...data, education: next });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setData({
                        ...data,
                        education: data.education.filter((x) => x.id !== edu.id),
                      });
                    }}
                    className="text-xs text-rose-400 hover:underline cursor-pointer"
                  >
                    Remove Entry
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            9. CERTIFICATIONS MANAGEMENT (WITH CERTIFICATE UPLOAD)
           =================================================================== */}
        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#F5F7FF]">
                Certifications Management
              </h2>
              <button
                type="button"
                onClick={() =>
                  saveSection(
                    'certifications',
                    data.certifications,
                    'Certifications saved.'
                  )
                }
                className="px-4 py-2 rounded-xl bg-[#4F8CFF] text-white text-xs font-semibold cursor-pointer"
              >
                Save Certifications
              </button>
            </div>

            <div className="space-y-4">
              {data.certifications.map((cert, idx) => (
                <div
                  key={cert.id}
                  className="rounded-2xl bg-[#141B2A] border border-slate-800 p-5 space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#9BA7BA] block">Certification Title</label>
                      <input
                        type="text"
                        value={cert.title}
                        onChange={(e) => {
                          const next = [...data.certifications];
                          next[idx] = { ...cert, title: e.target.value };
                          setData({ ...data, certifications: next });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#9BA7BA] block">Organization</label>
                      <input
                        type="text"
                        value={cert.organization}
                        onChange={(e) => {
                          const next = [...data.certifications];
                          next[idx] = { ...cert, organization: e.target.value };
                          setData({ ...data, certifications: next });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#9BA7BA] block">Technology Track</label>
                      <input
                        type="text"
                        value={cert.technology_track}
                        onChange={(e) => {
                          const next = [...data.certifications];
                          next[idx] = { ...cert, technology_track: e.target.value };
                          setData({ ...data, certifications: next });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#9BA7BA] block">Certificate Image / PDF</label>
                      <div className="flex items-center gap-2 mt-1">
                        <label className="px-3 py-1.5 rounded-lg bg-[#4F8CFF] text-white text-xs font-semibold cursor-pointer">
                          Upload File
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                handleFileUpload(f, 'certificate', (url) => {
                                  const next = [...data.certifications];
                                  next[idx] = { ...cert, certificate_url: url };
                                  setData({ ...data, certifications: next });
                                  saveSection(
                                    'certifications',
                                    next,
                                    'Certificate file uploaded.'
                                  );
                                });
                              }
                            }}
                          />
                        </label>
                        {cert.certificate_url && (
                          <a
                            href={cert.certificate_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#22D3EE] hover:underline"
                          >
                            View Current File
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    value={cert.description}
                    onChange={(e) => {
                      const next = [...data.certifications];
                      next[idx] = { ...cert, description: e.target.value };
                      setData({ ...data, certifications: next });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-xs text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            10. EXPERIENCE MANAGEMENT
           =================================================================== */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#F5F7FF]">
                Experience & Journey Management
              </h2>
              <button
                type="button"
                onClick={() =>
                  saveSection('experience', data.experience, 'Experience saved.')
                }
                className="px-4 py-2 rounded-xl bg-[#4F8CFF] text-white text-xs font-semibold cursor-pointer"
              >
                Save Timeline
              </button>
            </div>
            <div className="space-y-4">
              {data.experience.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="rounded-2xl bg-[#141B2A] border border-slate-800 p-5 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => {
                        const next = [...data.experience];
                        next[idx] = { ...exp, title: e.target.value };
                        setData({ ...data, experience: next });
                      }}
                      className="px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                    />
                    <input
                      type="text"
                      value={exp.organization}
                      onChange={(e) => {
                        const next = [...data.experience];
                        next[idx] = { ...exp, organization: e.target.value };
                        setData({ ...data, experience: next });
                      }}
                      className="px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                    />
                    <input
                      type="text"
                      value={`${exp.start_date} - ${exp.end_date}`}
                      readOnly
                      className="px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-xs text-[#9BA7BA]"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={exp.description}
                    onChange={(e) => {
                      const next = [...data.experience];
                      next[idx] = { ...exp, description: e.target.value };
                      setData({ ...data, experience: next });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-xs text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            11. SERVICES MANAGEMENT
           =================================================================== */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#F5F7FF]">
                Services Management ({data.services.length})
              </h2>
              <button
                type="button"
                onClick={() =>
                  saveSection('services', data.services, 'Services saved.')
                }
                className="px-4 py-2 rounded-xl bg-[#4F8CFF] text-white text-xs font-semibold cursor-pointer"
              >
                Save Services
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.services.map((srv, idx) => (
                <div
                  key={srv.id}
                  className="rounded-2xl bg-[#141B2A] border border-slate-800 p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={srv.title}
                      onChange={(e) => {
                        const next = [...data.services];
                        next[idx] = { ...srv, title: e.target.value };
                        setData({ ...data, services: next });
                      }}
                      className="font-bold text-sm bg-[#080B14] border border-slate-800 rounded-lg px-3 py-1.5 text-white w-full mr-3"
                    />
                    <label className="flex items-center gap-1.5 text-xs text-[#9BA7BA]">
                      <input
                        type="checkbox"
                        checked={srv.is_visible}
                        onChange={(e) => {
                          const next = [...data.services];
                          next[idx] = { ...srv, is_visible: e.target.checked };
                          setData({ ...data, services: next });
                        }}
                      />
                      <span>Visible</span>
                    </label>
                  </div>
                  <textarea
                    rows={2}
                    value={srv.description}
                    onChange={(e) => {
                      const next = [...data.services];
                      next[idx] = { ...srv, description: e.target.value };
                      setData({ ...data, services: next });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-slate-800 text-xs text-[#9BA7BA]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            12. SOCIAL LINKS MANAGEMENT
           =================================================================== */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#F5F7FF]">
                Social Links Management
              </h2>
              <button
                type="button"
                onClick={() =>
                  saveSection(
                    'social_links',
                    data.social_links,
                    'Social links saved.'
                  )
                }
                className="px-4 py-2 rounded-xl bg-[#4F8CFF] text-white text-xs font-semibold cursor-pointer"
              >
                Save Social Links
              </button>
            </div>
            <div className="space-y-3">
              {data.social_links.map((soc, idx) => (
                <div
                  key={soc.id}
                  className="rounded-xl bg-[#141B2A] border border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <span className="w-28 font-bold text-sm text-white">
                    {soc.platform}
                  </span>
                  <input
                    type="url"
                    value={soc.url}
                    placeholder={`https://${soc.platform.toLowerCase()}.com/...`}
                    onChange={(e) => {
                      const next = [...data.social_links];
                      next[idx] = {
                        ...soc,
                        url: e.target.value,
                        is_visible: Boolean(e.target.value.trim()),
                      };
                      setData({ ...data, social_links: next });
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#080B14] border border-slate-800 text-xs text-white"
                  />
                  <label className="flex items-center gap-1.5 text-xs text-[#9BA7BA]">
                    <input
                      type="checkbox"
                      checked={soc.is_visible}
                      onChange={(e) => {
                        const next = [...data.social_links];
                        next[idx] = { ...soc, is_visible: e.target.checked };
                        setData({ ...data, social_links: next });
                      }}
                    />
                    <span>Show</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            13. RESUME / CV MANAGEMENT
           =================================================================== */}
        {activeTab === 'resume' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#F5F7FF]">
              Resume / CV Management
            </h2>
            <div className="rounded-2xl bg-[#141B2A] border border-slate-800 p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Active PDF Resume / CV
                  </h3>
                  <p className="text-xs text-[#9BA7BA]">
                    {data.profile.resume_url
                      ? `Current file: ${data.profile.resume_url}`
                      : 'No resume currently configured (public Download CV button will be hidden).'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4F8CFF] text-white text-xs font-semibold cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Upload / Replace PDF CV</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          handleFileUpload(f, 'resume', (url) => {
                            const next = { ...data.profile, resume_url: url };
                            setData({ ...data, profile: next });
                            saveSection('profile', next, 'Resume PDF updated.');
                          });
                        }
                      }}
                    />
                  </label>

                  {data.profile.resume_url && (
                    <>
                      <a
                        href={data.profile.resume_url}
                        download="Ali_Husnain_CV.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#080B14] border border-slate-700 text-xs font-semibold text-[#22D3EE]"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download CV</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          const next = { ...data.profile, resume_url: '' };
                          setData({ ...data, profile: next });
                          saveSection('profile', next, 'Resume removed.');
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs font-semibold text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove CV</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {data.profile.resume_url && (
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#080B14] h-[550px]">
                  <iframe
                    src={data.profile.resume_url}
                    title="Ali Husnain CV Preview"
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            14. CONTACT MESSAGES INBOX
           =================================================================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#F5F7FF]">
                  Contact Messages Inbox ({data.contact_messages.length})
                </h2>
                <p className="text-xs text-[#9BA7BA]">
                  Private administrator inbox — never exposed to public visitors.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(['all', 'unread', 'read'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setMsgFilter(st)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize cursor-pointer ${
                      msgFilter === st
                        ? 'bg-[#4F8CFF] text-white'
                        : 'bg-[#141B2A] border border-slate-800 text-[#9BA7BA]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="search"
              value={msgSearch}
              onChange={(e) => setMsgSearch(e.target.value)}
              placeholder="Search messages by sender name, email, or subject..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#141B2A] border border-slate-800 text-xs text-white"
            />

            <div className="space-y-3">
              {data.contact_messages
                .filter((m) => {
                  if (msgFilter === 'unread' && m.read_status) return false;
                  if (msgFilter === 'read' && !m.read_status) return false;
                  const q = msgSearch.trim().toLowerCase();
                  if (!q) return true;
                  return (
                    m.name.toLowerCase().includes(q) ||
                    m.email.toLowerCase().includes(q) ||
                    m.subject.toLowerCase().includes(q) ||
                    m.message.toLowerCase().includes(q)
                  );
                })
                .map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-2xl border p-5 space-y-3 ${
                      msg.read_status
                        ? 'bg-[#141B2A]/70 border-slate-800'
                        : 'bg-[#141B2A] border-[#4F8CFF]/60'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          {!msg.read_status && (
                            <span className="w-2 h-2 rounded-full bg-[#4F8CFF]" />
                          )}
                          <span>{msg.subject}</span>
                        </h3>
                        <p className="text-xs text-[#22D3EE]">
                          From: {msg.name} ({msg.email}) •{' '}
                          {new Date(msg.created_at).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const next = data.contact_messages.map((x) =>
                              x.id === msg.id
                                ? { ...x, read_status: !x.read_status }
                                : x
                            );
                            setData({ ...data, contact_messages: next });
                            saveSection(
                              'contact_messages',
                              next,
                              `Marked as ${!msg.read_status ? 'read' : 'unread'}.`
                            );
                          }}
                          className="px-3 py-1 rounded-lg bg-[#080B14] border border-slate-700 text-xs text-white cursor-pointer"
                        >
                          {msg.read_status ? 'Mark Unread' : 'Mark Read'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const next = data.contact_messages.filter(
                              (x) => x.id !== msg.id
                            );
                            setData({ ...data, contact_messages: next });
                            saveSection(
                              'contact_messages',
                              next,
                              'Message deleted.'
                            );
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#9BA7BA] whitespace-pre-wrap bg-[#080B14] p-3.5 rounded-xl border border-slate-800">
                      {msg.message}
                    </p>
                  </div>
                ))}

              {data.contact_messages.length === 0 && (
                <div className="rounded-2xl bg-[#141B2A] border border-slate-800 p-10 text-center text-sm text-[#9BA7BA]">
                  No contact messages received yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            15. WEBSITE APPEARANCE MANAGEMENT
           =================================================================== */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#F5F7FF]">
              Website Appearance & Theme Settings
            </h2>
            <div className="rounded-2xl bg-[#141B2A] border border-slate-800 p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#9BA7BA] block mb-1">
                    Brand Logo Text
                  </label>
                  <input
                    type="text"
                    value={data.appearance.brand_text}
                    onChange={(e) =>
                      setData({
                        ...data,
                        appearance: {
                          ...data.appearance,
                          brand_text: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9BA7BA] block mb-1">
                    Default Theme Mode
                  </label>
                  <select
                    value={data.appearance.default_theme}
                    onChange={(e) =>
                      setData({
                        ...data,
                        appearance: {
                          ...data.appearance,
                          default_theme: e.target.value as 'dark' | 'light',
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                  >
                    <option value="dark">Dark Mode First (#080B14)</option>
                    <option value="light">Light Mode</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#9BA7BA] block mb-1">
                    Primary Accent Color
                  </label>
                  <input
                    type="text"
                    value={data.appearance.primary_accent}
                    onChange={(e) =>
                      setData({
                        ...data,
                        appearance: {
                          ...data.appearance,
                          primary_accent: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#9BA7BA] block mb-1">
                    Secondary Accent Color
                  </label>
                  <input
                    type="text"
                    value={data.appearance.secondary_accent}
                    onChange={(e) =>
                      setData({
                        ...data,
                        appearance: {
                          ...data.appearance,
                          secondary_accent: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#9BA7BA] block mb-1">
                  Footer Tagline
                </label>
                <input
                  type="text"
                  value={data.appearance.footer_tagline}
                  onChange={(e) =>
                    setData({
                      ...data,
                      appearance: {
                        ...data.appearance,
                        footer_tagline: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  saveSection(
                    'appearance',
                    data.appearance,
                    'Appearance settings saved.'
                  )
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F8CFF] text-white text-xs font-semibold cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Appearance</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            16. SEO SETTINGS MANAGEMENT
           =================================================================== */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#F5F7FF]">
              SEO & Metadata Configuration
            </h2>
            <div className="rounded-2xl bg-[#141B2A] border border-slate-800 p-6 space-y-4">
              <div>
                <label className="text-xs text-[#9BA7BA] block mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  value={data.seo.site_title}
                  onChange={(e) =>
                    setData({
                      ...data,
                      seo: { ...data.seo, site_title: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-[#9BA7BA] block mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={data.seo.meta_description}
                  onChange={(e) =>
                    setData({
                      ...data,
                      seo: { ...data.seo, meta_description: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-[#9BA7BA] block mb-1">
                  Canonical Domain (Leave empty until custom domain is assigned)
                </label>
                <input
                  type="url"
                  value={data.seo.canonical_domain}
                  placeholder="https://your-custom-domain.com"
                  onChange={(e) =>
                    setData({
                      ...data,
                      seo: { ...data.seo, canonical_domain: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  saveSection('seo', data.seo, 'SEO settings updated.')
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F8CFF] text-white text-xs font-semibold cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save SEO Configuration</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            17. GENERAL SETTINGS
           =================================================================== */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#F5F7FF]">
              General System & Environment Status
            </h2>
            <div className="rounded-2xl bg-[#141B2A] border border-slate-800 p-6 space-y-4 text-xs sm:text-sm text-[#9BA7BA]">
              <p>
                <strong className="text-white">Active Persistence Engine:</strong>{' '}
                {data.storage_mode === 'supabase'
                  ? 'Supabase PostgreSQL (Production Cloud Mode)'
                  : 'Local JSON Persistence Store (database/local-store.json) — Ready for Supabase credentials in .env.local'}
              </p>
              <p>
                <strong className="text-white">GitHub REST API Integration:</strong>{' '}
                Connected live to <code>https://api.github.com/users/Husnain0018</code>
              </p>
              <p>
                <strong className="text-white">Last Content Modification:</strong>{' '}
                {new Date(data.last_content_update).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* ===================================================================
            18. ADMIN ACCOUNT SECURITY
           =================================================================== */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#F5F7FF]">
              Administrator Account Security
            </h2>
            <div className="rounded-2xl bg-[#141B2A] border border-slate-800 p-6 space-y-4 max-w-lg">
              <div>
                <label className="text-xs text-[#9BA7BA] block mb-1">
                  Administrator Email
                </label>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-[#9BA7BA] block mb-1">
                  New Password (min 8 characters)
                </label>
                <input
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="Leave blank to keep existing password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-800 text-sm text-white"
                />
              </div>

              <button
                type="button"
                onClick={async () => {
                  const res = await fetch('/api/admin/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      action: 'update_credentials',
                      newEmail: newAdminEmail,
                      newPassword: newAdminPassword || undefined,
                    }),
                  });
                  const json = await res.json();
                  if (!res.ok || !json.success) {
                    showNotice('error', json.error || 'Failed to update credentials.');
                  } else {
                    setNewAdminPassword('');
                    showNotice('success', json.message);
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F8CFF] text-white text-xs font-semibold cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Update Administrator Credentials</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
