import {
  GitHubUserProfile,
  GitHubRepositoryRaw,
  Project,
} from '@/types/portfolio';
import { readLocalDb, writeLocalDb } from '@/lib/db';

const GITHUB_API_BASE = 'https://api.github.com';

// Supplied historical activity metadata from prompt for verified context
export const SUPPLIED_HISTORICAL_COMMITS: Record<string, string> = {
  'ai-site-weaver': 'July 2026 — 10 commits',
  'n8nali-site': 'June 2026 — 5 commits',
  'whatsapp-bot-ready': 'June 2026 — 3 commits',
  'Free-LLM': 'June 2026 — 2 commits',
  'academy-flow': 'May 2026 — 66 commits',
  'urban-print-spark': 'May 2026 — 14 commits',
  'Documentaries': 'May 2026 — 3 commits',
  'n8n': 'May 2026 — 1 commit',
  'innovate-assistant': 'May 2026 — 1 commit',
  'burger-ship-website-launch': 'March 2026 — 19 commits',
  'eid-wishes-bliss': 'March 2026 — 6 commits',
  'eid-blessings-hub': 'March 2026 — 6 commits',
  'HTML_CSS_Basic': 'March 2026 — 5 commits',
  'Noor-ul-Quran': 'February 2026 — 5 commits',
  'quran-clone-complete': 'February 2026 — 1 commit',
  'printopia-manager': 'February 2026 — 2 commits',
  'Student-Management-System-using-Doubly-Linked-List': 'January 2026 — 4 commits',
  'BST-and-AVL-Tree-Project-in-C-': 'January 2026 — 2 commits',
  'text-based-dungeon-crawler-game-': 'January 2026 — 1 commit',
  'YOU-TUBE-CLONE-': 'January 2026 — 1 commit',
  'QR-code-generater': 'December 2025 — 3 commits',
  'MINI-JARVIS': 'December 2025 — 2 commits',
  'PORTFOLIO-WEBSITE': 'November 2025 — 2 commits',
  'C-PROGRAMS': 'November 2025 — 1 commit',
  'Premium-JavaScript': 'November 2025 — 1 commit',
  'glowing': 'October 2025 — 12 commits',
  '-User-Management-Dashboard': 'October 2025 — 10 commits',
  '-User_Management_Dashboard': 'October 2025 — 1 commit',
  'Kanbaneve': 'September 2025 — 2 commits',
  'js': 'September 2025 — 1 commit',
};

