import React from 'react';
import { getPortfolioData } from '@/lib/db';
import {
  fetchGitHubProfileAndRepos,
  enrichRepositoryForDisplay,
} from '@/lib/github';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  HeroSection,
  AboutSection,
  SkillsSection,
  JourneyEducationCertificationsSection,
  ServicesAndStrengthsSection,
} from '@/components/sections/PublicSections';
import { ProjectsAndGitHubSection } from '@/components/projects/ProjectsAndGitHubSection';
import {
  TestimonialsSection,
  PricingPlansSection,
} from '@/components/sections/TestimonialsAndPricingSection';
import { ContactSection } from '@/components/forms/ContactSection';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const data = await getPortfolioData();
  const ghResult = await fetchGitHubProfileAndRepos(
    data.github_config.username || 'Husnain0018',
    false
  );

  const excludedSet = new Set(
    (data.github_config.excluded_repos || []).map((r) => r.toLowerCase())
  );

  const enrichedRepos = ghResult.repos
    .filter((r) => !excludedSet.has(r.name.toLowerCase()))
    .filter((r) => (data.github_config.hide_forks ? !r.fork : true))
    .map(enrichRepositoryForDisplay);

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

  const visibleSkills = data.skills
    .filter((s) => s.is_visible)
    .sort((a, b) => a.display_order - b.display_order);

  const publishedProjects = data.projects
    .filter((p) => p.published && p.featured)
    .sort((a, b) => a.display_order - b.display_order);

  const sortedEducation = [...data.education].sort(
    (a, b) => a.display_order - b.display_order
  );
  const sortedCertifications = [...data.certifications].sort(
    (a, b) => a.display_order - b.display_order
  );
  const sortedExperience = [...data.experience].sort(
    (a, b) => a.display_order - b.display_order
  );
  const visibleServices = data.services
    .filter((s) => s.is_visible)
    .sort((a, b) => a.display_order - b.display_order);
  const visibleSocials = data.social_links
    .filter((s) => s.is_visible && s.url.trim().length > 0)
    .sort((a, b) => a.display_order - b.display_order);

  // Person Schema JSON-LD for SEO
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.profile.full_name,
    jobTitle: data.profile.professional_title,
    description: data.seo.meta_description,
    email: `mailto:${data.profile.email}`,
    telephone: data.profile.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Gujranwala',
      addressCountry: 'PK',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'University of Gujrat',
    },
    sameAs: visibleSocials.map((s) => s.url),
  };

  return (
    <div className="min-h-screen bg-[#060D0C] text-white selection:bg-[#FACC15] selection:text-[#0A1312]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <Navbar profile={data.profile} appearance={data.appearance} />

      <main>
        <HeroSection
          profile={data.profile}
          publicRepoCount={ghResult.user?.public_repos ?? ghResult.repos.length}
        />

        <AboutSection profile={data.profile} />

        <ServicesAndStrengthsSection services={visibleServices} />

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

        <TestimonialsSection />

        <PricingPlansSection />

        <SkillsSection skills={visibleSkills} />

        <JourneyEducationCertificationsSection
          education={sortedEducation}
          certifications={sortedCertifications}
          experience={sortedExperience}
        />

        <ContactSection
          profile={data.profile}
          socialLinks={visibleSocials}
        />
      </main>

      <Footer
        profile={data.profile}
        socialLinks={visibleSocials}
        appearance={data.appearance}
      />
    </div>
  );
}
