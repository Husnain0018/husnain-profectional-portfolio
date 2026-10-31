'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sun,
  Moon,
  Download,
  Menu,
  X,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Profile, SiteAppearance } from '@/types/portfolio';
import { SignatureLogo } from '@/components/brand/Logo';
import { Github } from '@/components/ui/DynamicIcon';

const NAV_LINKS = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Portfolio', href: '/#projects' },
  { label: 'Journey', href: '/#journey' },
  { label: 'Contact', href: '/#contact' },
];

export function Navbar({
  profile,
  appearance,
}: {
  profile: Profile;
  appearance?: SiteAppearance;
}) {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('/#home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#060D0C]/90 dark:bg-[#060D0C]/95 light:bg-white/95 backdrop-blur-md border-b border-[#FACC15]/15 shadow-[0_4px_30px_rgba(0,0,0,0.6)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 h-20 flex items-center justify-between gap-6">
        {/* Signature Logo "Ali" in Golden Script (Exact Liam Match) */}
        <Link
          href="/#home"
          onClick={() => setActiveHash('/#home')}
          className="focus:outline-none shrink-0"
        >
          <SignatureLogo className="h-8 sm:h-9 w-auto text-[#FACC15]" />
        </Link>

        {/* Center Navigation Links (Exact Liam Template Alignment) */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8"
        >
          {NAV_LINKS.map((item) => {
            const isActive = activeHash === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setActiveHash(item.href)}
                className={`text-[13px] font-medium tracking-wide transition-colors duration-200 relative py-1 ${
                  isActive
                    ? 'text-[#FACC15] font-semibold'
                    : 'text-[#94A3B8] hover:text-[#FACC15]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#FACC15] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls & Golden Hire Me Button */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* GitHub Icon */}
          <a
            href={`https://github.com/${profile.github_username || 'Husnain0018'}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            title="GitHub Profile"
            className="p-2.5 rounded-full bg-[#0C1716] border border-white/10 hover:border-[#FACC15] text-[#94A3B8] hover:text-[#FACC15] transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Theme Toggle (Ensures Light & Dark works flawlessly) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2.5 rounded-full bg-[#0C1716] border border-white/10 hover:border-[#FACC15] text-[#94A3B8] hover:text-[#FACC15] transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#FACC15]" />
            ) : (
              <Moon className="w-4 h-4 text-[#060D0C]" />
            )}
          </button>

          {/* Golden "Hire Me ↗" Pill Button (Exact Liam Match) */}
          <Link
            href="/#contact"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#FACC15] text-[#0A1312] font-bold text-xs hover:bg-[#EAB308] hover:shadow-[0_4px_20px_rgba(250,204,21,0.4)] transition-all"
          >
            <span>Hire Me</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          {/* Admin CMS Access */}
          <Link
            href="/admin"
            title="Admin CMS"
            aria-label="Admin CMS"
            className="p-2.5 rounded-full bg-[#0C1716] border border-white/5 text-[#94A3B8] hover:text-[#FACC15] transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg bg-[#0C1716] border border-white/10 text-[#FACC15]"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-white" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="p-2 rounded-lg bg-[#0C1716] border border-white/10 text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="sm:hidden bg-[#060D0C]/98 border-b border-[#FACC15]/20 px-6 pt-4 pb-6 space-y-4 backdrop-blur-xl">
          <nav className="flex flex-col space-y-2">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  setActiveHash(item.href);
                  setMobileOpen(false);
                }}
                className="py-2.5 text-sm font-medium text-slate-200 hover:text-[#FACC15] border-b border-white/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/#contact"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#FACC15] text-[#0A1312] text-xs font-bold"
            >
              <span>Hire Me</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