// Verified accurate descriptions for repositories with null GitHub descriptions
const VERIFIED_REPO_DESCRIPTIONS: Record<string, {
  title: string;
  description: string;
  category: string;
  technologies: string[];
  attribution?: string;
}> = {
  'PORTFOLIO-WEBSITE': {
    title: 'Personal Portfolio Website (Initial HTML/CSS Edition)',
    description: 'Responsive developer portfolio template built with HTML5, CSS3 animations, and Font Awesome icons.',
    category: 'Frontend',
    technologies: ['HTML5', 'CSS3', 'Responsive Design'],
  },
  'Free-LLM': {
    title: 'Free-LLM — Unified OpenAI-Compatible Multi-Provider Router',
    description: 'TypeScript & Docker-ready LLM gateway aggregating free tiers across 16 AI providers into a unified OpenAI-compatible API endpoint.',
    category: 'AI & Automation',
    technologies: ['TypeScript', 'Node.js', 'Docker', 'LLM API'],
    attribution: 'Adapted and deployed from open-source FreeLLMAPI architecture.',
  },
  'whatsapp-bot-ready': {
    title: 'WhatsApp AI Automation Bot & Webhook Server',
    description: 'Node.js and Express.js WhatsApp automation server using whatsapp-web.js, Puppeteer, and webhook endpoints.',
    category: 'AI & Automation',
    technologies: ['Node.js', 'Express.js', 'whatsapp-web.js', 'Puppeteer', 'JavaScript'],
  },
  'n8nali-site': {
    title: 'n8n Automation Services & Workflow Landing Site',
    description: 'Multi-page web interface (index, services, privacy) presenting AI workflow and n8n automation services.',
    category: 'AI & Automation',
    technologies: ['HTML5', 'CSS3', 'Automation Workflows'],
  },
  'n8n': {
    title: 'n8n Workflow Deployment & Showcase',
    description: 'Live Vercel web deployment showcasing n8n workflow automation concepts.',
    category: 'AI & Automation',
    technologies: ['n8n', 'Workflow Automation', 'Web'],
  },
  'The_Urben_Prints-': {
    title: 'The Urban Prints — Brand & Printing Repository',
    description: 'Public GitHub project repository initialized for Urban Prints web presence.',
    category: 'Web Development',
    technologies: ['Web Development'],
  },
  'Documentaries': {
    title: 'Documentaries — Interactive Media Showcase Page',
    description: 'Responsive HTML5 web showcase for browsing curated documentary content, deployed live on Vercel.',
    category: 'Frontend',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
  },
  'correct_Nano_Banana-': {
    title: 'Nano Banana — Next.js & Framer Motion Interactive Showcase',
    description: 'Modern Next.js and React interactive product showcase using Framer Motion animations and Lucide icons.',
    category: 'Frontend',
    technologies: ['Next.js', 'React.js', 'Framer Motion', 'JavaScript'],
  },
  'Coffee_Shop': {
    title: 'Coffee Shop Website — Cozy Cafe UI & Menu Experience',
    description: 'Modern, responsive coffee shop website showcasing menu items, video ambiance, and smooth UI/UX browsing.',
    category: 'Frontend',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI'],
  },
  'Flavor_site': {
    title: 'Flavor Site — Next.js & TypeScript Animated Web Experience',
    description: 'TypeScript and Next.js frontend application utilizing React and Framer Motion transitions.',
    category: 'TypeScript',
    technologies: ['TypeScript', 'Next.js', 'React.js', 'Framer Motion'],
  },
  'Nano_Banana': {
    title: 'Nano Banana (TypeScript Edition)',
    description: 'Next.js, React, TypeScript, and Framer Motion web application deployed on Vercel.',
    category: 'TypeScript',
    technologies: ['TypeScript', 'Next.js', 'React.js', 'Framer Motion'],
  },
  'MJ-AI-ASSISTENT': {
    title: 'MJ AI Assistant — Gemini Live & SQLite Task Assistant',
    description: 'Full-stack AI assistant built with React, TypeScript, Express, better-sqlite3, and Google Gemini API (@google/genai).',
    category: 'AI & Automation',
    technologies: ['TypeScript', 'React.js', 'Gemini API', 'Express.js', 'SQLite'],
  },
  'Zoya_Ai-assistent': {
    title: 'Zoya AI Assistant — Browser-Based Gemini Task Assistant',
    description: 'Interactive AI assistant powered by Google Gemini (@google/genai), React, TypeScript, and Tailwind CSS.',
    category: 'AI & Automation',
    technologies: ['TypeScript', 'React.js', 'Gemini API', 'Tailwind CSS', 'Vite'],
  },
  'HTML_CSS_Basic': {
    title: 'HTML5 & CSS3 Fundamental Web Layouts',
    description: 'Collection of foundational HTML5 and CSS3 layout exercises and responsive web design components.',
    category: 'Frontend',
    technologies: ['HTML5', 'CSS3'],
  },
  'Noor-ul-Quran': {
    title: 'Noor-ul-Quran — Digital Quran & Islamic Learning Platform',
    description: 'Full-stack TypeScript & React application built with Supabase, Tailwind CSS, and Radix UI primitives.',
    category: 'Full Stack',
    technologies: ['TypeScript', 'React.js', 'Supabase', 'Tailwind CSS', 'shadcn/ui'],
  },
  'text-based-dungeon-crawler-game-': {
    title: 'Text-Based Dungeon Crawler Game in C++',
    description: 'Object-oriented C++ CLI adventure game featuring procedural dungeon navigation, linked lists, combat, and inventory.',
    category: 'C / C++',
    technologies: ['C++', 'OOP', 'Linked Lists', 'CLI Game'],
  },
  'Student-Management-System-using-Doubly-Linked-List': {
    title: 'Student Management System (Doubly Linked List in C++)',
    description: 'Academic C++ data structures project implementing student record CRUD operations via a custom Doubly Linked List.',
    category: 'C / C++',
    technologies: ['C++', 'Doubly Linked List', 'Data Structures'],
  },
  'BST-and-AVL-Tree-Project-in-C-': {
    title: 'BST & AVL Self-Balancing Tree Builder in C++',
    description: 'C++ program implementing Binary Search Trees (BST) and AVL Trees with Inorder, Preorder, and Postorder traversals.',
    category: 'C / C++',
    technologies: ['C++', 'AVL Tree', 'Binary Search Tree', 'Algorithms'],
  },
  'YOU-TUBE-CLONE-': {
    title: 'YouTube Clone — React JS & Material UI Video Platform',
    description: 'Modern video browsing web application built with React.js, Material UI 5, and RapidAPI video feeds.',
    category: 'Frontend',
    technologies: ['React.js', 'JavaScript', 'Material UI', 'REST API'],
    attribution: 'Built following JavaScript Mastery React/MUI curriculum.',
  },
  'QR-code-generater': {
    title: 'Advanced QR Code Generator & Scanner (Web + Capacitor)',
    description: 'Web and Capacitor hybrid mobile tool for generating custom-colored QR codes, scanning, history, and dark/light mode.',
    category: 'Mobile Applications',
    technologies: ['JavaScript', 'Capacitor', 'HTML5', 'CSS3'],
  },
  'MINI-JARVIS': {
    title: 'Mini Jarvis — Browser Voice & Command Assistant UI',
    description: 'Interactive sci-fi inspired voice and command assistant frontend built with HTML5, CSS3, and JavaScript Speech APIs.',
    category: 'AI & Automation',
    technologies: ['JavaScript', 'HTML5', 'CSS3', 'Web Speech API'],
  },
  'C-PROGRAMS': {
    title: 'C Programming Fundamentals & Algorithms',
    description: 'Repository of foundational C programming exercises, control structures, arrays, functions, and pointers.',
    category: 'C / C++',
    technologies: ['C', 'Algorithms', 'Systems Programming'],
  },
  'Premium-JavaScript': {
    title: 'Premium JavaScript — ES6+ Concepts & DOM Projects',
    description: 'Hands-on JavaScript repository practicing modern ES6+ syntax, DOM manipulation, and interactive browser scripting.',
    category: 'JavaScript',
    technologies: ['JavaScript', 'ES6+', 'DOM'],
  },
  '-User_Management_Dashboard': {
    title: 'User Management Dashboard (Node.js & Frontend UI)',
    description: 'Administrative user management interface paired with a Node.js backend script and live Vercel deployment.',
    category: 'Web Development',
    technologies: ['JavaScript', 'Node.js', 'HTML5', 'CSS3'],
  },
  '-User-Management-Dashboard': {
    title: 'User Management Dashboard (UI Edition)',
    description: 'Responsive administrative dashboard layout deployed on Vercel for user directory management.',
    category: 'Frontend',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
  },
  'glowing': {
    title: 'Glowing — E-Commerce Skincare Storefront UI',
    description: 'Responsive e-commerce landing page with product carousels, pricing badges, and clean CSS architecture.',
    category: 'Frontend',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    attribution: 'Adapted from codewithsadee Glowing UI template.',
  },
  'Kanbaneve': {
    title: 'Kanbaneve — Kanban Workflow Board',
    description: 'Task management Kanban board built with JavaScript, Vite, and Tailwind CSS.',
    category: 'Frontend',
    technologies: ['JavaScript', 'Tailwind CSS', 'Vite'],
  },
  'js': {
    title: 'JavaScript Starter Repository',
    description: 'First public repository created on GitHub in September 2025 exploring HTML and JavaScript fundamentals.',
    category: 'JavaScript',
    technologies: ['JavaScript', 'HTML5'],
  },
};

function getGitHubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'Ali-Husnain-Portfolio-App',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export async function fetchGitHubProfileAndRepos(
  username = process.env.GITHUB_USERNAME || 'Husnain0018',
  forceRefresh = false
): Promise<{
  user: GitHubUserProfile | null;
  repos: GitHubRepositoryRaw[];
  fromCache: boolean;
  staleWarning?: string;
  fetchedAt: string | null;
}> {
  const db = readLocalDb();
  const cacheAgeMs = db.github_cache.fetched_at
    ? Date.now() - new Date(db.github_cache.fetched_at).getTime()
    : Infinity;
  const maxAgeMs = (db.github_config.auto_refresh_minutes || 30) * 60 * 1000;

  if (!forceRefresh && db.github_cache.user && db.github_cache.repos.length > 0 && cacheAgeMs < maxAgeMs) {
    return {
      user: db.github_cache.user,
      repos: db.github_cache.repos,
      fromCache: true,
      fetchedAt: db.github_cache.fetched_at,
    };
  }

  try {
    const userRes = await fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`, {
      headers: getGitHubHeaders(),
      next: { revalidate: 1800 },
    });

    if (!userRes.ok) {
      throw new Error(`GitHub user API returned HTTP ${userRes.status}`);
    }

    const user = (await userRes.json()) as GitHubUserProfile;

    // Paginate through all public repos (100 per page)
    let allRepos: GitHubRepositoryRaw[] = [];
    let page = 1;
    while (true) {
      const reposRes = await fetch(
        `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100&page=${page}`,
        {
          headers: getGitHubHeaders(),
          next: { revalidate: 1800 },
        }
      );

      if (!reposRes.ok) {
        throw new Error(`GitHub repos API returned HTTP ${reposRes.status}`);
      }

      const pageRepos = (await reposRes.json()) as GitHubRepositoryRaw[];
      allRepos = allRepos.concat(pageRepos);

      if (pageRepos.length < 100 || page >= 5) {
        break;
      }
      page++;
    }

    const nowIso = new Date().toISOString();
    db.github_cache = {
      user,
      repos: allRepos,
      fetched_at: nowIso,
    };
    db.github_config.last_synced_at = nowIso;
    db.github_config.sync_status = 'success';
    db.github_config.last_error = null;
    writeLocalDb(db);

    return {
      user,
      repos: allRepos,
      fromCache: false,
      fetchedAt: nowIso,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown GitHub API error';
    db.github_config.sync_status = 'error';
    db.github_config.last_error = message;
    writeLocalDb(db);

    if (db.github_cache.user && db.github_cache.repos.length > 0) {
      return {
        user: db.github_cache.user,
        repos: db.github_cache.repos,
        fromCache: true,
        staleWarning: `Serving cached GitHub data (${message})`,
        fetchedAt: db.github_cache.fetched_at,
      };
    }

    return {
      user: null,
      repos: [],
      fromCache: true,
      staleWarning: `Unable to reach GitHub API (${message})`,
      fetchedAt: null,
    };
  }
}

export async function syncGitHubRepositoriesToProjects(): Promise<{
  success: boolean;
  totalRepos: number;
  newReposAdded: number;
  updatedProjects: number;
  syncedAt: string | null;
  error?: string;
}> {
  const db = readLocalDb();
  const username = db.github_config.username || process.env.GITHUB_USERNAME || 'Husnain0018';

  const result = await fetchGitHubProfileAndRepos(username, true);
  if (!result.user && result.repos.length === 0) {
    return {
      success: false,
      totalRepos: 0,
      newReposAdded: 0,
      updatedProjects: 0,
      syncedAt: db.github_config.last_synced_at,
      error: result.staleWarning || 'Failed to synchronize with GitHub API.',
    };
  }

  let updatedProjects = 0;
  const newReposAdded = 0;

  // Update metadata on existing linked portfolio projects while preserving manual admin descriptions/settings
  const updatedList: Project[] = db.projects.map((proj) => {
    const matchedRepo = result.repos.find(
      (r) =>
        (proj.repo_name && r.name.toLowerCase() === proj.repo_name.toLowerCase()) ||
        (proj.github_url && proj.github_url.toLowerCase().endsWith(`/${r.name.toLowerCase()}`))
    );

    if (matchedRepo) {
      updatedProjects++;
      return {
        ...proj,
        stars: matchedRepo.stargazers_count,
        forks: matchedRepo.forks_count,
        is_fork: matchedRepo.fork,
        primary_language: matchedRepo.language || proj.primary_language,
        default_branch: matchedRepo.default_branch,
        topics: matchedRepo.topics && matchedRepo.topics.length > 0 ? matchedRepo.topics : proj.topics,
        repo_created_at: matchedRepo.created_at,
        repo_updated_at: matchedRepo.updated_at,
        live_demo_url: proj.live_demo_url || (matchedRepo.homepage ? matchedRepo.homepage : null),
        is_github_synced: true,
      };
    }
    return proj;
  });

  db.projects = updatedList;
  writeLocalDb(db);

  return {
    success: true,
    totalRepos: result.repos.length,
    newReposAdded,
    updatedProjects,
    syncedAt: result.fetchedAt,
  };
}

export function enrichRepositoryForDisplay(repo: GitHubRepositoryRaw) {
  const meta = VERIFIED_REPO_DESCRIPTIONS[repo.name];
  const historicalNote = SUPPLIED_HISTORICAL_COMMITS[repo.name] || null;

  const inferredCategory =
    meta?.category ||
    (repo.language === 'TypeScript'
      ? 'TypeScript'
      : repo.language === 'JavaScript'
      ? 'JavaScript'
      : repo.language === 'C++' || repo.language === 'C'
      ? 'C / C++'
      : 'Web Development');

  const inferredTech =
    meta?.technologies ||
    [repo.language || 'Web', ...(repo.topics || [])].filter(Boolean);

  return {
    ...repo,
    display_title: meta?.title || repo.name.replace(/[-_]+/g, ' ').trim(),
    verified_description:
      repo.description ||
      meta?.description ||
      `Public ${repo.language || 'software'} repository maintained by Ali Husnain on GitHub.`,
    category: inferredCategory,
    technologies: inferredTech,
    attribution: meta?.attribution || null,
    historical_commits_note: historicalNote,
    live_url: repo.homepage && repo.homepage.startsWith('http') ? repo.homepage : null,
  };
}
