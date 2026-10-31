import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getPortfolioData } from '@/lib/db';
import {
  fetchGitHubProfileAndRepos,
  enrichRepositoryForDisplay,
} from '@/lib/github';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProjectsAndGitHubSection } from '@/components/projects/ProjectsAndGitHubSection';

export const dynamic = 'force-dynamic';

export default async function AllProjectsPage() {
  const data = await getPortfolioData();
  const ghResult = await fetchGitHubProfileAndRepos(
    data.github_config.username || 'Husnain0018',
    false
  );

  const enrichedRepos = ghResult.repos.map(enrichRepositoryForDisplay);

  const languageCounts: Record<string, number> = {};
  let totalStars = 0;
  let totalForks = 0;

  for (const r of ghResult.repos) {
    totalStars += r.stargazers_count || 0;
    totalForks += r.forks_count || 0;
    if (r.language) {
      languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
    }
  }

  const totalLangRepos =
    Object.values(languageCounts).reduce((a, b) => a + b, 0) || 1;
  const languageDistribution = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([language, count]) => ({
      language,
      count,
      percentage: Math.round((count / totalLangRepos) * 100),
    }));

  const publishedProjects = data.projects
    .filter((p) => p.published)
    .sort((a, b) => a.display_order - b.display_order);

  const visibleSocials = data.social_links
    .filter((s) => s.is_visible && s.url.trim().length > 0)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="min-h-screen bg-[#090B10] text-[#F5F7FC]">
      <Navbar profile={data.profile} appearance={data.appearance} />

      <div className="pt-28 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6C8CFF] hover:text-[#55D6BE] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home Overview</span>
        </Link>
      </div>

      <ProjectsAndGitHubSection
        projects={publishedProjects}
        githubUser={ghResult.user}
        repositories={enrichedRepos}
        githubStats={{
          public_repos: ghResult.user?.public_repos ?? ghResult.repos.length,
          followers: ghResult.user?.followers ?? 0,
          following: ghResult.user?.following ?? 0,
          total_stars: totalStars,
          total_forks: totalForks,
          language_distribution: languageDistribution,
          supplied_2025_contributions: 46,
        }}
        fromCache={ghResult.fromCache}
        staleWarning={ghResult.staleWarning || null}
        fetchedAt={ghResult.fetchedAt}
      />

      <Footer
        profile={data.profile}
        socialLinks={visibleSocials}
        appearance={data.appearance}
      />
    </div>
  );
}
