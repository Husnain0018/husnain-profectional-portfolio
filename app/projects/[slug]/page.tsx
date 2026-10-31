import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Star,
  GitFork,
  Calendar,
  Code2,
} from 'lucide-react';
import { Github } from '@/components/ui/DynamicIcon';
import { getPortfolioData } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPortfolioData();
  const project = data.projects.find(
    (p) => p.slug.toLowerCase() === slug.toLowerCase()
  );

  if (!project || !project.published) {
    notFound();
  }

  const visibleSocials = data.social_links
    .filter((s) => s.is_visible && s.url.trim().length > 0)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="min-h-screen bg-[#090B10] text-[#F5F7FC]">
      <Navbar profile={data.profile} appearance={data.appearance} />

      <main className="pt-28 pb-24 max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#6C8CFF] hover:text-[#55D6BE] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Selected Work</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="px-3 py-1 rounded-md bg-[#6C8CFF]/15 border border-[#6C8CFF]/30 text-xs font-semibold text-[#6C8CFF]">
              {project.category}
            </span>
            {project.primary_language && (
              <span className="px-3 py-1 rounded-md bg-[#151B25] border border-[rgba(255,255,255,0.08)] text-xs font-semibold text-[#55D6BE]">
                {project.primary_language}
              </span>
            )}
            {project.stars > 0 && (
              <span className="px-3 py-1 rounded-md bg-[#151B25] border border-[rgba(255,255,255,0.08)] text-xs font-semibold text-amber-300 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                {project.stars} Stars
              </span>
            )}
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5F7FC] leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-[#A5B0C0] mt-4 leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#151B25] border border-[rgba(255,255,255,0.12)] text-sm font-semibold text-[#F5F7FC] hover:border-[#6C8CFF] transition-all"
              >
                <Github className="w-4 h-4" />
                <span>View Source on GitHub</span>
              </a>
            )}
            {project.live_demo_url && (
              <a
                href={project.live_demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#6C8CFF] to-[#A78BFA] text-sm font-semibold text-white shadow-lg"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Launch Live Deployment</span>
              </a>
            )}
          </div>
        </div>

        {/* Project Thumbnail */}
        {project.thumbnail_url && (
          <div className="rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.09)] bg-[#151B25] shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.thumbnail_url}
              alt={project.title}
              className="w-full max-h-[480px] object-cover"
            />
          </div>
        )}

        {/* Technical Specification Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <section className="rounded-2xl bg-[#151B25] border border-[rgba(255,255,255,0.08)] p-6 sm:p-8 space-y-3">
              <h2 className="font-heading text-lg font-bold text-[#F5F7FC]">Project Overview</h2>
              <p className="text-sm sm:text-base text-[#A5B0C0] leading-relaxed">
                {project.detailed_description}
              </p>
            </section>

            {project.problem_solved && (
              <section className="rounded-2xl bg-[#151B25] border border-[rgba(255,255,255,0.08)] p-6 sm:p-8 space-y-3">
                <h2 className="font-heading text-lg font-bold text-[#F5F7FC]">
                  Problem Being Solved
                </h2>
                <p className="text-sm sm:text-base text-[#A5B0C0] leading-relaxed">
                  {project.problem_solved}
                </p>
              </section>
            )}

            {project.main_features && project.main_features.length > 0 && (
              <section className="rounded-2xl bg-[#151B25] border border-[rgba(255,255,255,0.08)] p-6 sm:p-8 space-y-4">
                <h2 className="font-heading text-lg font-bold text-[#F5F7FC]">
                  Verified Features
                </h2>
                <ul className="space-y-3">
                  {project.main_features.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm sm:text-base text-[#A5B0C0]"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#55D6BE] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {project.development_approach && (
              <section className="rounded-2xl bg-[#151B25] border border-[rgba(255,255,255,0.08)] p-6 sm:p-8 space-y-3">
                <h2 className="font-heading text-lg font-bold text-[#F5F7FC]">
                  Development Approach
                </h2>
                <p className="text-sm sm:text-base text-[#A5B0C0] leading-relaxed">
                  {project.development_approach}
                </p>
              </section>
            )}

            {project.future_improvements && (
              <section className="rounded-2xl bg-[#151B25] border border-[rgba(255,255,255,0.08)] p-6 sm:p-8 space-y-3">
                <h2 className="font-heading text-lg font-bold text-[#F5F7FC]">
                  Future Improvements
                </h2>
                <p className="text-sm sm:text-base text-[#A5B0C0] leading-relaxed">
                  {project.future_improvements}
                </p>
              </section>
            )}
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl bg-[#151B25] border border-[rgba(255,255,255,0.08)] p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FC]">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg bg-[#10141C] border border-[rgba(255,255,255,0.08)] text-xs font-semibold text-[#55D6BE]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#151B25] border border-[rgba(255,255,255,0.08)] p-6 space-y-3 text-xs text-[#A5B0C0]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FC]">
                Repository Metadata
              </h3>
              {project.repo_name && (
                <div className="flex justify-between py-1.5 border-b border-[rgba(255,255,255,0.06)]">
                  <span>Repository</span>
                  <span className="font-mono text-[#F5F7FC]">{project.repo_name}</span>
                </div>
              )}
              {project.primary_language && (
                <div className="flex justify-between py-1.5 border-b border-[rgba(255,255,255,0.06)]">
                  <span>Primary Language</span>
                  <span className="text-[#F5F7FC] font-semibold">
                    {project.primary_language}
                  </span>
                </div>
              )}
              {project.repo_created_at && (
                <div className="flex justify-between py-1.5 border-b border-[rgba(255,255,255,0.06)]">
                  <span>Created</span>
                  <span className="text-[#F5F7FC]">
                    {new Date(project.repo_created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
              {project.historical_commits_note && (
                <div className="pt-2 text-[#6C8CFF] font-mono">
                  {project.historical_commits_note}
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      <Footer
        profile={data.profile}
        socialLinks={visibleSocials}
        appearance={data.appearance}
      />
    </div>
  );
}
