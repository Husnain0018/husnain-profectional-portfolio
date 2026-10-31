import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { getPortfolioData } from '@/lib/db';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();
  const title =
    data.seo.site_title ||
    'Ali Husnain | Full-Stack Web Developer & Web Designer';
  const description =
    data.seo.meta_description ||
    'Explore the portfolio of Ali Husnain, a Computer Science student and NAVTTC-certified Full-Stack Web Developer. Discover web development projects, technical skills, GitHub repositories, and contact information.';
  const canonicalUrl =
    data.seo.canonical_domain && data.seo.canonical_domain.startsWith('http')
      ? data.seo.canonical_domain
      : undefined;

  return {
    title,
    description,
    keywords: data.seo.keywords,
    authors: [{ name: data.profile.full_name }],
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    openGraph: {
      title,
      description,
      type: 'website',
      images: data.seo.og_image_url ? [data.seo.og_image_url] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: data.seo.enable_indexing,
      follow: data.seo.enable_indexing,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getPortfolioData();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} dark scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased bg-[#060D0C] text-white font-sans transition-colors duration-200">
        <ThemeProvider defaultTheme={data.appearance.default_theme || 'dark'}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
