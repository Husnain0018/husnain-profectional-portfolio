'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  Star,
  GitFork,
  Search,
  ChevronDown,
  ChevronUp,
  Layers,
  Eye,
  X,
  CheckCircle2,
  Code2,
  Calendar,
  RefreshCw,
  AlertCircle,
  GitBranch,
  Info,
  ArrowRight,
} from 'lucide-react';
import { Project, GitHubUserProfile } from '@/types/portfolio';
import { Github } from '@/components/ui/DynamicIcon';

const REQUIRED_FILTER_CATEGORIES = [
  'All',
  'Web Development',
  'Frontend',
  'Backend',
  'Full Stack',
  'AI & Automation',
  'JavaScript',
  'TypeScript',
  'C / C++',
  'Management Systems',
  'Mobile Applications',
];

export interface EnrichedRepo {
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
  stargazers_count: number;
  language: string | null;
  forks_count: number;
  topics: string[];
  default_branch: string;
  display_title: string;
  verified_description: string;
  category: string;
  technologies: string[];
  attribution: string | null;
  historical_commits_note: string | null;
  live_url: string | null;
}

export function ProjectsAndGitHubSection({
  projects,
  githubUser,
  repositories,
  githubStats,
  fromCache,
  staleWarning,
  fetchedAt,
}: {
  projects: Project[];
  githubUser: GitHubUserProfile | null;
  repositories: EnrichedRepo[];
  githubStats: {
    public_repos: number;
    followers: number;
    following: number;
    total_stars: number;
    total_forks: number;
    language_distribution: { language: string; count: number; percentage: number }[];
    supplied_2025_contributions: number;
  };
  fromCache: boolean;
  staleWarning: string | null;
  fetchedAt: string | null;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showOtherRepos, setShowOtherRepos] = useState(true);
  const [repoFilterCategory, setRepoFilterCategory] = useState('All');
  const [repoSearch, setRepoSearch] = useState('');

  // Categories with matching projects only
  const matchingProjectCategories = useMemo(() => {
    return REQUIRED_FILTER_CATEGORIES.filter((cat) => {
      if (cat === 'All') return true;
      return projects.some(
        (p) =>
          p.category.toLowerCase() === cat.toLowerCase() ||
          p.primary_language?.toLowerCase() === cat.toLowerCase() ||
          p.technologies.some((t) => t.toLowerCase().includes(cat.toLowerCase()))
      );
    });
  }, [projects]);

  const filteredFeaturedProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCat =
        activeCategory === 'All' ||
        p.category.toLowerCase() === activeCategory.toLowerCase() ||
        p.primary_language?.toLowerCase() === activeCategory.toLowerCase() ||
        p.technologies.some((t) =>
          t.toLowerCase().includes(activeCategory.toLowerCase())
        );

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [projects, activeCategory, searchQuery]);

  // Distinct repositories in the "Other GitHub Repositories" section
  const featuredRepoNames = useMemo(
    () =>
      new Set(
        projects
          .filter((p) => p.featured && p.repo_name)
          .map((p) => p.repo_name!.toLowerCase())
      ),
    [projects]
  );

  const otherRepositories = useMemo(() => {
    return repositories.filter(
      (r) => !featuredRepoNames.has(r.name.toLowerCase())
    );
  }, [repositories, featuredRepoNames]);

  const matchingRepoCategories = useMemo(() => {
    return REQUIRED_FILTER_CATEGORIES.filter((cat) => {
      if (cat === 'All') return true;
      return otherRepositories.some(
        (r) =>
          r.category.toLowerCase() === cat.toLowerCase() ||
          r.language?.toLowerCase() === cat.toLowerCase() ||
          r.technologies.some((t) => t.toLowerCase().includes(cat.toLowerCase()))
      );
    });
  }, [otherRepositories]);

  const filteredOtherRepos = useMemo(() => {
    return otherRepositories.filter((r) => {
      const matchesCat =
        repoFilterCategory === 'All' ||
        r.category.toLowerCase() === repoFilterCategory.toLowerCase() ||
        r.language?.toLowerCase() === repoFilterCategory.toLowerCase() ||
        r.technologies.some((t) =>
          t.toLowerCase().includes(repoFilterCategory.toLowerCase())
        );
      const q = repoSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.display_title.toLowerCase().includes(q) ||
        r.verified_description.toLowerCase().includes(q) ||
        (r.language && r.language.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [otherRepositories, repoFilterCategory, repoSearch]);

  return (
    <>
      {/* =====================================================================
          PART 9 — FEATURED WORKS (LIAM TEMPLATE CLONE)
         ===================================================================== */}
      <section id="projects" className="py-24 bg-[#060D0C] border-t border-[#FACC15]/10">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#FACC15] block">
                MY PORTFOLIO
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white mt-1">
                Featured Works
              </h2>
              <p className="text-sm sm:text-base text-[#94A3B8] mt-2 max-w-2xl">
                A selection of modern web applications, digital solutions, and creative products built with clean code and thoughtful design.
              </p>
            </div>

            {/* Project Search Bar */}
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-[#FACC15] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects or technologies..."
                aria-label="Search projects"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0C1817] border border-[rgba(250,204,21,0.15)] text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#FACC15]"
              />
            </div>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap gap-2.5 mb-10">
            {matchingProjectCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#FACC15] text-[#0A1312] shadow-[0_2px_12px_rgba(250,204,21,0.3)]'
                    : 'bg-[#0C1817] border border-[rgba(250,204,21,0.12)] text-[#94A3B8] hover:text-[#FACC15] hover:border-[#FACC15]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects Editorial Grid */}
          {filteredFeaturedProjects.length === 0 ? (
            <div className="rounded-2xl bg-[#151B25] border border-[rgba(255,255,255,0.08)] p-12 text-center">
              <p className="text-base font-semibold text-[#F5F7FC]">
                No matching featured projects found.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#6C8CFF] text-white text-xs font-semibold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredFeaturedProjects.map((project) => {
                const hasLiveDemo = Boolean(
                  project.live_demo_url &&
                    project.live_demo_url.trim().startsWith('http')
                );

                return (
                  <article
                    key={project.id}
                    className="group rounded-2xl bg-[#0C1817] border border-[rgba(250,204,21,0.12)] overflow-hidden flex flex-col justify-between hover:border-[#FACC15] transition-all duration-300 shadow-xl"
                  >
                    <div>
                      {/* Project Preview Banner */}
                      <div className="relative aspect-[16/9] w-full bg-[#060D0C] overflow-hidden border-b border-[rgba(250,204,21,0.1)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            project.thumbnail_url ||
                            '/images/projects/noor-ul-quran.svg'
                          }
                          alt={project.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-1 rounded-md bg-[#060D0C]/90 backdrop-blur-md border border-[#FACC15]/30 text-[11px] font-semibold text-[#FACC15]">
                            {project.category}
                          </span>
                          {project.primary_language && (
                            <span className="px-2.5 py-1 rounded-md bg-[#060D0C]/90 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-white">
                              {project.primary_language}
                            </span>
                          )}
                        </div>
                        {project.stars > 0 && (
                          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#060D0C]/90 backdrop-blur-md border border-[#FACC15]/30 text-[11px] font-semibold text-[#FACC15] flex items-center gap-1">
                            <Star className="w-3 h-3 fill-[#FACC15]" />
                            <span>{project.stars}</span>
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-6 space-y-3">
                        <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#FACC15] transition-colors line-clamp-2">
                          {project.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed line-clamp-3">
                          {project.description}
                        </p>

                        {project.attribution_note && (
                          <p className="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            <span>{project.attribution_note}</span>
                          </p>
                        )}

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.technologies.slice(0, 5).map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 rounded-md bg-[#060D0C] border border-white/5 text-[11px] font-medium text-[#94A3B8]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="px-6 pb-6 pt-3 border-t border-white/5 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FACC15]/15 border border-[#FACC15]/30 text-xs font-semibold text-[#FACC15] hover:bg-[#FACC15] hover:text-[#0A1312] transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>

                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#10141C] border border-[rgba(255,255,255,0.08)] text-xs font-semibold text-[#F5F7FC] hover:border-[#6C8CFF] transition-all"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>
                      )}

                      {hasLiveDemo && (
                        <a
                          href={project.live_demo_url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#55D6BE]/15 border border-[#55D6BE]/30 text-xs font-semibold text-[#55D6BE] hover:bg-[#55D6BE] hover:text-[#090B10] transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live</span>
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* View All Projects Button (Exact Liam Template Match) */}
          <div className="mt-12 flex justify-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#FACC15] text-[#0A1312] font-bold text-xs hover:bg-[#EAB308] hover:shadow-[0_4px_20px_rgba(250,204,21,0.4)] transition-all"
            >
              <span>View All Projects</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Expandable "Other GitHub Repositories" */}
          <div className="mt-16 rounded-2xl bg-[#151B25] border border-[rgba(255,255,255,0.08)] overflow-hidden shadow-xl">
            <button
              type="button"
              onClick={() => setShowOtherRepos(!showOtherRepos)}
              aria-expanded={showOtherRepos}
              className="w-full px-6 py-5 flex items-center justify-between bg-[#10141C] hover:bg-[#151B25] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-10 h-10 rounded-xl bg-[#6C8CFF]/15 border border-[#6C8CFF]/30 flex items-center justify-center text-[#6C8CFF]">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#F5F7FC]">
                    Other GitHub Repositories ({otherRepositories.length})
                  </h3>
                  <p className="text-xs text-[#A5B0C0]">
                    Complete public repository inventory retrieved from github.com/Husnain0018
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#6C8CFF]">
                <span>{showOtherRepos ? 'Collapse Directory' : 'Expand All'}</span>
                {showOtherRepos ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>

            {showOtherRepos && (
              <div className="p-6 space-y-6 border-t border-[rgba(255,255,255,0.08)]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {matchingRepoCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setRepoFilterCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          repoFilterCategory === cat
                            ? 'bg-[#6C8CFF] text-white'
                            : 'bg-[#10141C] border border-[rgba(255,255,255,0.08)] text-[#A5B0C0] hover:text-[#F5F7FC]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full md:w-64">
                    <Search className="w-3.5 h-3.5 text-[#737F91] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="search"
                      value={repoSearch}
                      onChange={(e) => setRepoSearch(e.target.value)}
                      placeholder="Filter repositories..."
                      aria-label="Filter other repositories"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#10141C] border border-[rgba(255,255,255,0.08)] text-xs text-[#F5F7FC] placeholder-[#737F91] focus:outline-none focus:border-[#6C8CFF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOtherRepos.map((repo) => (
                    <div
                      key={repo.id}
                      className="rounded-xl bg-[#10141C] border border-[rgba(255,255,255,0.06)] p-5 flex flex-col justify-between hover:border-[rgba(255,255,255,0.15)] transition-all"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-[#F5F7FC] truncate">
                              {repo.display_title}
                            </h4>
                            <p className="text-[11px] font-mono text-[#6C8CFF] truncate">
                              {repo.name}
                            </p>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-[#151B25] border border-[rgba(255,255,255,0.08)] text-[10px] font-semibold text-[#55D6BE] shrink-0">
                            {repo.language || repo.category}
                          </span>
                        </div>

                        <p className="text-xs text-[#A5B0C0] leading-relaxed">
                          {repo.verified_description}
                        </p>

                        {repo.attribution && (
                          <p className="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded px-2 py-1">
                            {repo.attribution}
                          </p>
                        )}

                        {repo.historical_commits_note && (
                          <p className="text-[11px] text-[#737F91] flex items-center gap-1 font-mono">
                            <GitBranch className="w-3 h-3 text-[#A78BFA]" />
                            <span>{repo.historical_commits_note}</span>
                          </p>
                        )}
                      </div>

                      <div className="pt-4 mt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 text-[11px] text-[#737F91]">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-300" />
                            {repo.stargazers_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(repo.updated_at).toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-[#151B25] border border-[rgba(255,255,255,0.08)] text-[11px] font-semibold text-[#F5F7FC] hover:border-[#6C8CFF] inline-flex items-center gap-1"
                          >
                            <Github className="w-3 h-3" />
                            <span>Code</span>
                          </a>
                          {repo.live_url && (
                            <a
                              href={repo.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-[#55D6BE]/15 border border-[#55D6BE]/30 text-[11px] font-semibold text-[#55D6BE] hover:bg-[#55D6BE] hover:text-[#090B10] inline-flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Live</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
          PART 10 — OPEN SOURCE & GITHUB ACTIVITY
         ===================================================================== */}
      <section id="github" className="py-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#55D6BE] block">
                09 / OPEN SOURCE
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#F5F7FC] mt-2">
                Open Source &amp; GitHub Activity
              </h2>
              <p className="text-sm sm:text-base text-[#A5B0C0] mt-2">
                Explore my development journey, public repositories, and the technologies I work with.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {fetchedAt && (
                <span className="text-xs text-[#737F91] bg-[#151B25] border border-[rgba(255,255,255,0.08)] px-3 py-2 rounded-xl flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-[#55D6BE]" />
                  <span>
                    Synced: {new Date(fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </span>
              )}
              <a
                href={`https://github.com/${githubUser?.login || 'Husnain0018'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#151B25] border border-[rgba(255,255,255,0.12)] text-xs font-semibold text-[#F5F7FC] hover:border-[#6C8CFF]"
              >
                <Github className="w-4 h-4" />
                <span>Open @Husnain0018 on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {staleWarning && (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 flex items-center gap-3 text-xs text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{staleWarning}</span>
            </div>
          )}

          {/* GitHub Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="sm:col-span-2 lg:col-span-1 rounded-2xl bg-[#151B25] border border-[rgba(255,255,255,0.08)] p-5 flex items-center gap-4 shadow-lg">
              {githubUser?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={githubUser.avatar_url}
                  alt={githubUser.name || githubUser.login}
                  className="w-14 h-14 rounded-2xl border border-[rgba(255,255,255,0.1)] object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-[#6C8CFF]/20 flex items-center justify-center font-bold text-[#6C8CFF]">
                  AH
                </div>
              )}
              <div className="min-w-0">
                <p className="font-heading text-sm font-bold text-[#F5F7FC] truncate">
                  {githubUser?.name || 'Ali Husnain'}
                </p>
                <p className="text-xs text-[#6C8CFF] truncate">
                  @{githubUser?.login || 'Husnain0018'}
                </p>
                <p className="text-[11px] text-[#737F91] mt-1">
                  Active since Sep 2025
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#151B25] border border-[rgba(255,255,255,0.08)] p-5 shadow-lg">
              <span className="text-xs text-[#737F91]">Public Repositories</span>
              <p className="font-heading text-3xl font-extrabold text-[#F5F7FC] mt-1">
                {githubStats.public_repos}
              </p>
              <span className="text-[11px] text-[#55D6BE] font-medium">
                Verified via GitHub API
              </span>
            </div>

            <div className="rounded-2xl bg-[#151B25] border border-[rgba(255,255,255,0.08)] p-5 shadow-lg">
              <span className="text-xs text-[#737F91]">Total Stars Received</span>
              <p className="font-heading text-3xl font-extrabold text-amber-300 mt-1">
                {githubStats.total_stars}
              </p>
              <span className="text-[11px] text-[#737F91]">
                Across public repositories
              </span>
            </div>

            <div className="rounded-2xl bg-[#151B25] border border-[rgba(255,255,255,0.08)] p-5 shadow-lg">
              <span className="text-xs text-[#737F91]">Followers / Following</span>
              <p className="font-heading text-3xl font-extrabold text-[#6C8CFF] mt-1">
                {githubStats.followers}{' '}
                <span className="text-lg font-normal text-[#737F91]">
                  / {githubStats.following}
                </span>
              </p>
              <span className="text-[11px] text-[#737F91]">
                Live community connections
              </span>
            </div>

            <div className="rounded-2xl bg-[#151B25] border border-[rgba(255,255,255,0.08)] p-5 shadow-lg">
              <span className="text-xs text-[#737F91]">2025 Contribution Snapshot</span>
              <p className="font-heading text-3xl font-extrabold text-[#A78BFA] mt-1">
                {githubStats.supplied_2025_contributions}
              </p>
              <a
                href={`https://github.com/${githubUser?.login || 'Husnain0018'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#6C8CFF] hover:underline inline-flex items-center gap-1 font-medium"
              >
                <span>View live graph on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Language Breakdown & Recent Repositories */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 rounded-2xl bg-[#151B25] border border-[rgba(255,255,255,0.08)] p-6 space-y-5 shadow-lg">
              <div>
                <h3 className="font-heading text-base font-bold text-[#F5F7FC]">
                  Public Repository Languages
                </h3>
                <p className="text-xs text-[#737F91]">
                  Calculated from {repositories.length} public repositories
                </p>
              </div>

              {/* Stacked bar */}
              <div className="h-3 w-full rounded-full bg-[#10141C] overflow-hidden flex">
                {githubStats.language_distribution.map((item, i) => {
                  const colors = [
                    'bg-[#6C8CFF]',
                    'bg-[#55D6BE]',
                    'bg-[#A78BFA]',
                    'bg-emerald-400',
                    'bg-amber-300',
                    'bg-pink-400',
                  ];
                  return (
                    <div
                      key={item.language}
                      style={{ width: `${Math.max(item.percentage, 4)}%` }}
                      className={`${colors[i % colors.length]} h-full`}
                      title={`${item.language}: ${item.count} repos (${item.percentage}%)`}
                    />
                  );
                })}
              </div>

              <div className="space-y-3">
                {githubStats.language_distribution.map((item) => (
                  <div key={item.language} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#F5F7FC]">
                        {item.language}
                      </span>
                      <span className="text-[#737F91]">
                        {item.count} {item.count === 1 ? 'repo' : 'repos'} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#10141C] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#6C8CFF] to-[#55D6BE]"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Repos Feed */}
            <div className="lg:col-span-7 rounded-2xl bg-[#151B25] border border-[rgba(255,255,255,0.08)] p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-base font-bold text-[#F5F7FC]">
                    Recently Updated Repositories
                  </h3>
                  <p className="text-xs text-[#737F91]">
                    Ordered by latest push timestamp on GitHub
                  </p>
                </div>
                <Link
                  href="/projects"
                  className="text-xs font-semibold text-[#6C8CFF] hover:underline"
                >
                  Browse Full Page &rarr;
                </Link>
              </div>

              <div className="divide-y divide-[rgba(255,255,255,0.06)]">
                {repositories.slice(0, 6).map((repo) => (
                  <div
                    key={repo.id}
                    className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-bold text-[#F5F7FC] hover:text-[#6C8CFF] truncate"
                        >
                          {repo.name}
                        </a>
                        {repo.language && (
                          <span className="px-2 py-0.5 rounded bg-[#10141C] border border-[rgba(255,255,255,0.06)] text-[10px] font-semibold text-[#55D6BE]">
                            {repo.language}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-[#10141C] border border-[rgba(255,255,255,0.06)] text-[10px] text-[#737F91] font-mono">
                          {repo.default_branch}
                        </span>
                      </div>
                      <p className="text-xs text-[#A5B0C0] line-clamp-1">
                        {repo.verified_description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-[11px] text-[#737F91]">
                        {new Date(repo.updated_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      {repo.live_url && (
                        <a
                          href={repo.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-[#55D6BE]/15 border border-[#55D6BE]/30 text-[11px] font-semibold text-[#55D6BE] hover:bg-[#55D6BE] hover:text-[#090B10]"
                        >
                          Live
                        </a>
                      )}
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-[#10141C] border border-[rgba(255,255,255,0.08)] text-[11px] font-semibold text-[#F5F7FC] hover:border-[#6C8CFF]"
                      >
                        Repo
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details Modal */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedProject.title}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-[#151B25] border border-[rgba(255,255,255,0.12)] rounded-2xl overflow-hidden shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#10141C] border-b border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-md bg-[#6C8CFF]/15 border border-[#6C8CFF]/30 text-xs font-semibold text-[#6C8CFF]">
                  {selectedProject.category}
                </span>
                {selectedProject.primary_language && (
                  <span className="px-2.5 py-1 rounded-md bg-[#151B25] border border-[rgba(255,255,255,0.08)] text-xs font-medium text-[#55D6BE]">
                    {selectedProject.primary_language}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project details"
                className="p-2 rounded-lg bg-[#151B25] text-[#A5B0C0] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto space-y-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[#F5F7FC]">
                  {selectedProject.title}
                </h2>
                {selectedProject.historical_commits_note && (
                  <p className="text-xs text-[#55D6BE] mt-1 font-mono">
                    {selectedProject.historical_commits_note}
                  </p>
                )}
              </div>

              {selectedProject.thumbnail_url && (
                <div className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#090B10]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedProject.thumbnail_url}
                    alt={selectedProject.title}
                    className="w-full max-h-72 object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#6C8CFF]">
                  Project Overview
                </h3>
                <p className="text-sm text-[#A5B0C0] leading-relaxed">
                  {selectedProject.detailed_description || selectedProject.description}
                </p>
              </div>

              {selectedProject.problem_solved && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#55D6BE]">
                    Problem Being Solved
                  </h3>
                  <p className="text-sm text-[#A5B0C0] leading-relaxed">
                    {selectedProject.problem_solved}
                  </p>
                </div>
              )}

              {selectedProject.main_features &&
                selectedProject.main_features.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
                      Verified Features
                    </h3>
                    <ul className="space-y-2">
                      {selectedProject.main_features.map((feat, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-[#A5B0C0] flex items-start gap-2.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#55D6BE] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedProject.development_approach && (
                  <div className="p-4 rounded-xl bg-[#10141C] border border-[rgba(255,255,255,0.06)] space-y-1.5">
                    <h4 className="text-xs font-bold uppercase text-[#F5F7FC]">
                      Development Approach
                    </h4>
                    <p className="text-xs text-[#A5B0C0] leading-relaxed">
                      {selectedProject.development_approach}
                    </p>
                  </div>
                )}
                {selectedProject.future_improvements && (
                  <div className="p-4 rounded-xl bg-[#10141C] border border-[rgba(255,255,255,0.06)] space-y-1.5">
                    <h4 className="text-xs font-bold uppercase text-[#F5F7FC]">
                      Future Improvements
                    </h4>
                    <p className="text-xs text-[#A5B0C0] leading-relaxed">
                      {selectedProject.future_improvements}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-[#737F91]">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-lg bg-[#10141C] border border-[rgba(255,255,255,0.08)] text-xs font-semibold text-[#F5F7FC]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[rgba(255,255,255,0.08)] flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-3">
                  {selectedProject.github_url && (
                    <a
                      href={selectedProject.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#10141C] border border-[rgba(255,255,255,0.1)] text-xs font-semibold text-[#F5F7FC] hover:border-[#6C8CFF]"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub Repository</span>
                    </a>
                  )}
                  {selectedProject.live_demo_url && (
                    <a
                      href={selectedProject.live_demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#55D6BE] text-[#090B10] text-xs font-bold hover:opacity-95"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Launch Live Website</span>
                    </a>
                  )}
                </div>

                <Link
                  href={`/projects/${selectedProject.slug}`}
                  className="text-xs font-semibold text-[#6C8CFF] hover:underline"
                >
                  Open Dedicated Project Page &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
