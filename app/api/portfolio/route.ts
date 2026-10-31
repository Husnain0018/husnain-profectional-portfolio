import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioData } from '@/lib/db';
import { fetchGitHubProfileAndRepos, enrichRepositoryForDisplay } from '@/lib/github';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const data = await getPortfolioData();
    const forceRefresh = req.nextUrl.searchParams.get('refresh') === '1';

    const ghResult = await fetchGitHubProfileAndRepos(
      data.github_config.username || 'Husnain0018',
      forceRefresh
    );

    const excludedSet = new Set(
      (data.github_config.excluded_repos || []).map((r) => r.toLowerCase())
    );

    const enrichedRepos = ghResult.repos
      .filter((r) => !excludedSet.has(r.name.toLowerCase()))
      .filter((r) => (data.github_config.hide_forks ? !r.fork : true))
      .map(enrichRepositoryForDisplay);

    // Compute accurate language distribution and star count from verified GitHub repos
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

    const totalLangRepos = Object.values(languageCounts).reduce((a, b) => a + b, 0) || 1;
    const languageDistribution = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([language, count]) => ({
        language,
        count,
        percentage: Math.round((count / totalLangRepos) * 100),
      }));

    // Return public-safe portfolio payload (never expose contact_messages or admin_auth)
    return NextResponse.json({
      profile: data.profile,
      skills: data.skills.filter((s) => s.is_visible).sort((a, b) => a.display_order - b.display_order),
      projects: data.projects.filter((p) => p.published).sort((a, b) => a.display_order - b.display_order),
      education: data.education.sort((a, b) => a.display_order - b.display_order),
      certifications: data.certifications.sort((a, b) => a.display_order - b.display_order),
      experience: data.experience.sort((a, b) => a.display_order - b.display_order),
      services: data.services.filter((s) => s.is_visible).sort((a, b) => a.display_order - b.display_order),
      social_links: data.social_links.filter((s) => s.is_visible && s.url.trim().length > 0).sort((a, b) => a.display_order - b.display_order),
      appearance: data.appearance,
      seo: data.seo,
      github: {
        user: ghResult.user,
        repositories: enrichedRepos,
        stats: {
          public_repos: ghResult.user?.public_repos ?? ghResult.repos.length,
          followers: ghResult.user?.followers ?? 0,
          following: ghResult.user?.following ?? 0,
          total_stars: totalStars,
          total_forks: totalForks,
          language_distribution: languageDistribution,
          supplied_2025_contributions: 46,
        },
        from_cache: ghResult.fromCache,
        stale_warning: ghResult.staleWarning || null,
        fetched_at: ghResult.fetchedAt,
      },
      storage_mode: data.storage_mode,
      last_content_update: data.last_content_update,
    });
  } catch (err) {
    console.error('Error in GET /api/portfolio:', err);
    return NextResponse.json(
      { error: 'Failed to load portfolio data.' },
      { status: 500 }
    );
  }
}
