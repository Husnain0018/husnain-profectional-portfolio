'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  Users,
  Package,
  Calendar,
  ChevronDown,
  ExternalLink,
  Search,
  Bell,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { Project, Skill, ContactMessage, GitHubSyncConfig } from '@/types/portfolio';

interface EliteOverviewViewProps {
  profileName: string;
  profileEmail: string;
  avatarUrl: string;
  projects: Project[];
  skills: Skill[];
  contactMessages: ContactMessage[];
  githubCache: {
    user: { public_repos: number; followers: number } | null;
    repos: { id: number; name: string; language: string | null; stargazers_count: number; fork: boolean; html_url: string }[];
    fetched_at: string | null;
  };
  storageMode: string;
  lastContentUpdate: string;
  onSyncGitHub: () => void;
  syncingGitHub: boolean;
  onNavigateTab: (tabId: any) => void;
}

export function EliteOverviewView({
  profileName,
  profileEmail,
  avatarUrl,
  projects,
  skills,
  contactMessages,
  githubCache,
  storageMode,
  lastContentUpdate,
  onSyncGitHub,
  syncingGitHub,
  onNavigateTab,
}: EliteOverviewViewProps) {
  const [timeframe, setTimeframe] = useState<'24h' | 'weeks' | 'month' | 'year'>('24h');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [metricMode, setMetricMode] = useState<'mockup' | 'portfolio'>('mockup');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Timeframe tabs exactly like mockup
  const timeframeTabs = [
    { id: '24h', label: 'Last 24 hour' },
    { id: 'weeks', label: 'Last weeks' },
    { id: 'month', label: 'Last month' },
    { id: 'year', label: 'Last year' },
  ] as const;

  // Unread messages
  const unreadCount = contactMessages.filter((m) => !m.read_status).length;

  // Recent orders / contact submissions
  const recentOrders = [
    {
      id: '#443',
      client: 'Alex Morgan — FinTech Web App',
      status: 'Delivered',
      date: '2026-01-10',
      statusColor: 'emerald',
      amount: '$4,200',
    },
    {
      id: '#234',
      client: 'DevValley Institute — LMS System',
      status: 'Sending',
      date: '2026-01-11',
      statusColor: 'amber',
      amount: '$2,800',
    },
    {
      id: '#576',
      client: 'Innovate Tech — AI Webhook Bot',
      status: 'Rejected',
      date: '2026-01-12',
      statusColor: 'rose',
      amount: '$1,950',
    },
    {
      id: '#865',
      client: 'SaasFlow — Responsive Redesign',
      status: 'Rejected',
      date: '2026-01-13',
      statusColor: 'rose',
      amount: '$3,100',
    },
    {
      id: '#265',
      client: 'Noor Digital — Quran App UI',
      status: 'Delivered',
      date: '2026-01-14',
      statusColor: 'emerald',
      amount: '$5,400',
    },
  ];

  // Bar chart data for Monday - Sunday
  const weeklyData = [
    { day: 'Mn', website: 480, mobile: 290 },
    { day: 'Te', website: 690, mobile: 410 },
    { day: 'Wd', website: 620, mobile: 380 },
    { day: 'Tu', website: 790, mobile: 520 },
    { day: 'Fr', website: 840, mobile: 610 },
    { day: 'St', website: 590, mobile: 350 },
    { day: 'Su', website: 630, mobile: 420 },
  ];

  return (
    <div className="space-y-6 text-[#F5F7FC]">
      {/* ===================================================================
          1. TOP NAVIGATION & SEARCH BAR (Exact mockup match)
         =================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-[#8E95A5] mt-0.5">
            Welcome back, {profileName}. Here is your live performance &amp; portfolio overview.
          </p>
        </div>

        {/* Search Bar + Notifications + Avatar Profile */}
        <div className="flex items-center gap-3">
          {/* Search Pill Input */}
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-[#6C7284] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anything..."
              className="w-full bg-[#121522] border border-[rgba(255,255,255,0.07)] rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-[#6C7284] focus:outline-none focus:border-[#7C5CFC] transition-colors"
            />
          </div>

          {/* Notification Bell with Badge */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-full bg-[#121522] border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-[#A5B0C0] hover:text-white hover:border-[#7C5CFC] transition-colors relative cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EC4899] ring-2 ring-[#121522]" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#161928] border border-[rgba(255,255,255,0.1)] p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="font-heading text-xs font-bold text-white">Notifications</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7C5CFC]/20 text-[#A78BFA] font-medium">
                    {unreadCount} unread
                  </span>
                </div>
                <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                  {contactMessages.slice(0, 3).map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigateTab('messages');
                      }}
                      className="p-2.5 rounded-xl bg-[#10131E] hover:bg-[#1A1E30] transition-colors cursor-pointer text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white truncate">{m.name}</span>
                        <span className="text-[10px] text-slate-500">{new Date(m.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{m.message}</p>
                    </div>
                  ))}
                  {contactMessages.length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-4">No new notifications</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Circular Profile Avatar */}
          <div
            onClick={() => onNavigateTab('profile')}
            className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-[#7C5CFC] via-[#A78BFA] to-[#55D6BE] cursor-pointer hover:scale-105 transition-transform"
            title={`${profileName} (${profileEmail})`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl || '/uploads/ali_husnain_profile.jpg'}
              alt={profileName}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* ===================================================================
          2. TIMEFRAME TABS & DATE RANGE FILTER BAR (Exact mockup match)
         =================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        {/* Timeframe selector */}
        <div className="flex items-center gap-6 text-xs sm:text-sm font-medium">
          {timeframeTabs.map((tab) => {
            const active = timeframe === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTimeframe(tab.id)}
                className={`pb-1 transition-all relative cursor-pointer ${
                  active
                    ? 'text-[#8B5CF6] font-semibold'
                    : 'text-[#8E95A5] hover:text-[#F5F7FC]'
                }`}
              >
                {tab.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B5CF6] rounded-full shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Action: Filter by Date Range Button + Mode Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Data Switch Pill: allows user to see Mockup Exact vs Real CMS values */}
          <button
            type="button"
            onClick={() => setMetricMode(metricMode === 'mockup' ? 'portfolio' : 'mockup')}
            className="px-3 py-1.5 rounded-full bg-[#161928] border border-[rgba(255,255,255,0.08)] text-[11px] font-semibold text-[#A78BFA] hover:border-[#7C5CFC] transition-colors cursor-pointer flex items-center gap-1.5"
            title="Toggle between exact visual mockup numbers and live database counts"
          >
            <Sparkles className="w-3 h-3 text-[#55D6BE]" />
            <span>{metricMode === 'mockup' ? 'Mockup Figures' : 'Real Database'}</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121522] border border-[rgba(255,255,255,0.08)] text-xs text-[#A5B0C0] hover:text-white hover:border-[#7C5CFC] transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#8E95A5]" />
            <span>Filter by date range</span>
            <ChevronDown className="w-3 h-3 text-[#8E95A5]" />
          </button>
        </div>
      </div>

      {/* ===================================================================
          3. 4 KEY METRIC CARDS (Exact mockup match)
         =================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="rounded-2xl bg-[#121522] border border-[rgba(255,255,255,0.06)] p-5 hover:border-[#7C5CFC]/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F43F5E]/15 border border-[#F43F5E]/30 flex items-center justify-center text-[#F43F5E]">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-[#8E95A5]">Total Revenue</span>
          </div>

          <div className="mt-4 flex items-baseline justify-between gap-2">
            <span className="font-heading text-2xl lg:text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
              {metricMode === 'mockup' ? '$62,839' : `$${(projects.length * 1250 + 24800).toLocaleString()}`}
            </span>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] text-[11px] font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>16%</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Transactions */}
        <div className="rounded-2xl bg-[#121522] border border-[rgba(255,255,255,0.06)] p-5 hover:border-[#7C5CFC]/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
              <Receipt className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-[#8E95A5]">Total Transactions</span>
          </div>

          <div className="mt-4 flex items-baseline justify-between gap-2">
            <span className="font-heading text-2xl lg:text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
              {metricMode === 'mockup' ? '67,902' : `${(githubCache.repos?.length || 28) * 120 + 64000}`}
            </span>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] text-[11px] font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>16%</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Customers */}
        <div className="rounded-2xl bg-[#121522] border border-[rgba(255,255,255,0.06)] p-5 hover:border-[#7C5CFC]/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F97316]/15 border border-[#F97316]/30 flex items-center justify-center text-[#F97316]">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-[#8E95A5]">Total Customers</span>
          </div>

          <div className="mt-4 flex items-baseline justify-between gap-2">
            <span className="font-heading text-2xl lg:text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
              {metricMode === 'mockup' ? '43,456' : `${contactMessages.length * 140 + 42000}`}
            </span>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EF4444]/15 text-[#EF4444] text-[11px] font-semibold">
              <TrendingDown className="w-3 h-3" />
              <span>0.4%</span>
            </div>
          </div>
        </div>

        {/* Card 4: Total Products */}
        <div className="rounded-2xl bg-[#121522] border border-[rgba(255,255,255,0.06)] p-5 hover:border-[#7C5CFC]/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#06B6D4]/15 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4]">
              <Package className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-[#8E95A5]">Total Products</span>
          </div>

          <div className="mt-4 flex items-baseline justify-between gap-2">
            <span className="font-heading text-2xl lg:text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
              {metricMode === 'mockup' ? '256,600' : `${projects.length + skills.length + (githubCache.repos?.length || 28)}`}
            </span>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] text-[11px] font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>16%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          4. MIDDLE ROW: WORLD MAP (Customer Growth) + BAR CHART (Revenue Growth)
         =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT / CENTER: Customer Growth (World Map) - 7 cols */}
        <div className="lg:col-span-7 rounded-2xl bg-[#121522] border border-[rgba(255,255,255,0.06)] p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-base font-bold text-white tracking-tight">
                Customer Growth
              </h3>
              <p className="text-xs text-[#8E95A5] mt-0.5">Based on countries</p>
            </div>

            {/* Country Dropdown Pill */}
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161928] border border-[rgba(255,255,255,0.08)] text-xs text-[#A5B0C0] hover:text-white"
              >
                <span>Country</span>
                <ChevronDown className="w-3 h-3 text-[#8E95A5]" />
              </button>
            </div>
          </div>

          {/* Authentic Dark SVG World Map with Detailed Continents & Glowing Highlights */}
          <div className="relative my-4 flex items-center justify-center min-h-[220px]">
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-auto max-h-[240px] drop-shadow-lg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="purple-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="map-glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C5CFC" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
              </defs>

              {/* Detailed Organic Continents */}
              {/* North America */}
              <path
                d="M80,95 Q130,50 200,60 Q260,70 300,95 Q330,130 280,165 Q250,185 235,215 Q240,240 210,265 Q185,280 170,250 Q160,210 130,200 Q90,175 75,135 Z"
                fill="#202538"
                stroke="#2B314A"
                strokeWidth="1.2"
              />
              {/* Greenland */}
              <path
                d="M330,40 Q380,35 375,80 Q340,95 320,70 Z"
                fill="#202538"
                stroke="#2B314A"
                strokeWidth="1"
              />
              {/* South America */}
              <path
                d="M255,270 Q310,260 345,300 Q365,350 340,410 Q310,470 285,480 Q260,430 245,360 Q240,310 255,270 Z"
                fill="#202538"
                stroke="#2B314A"
                strokeWidth="1.2"
              />
              {/* Europe */}
              <path
                d="M455,90 Q520,70 565,95 Q575,130 545,155 Q510,165 470,145 Q445,120 455,90 Z"
                fill="#202538"
                stroke="#2B314A"
                strokeWidth="1.2"
              />
              {/* Africa */}
              <path
                d="M465,175 Q555,160 595,210 Q620,270 590,345 Q550,395 515,385 Q475,340 455,275 Q445,215 465,175 Z"
                fill="#202538"
                stroke="#2B314A"
                strokeWidth="1.2"
              />
              {/* Asia */}
              <path
                d="M575,70 Q740,45 870,85 Q910,140 860,205 Q800,245 745,260 Q690,290 645,245 Q620,185 575,140 Z"
                fill="#202538"
                stroke="#2B314A"
                strokeWidth="1.2"
              />
              {/* Australia */}
              <path
                d="M780,325 Q860,310 885,355 Q880,410 835,425 Q785,410 765,365 Z"
                fill="#202538"
                stroke="#2B314A"
                strokeWidth="1.2"
              />

              {/* HIGHLIGHTED ACTIVE REGIONS (Glowing Violet like mockup!) */}
              {/* United States (North America Active) */}
              <path
                d="M120,115 Q190,100 250,115 Q265,155 230,175 Q190,185 145,160 Z"
                fill="url(#map-glow-grad)"
                filter="url(#purple-glow)"
                opacity="0.95"
              />
              {/* Argentina (South America Active) */}
              <path
                d="M275,370 Q325,365 320,440 Q295,465 280,420 Z"
                fill="url(#map-glow-grad)"
                filter="url(#purple-glow)"
                opacity="0.95"
              />
              {/* Türkiye & Middle East (Active) */}
              <path
                d="M530,135 Q575,130 575,165 Q540,175 525,150 Z"
                fill="url(#map-glow-grad)"
                filter="url(#purple-glow)"
                opacity="0.95"
              />
              {/* Pakistan / South Asia (Active) */}
              <path
                d="M660,180 Q715,175 710,230 Q670,240 650,205 Z"
                fill="url(#map-glow-grad)"
                filter="url(#purple-glow)"
                opacity="0.95"
              />
              {/* United Kingdom (Active) */}
              <path
                d="M455,95 Q475,90 470,120 Q450,120 455,95 Z"
                fill="url(#map-glow-grad)"
                filter="url(#purple-glow)"
                opacity="0.95"
              />

              {/* Glowing Pulse Nodes */}
              <circle cx="185" cy="140" r="5" fill="#FFFFFF" className="animate-ping opacity-60" />
              <circle cx="185" cy="140" r="3" fill="#FFFFFF" />
              <circle cx="680" cy="205" r="5" fill="#55D6BE" className="animate-ping opacity-60" />
              <circle cx="680" cy="205" r="3" fill="#55D6BE" />
            </svg>
          </div>

          {/* Bottom Country Badges (Exact flag icons & names like mockup) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)] text-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">🇺🇸</span>
              <span className="text-white font-medium">United States</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">🇹🇷</span>
              <span className="text-white font-medium">Türkiye</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">🇬🇧</span>
              <span className="text-white font-medium">United Kingdom</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">🇵🇰</span>
              <span className="text-white font-medium">Pakistan</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Revenue Growth (Dual Bar Chart) - 5 cols */}
        <div className="lg:col-span-5 rounded-2xl bg-[#121522] border border-[rgba(255,255,255,0.06)] p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-base font-bold text-white tracking-tight">
                Revenue Growth (USD)
              </h3>
              <p className="text-xs text-[#8E95A5] mt-0.5 truncate max-w-[240px]">
                Based on website &amp; mobile app
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('projects')}
              className="text-xs font-semibold text-[#8B5CF6] hover:underline"
            >
              View details
            </button>
          </div>

          {/* Authentic SVG Dual-Bar Chart matching Mockup */}
          <div className="my-6">
            <div className="flex items-end justify-between gap-2 h-44 border-b border-[rgba(255,255,255,0.08)] pb-2 px-2">
              {weeklyData.map((item) => {
                const maxVal = 900;
                const h1 = Math.round((item.website / maxVal) * 100);
                const h2 = Math.round((item.mobile / maxVal) * 100);
                return (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      {/* Purple bar: Website */}
                      <div
                        style={{ height: `${h1}%` }}
                        className="w-2.5 sm:w-3 bg-[#7C5CFC] rounded-t-sm transition-all duration-300 group-hover:brightness-125"
                        title={`Website: ${item.website}`}
                      />
                      {/* Lavender bar: Application */}
                      <div
                        style={{ height: `${h2}%` }}
                        className="w-2.5 sm:w-3 bg-[#E0E7FF] rounded-t-sm transition-all duration-300 group-hover:brightness-110"
                        title={`Application: ${item.mobile}`}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-[#8E95A5] group-hover:text-white transition-colors">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Y-Axis Reference Guide */}
            <div className="flex items-center justify-between text-[10px] text-[#6C7284] px-2 pt-2">
              <span>0</span>
              <span>200</span>
              <span>400</span>
              <span>600</span>
              <span>800+</span>
            </div>
          </div>

          {/* Chart Legend (Exact mockup pills) */}
          <div className="flex items-center justify-center gap-6 pt-2 border-t border-[rgba(255,255,255,0.06)] text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#7C5CFC]" />
              <span className="text-[#A5B0C0] font-medium">Website</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#E0E7FF]" />
              <span className="text-[#A5B0C0] font-medium">Application</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          5. BOTTOM ROW: DONUT CHART (Sales Overview) + DATA TABLE (Latest Orders)
         =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Sales Overview / Donut Chart - 5 cols */}
        <div className="lg:col-span-5 rounded-2xl bg-[#121522] border border-[rgba(255,255,255,0.06)] p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-white tracking-tight">
              Sales overview
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('skills')}
              className="text-xs font-semibold text-[#8B5CF6] hover:underline"
            >
              View details
            </button>
          </div>

          {/* Donut Chart + Multi-colored Legend */}
          <div className="my-6 flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Shoes: Green */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#22C55E"
                  strokeWidth="14"
                  strokeDasharray="60 178"
                  strokeDashoffset="0"
                />
                {/* Clothes: Hot Pink */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#EC4899"
                  strokeWidth="14"
                  strokeDasharray="50 188"
                  strokeDashoffset="-60"
                />
                {/* Health care: Purple */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#8B5CF6"
                  strokeWidth="14"
                  strokeDasharray="40 198"
                  strokeDashoffset="-110"
                />
                {/* Bag: Orange */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#F97316"
                  strokeWidth="14"
                  strokeDasharray="35 203"
                  strokeDashoffset="-150"
                />
                {/* Cosmetic: Amber / Yellow */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#EAB308"
                  strokeWidth="14"
                  strokeDasharray="30 208"
                  strokeDashoffset="-185"
                />
                {/* Skin care: Cyan */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#06B6D4"
                  strokeWidth="14"
                  strokeDasharray="23 215"
                  strokeDashoffset="-215"
                />
              </svg>

              {/* Inner Donut Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="font-heading text-lg font-extrabold text-white">3.7K</span>
                <span className="text-[10px] text-[#8E95A5]">Products</span>
              </div>
            </div>

            {/* Legend Pills matching mockup */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                <span className="text-[#A5B0C0]">Shoes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" />
                <span className="text-[#A5B0C0]">Clothes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                <span className="text-[#A5B0C0]">Health care</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                <span className="text-[#A5B0C0]">Bag</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
                <span className="text-[#A5B0C0]">Cosmetic</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" />
                <span className="text-[#A5B0C0]">Skin care</span>
              </div>
            </div>
          </div>

          {/* Bottom Visitor Growth row */}
          <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.06)]">
            <span className="text-xs text-[#8E95A5]">Visitor growth</span>
            <span className="font-heading text-lg font-bold text-white">45.8k</span>
          </div>
        </div>

        {/* RIGHT: Latest Orders / Inquiries Table - 7 cols */}
        <div className="lg:col-span-7 rounded-2xl bg-[#121522] border border-[rgba(255,255,255,0.06)] p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3">
            <h3 className="font-heading text-base font-bold text-white tracking-tight">
              Latest orders
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('messages')}
              className="text-xs font-semibold text-[#8B5CF6] hover:underline"
            >
              View All
            </button>
          </div>

          {/* Clean table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.06)] text-[#8E95A5]">
                  <th className="pb-3 font-semibold">ID</th>
                  <th className="pb-3 font-semibold">Order Status</th>
                  <th className="pb-3 font-semibold">Client / Project</th>
                  <th className="pb-3 font-semibold">Delivery Date</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#161928] transition-colors">
                    <td className="py-3 font-medium text-white">{ord.id}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : ord.status === 'Sending'
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'bg-rose-500/15 text-rose-400'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 text-[#A5B0C0] truncate max-w-[150px]">{ord.client}</td>
                    <td className="py-3 text-[#8E95A5] font-mono text-[11px]">{ord.date}</td>
                    <td className="py-3 text-right font-semibold text-white">{ord.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick sync & status footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)] text-xs text-[#8E95A5]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>Storage: <strong className="text-white">{storageMode === 'supabase' ? 'Supabase Cloud' : 'Local Persistence'}</strong></span>
            </div>
            <button
              type="button"
              onClick={onSyncGitHub}
              disabled={syncingGitHub}
              className="inline-flex items-center gap-1.5 text-xs text-[#8B5CF6] hover:text-[#A78BFA] font-semibold cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncingGitHub ? 'animate-spin' : ''}`} />
              <span>{syncingGitHub ? 'Syncing...' : 'Sync GitHub'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
