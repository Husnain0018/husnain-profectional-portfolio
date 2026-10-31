'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Download,
  Mail,
  CheckCircle2,
  MapPin,
  Award,
  Code2,
  Terminal,
  Cpu,
  Bot,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Eye,
  X,
  FileText,
  Sparkles,
  Check,
  ShieldCheck,
  Layers,
  Phone,
  MessageCircle,
  Compass,
  Lightbulb,
  Workflow,
  Wrench,
  CheckCheck,
} from 'lucide-react';
import {
  Profile,
  Skill,
  Education,
  Certification,
  ExperienceItem,
  ServiceItem,
  SocialLink,
} from '@/types/portfolio';
import { DynamicIcon, Github } from '@/components/ui/DynamicIcon';
import { YellowBrushSplash } from '@/components/ui/YellowBrushSplash';
import { GoldenWaveMesh } from '@/components/ui/GoldenWaveMesh';
import { SignatureLogo } from '@/components/brand/Logo';
import {
  Globe,
  Palette,
  Laptop,
  Smartphone,
  Server,
  Sparkles as SparklesIcon,
  CheckCircle,
  Clock,
  Layers as LayersIcon,
} from 'lucide-react';

// ============================================================================
// PART 6 — LIAM TEMPLATE HERO SECTION (Exact Clone)
// ============================================================================
export function HeroSection({
  profile,
  publicRepoCount,
}: {
  profile: Profile;
  publicRepoCount: number;
}) {
  const hasResume = Boolean(profile.resume_url && profile.resume_url.trim().length > 0);
  const hasPhoto = Boolean(profile.avatar_url && profile.avatar_url.trim().length > 0);

  return (
    <section
      id="home"
      className="relative min-h-[90vh] lg:min-h-[780px] pt-32 lg:pt-36 pb-20 flex flex-col justify-center overflow-hidden bg-[#060D0C]"
    >
      {/* Golden Wave Mesh Lines at bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 opacity-40 overflow-hidden">
        <GoldenWaveMesh className="w-full h-full" />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Greeting */}
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-medium text-white">
                Hello, I&apos;m <span className="text-[#FACC15] font-semibold">{profile.full_name?.split(' ')[0] || 'Ali'}</span>
              </span>
              <span className="text-xl inline-block animate-bounce">👋</span>
            </div>

            {/* Dominant Headline */}
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-[64px] font-extrabold uppercase tracking-tight text-white leading-[1.08]">
              I DESIGN &amp; BUILD <br />
              <span className="text-[#FACC15]">DIGITAL EXPERIENCES</span>
            </h1>

            {/* Subtitle / Bio */}
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-xl font-normal">
              I&apos;m a passionate Full-Stack Developer &amp; UI/UX Designer creating modern and functional websites, applications and digital products.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {hasResume && (
                <a
                  href={profile.resume_url}
                  download="Ali_Husnain_CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#FACC15] text-[#0A1312] font-bold text-xs hover:bg-[#EAB308] hover:shadow-[0_4px_20px_rgba(250,204,21,0.4)] transition-all"
                >
                  <span>Download CV</span>
                  <Download className="w-4 h-4" />
                </a>
              )}

              <Link
                href="/#projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-white/20 text-white font-medium text-xs hover:border-[#FACC15] hover:text-[#FACC15] transition-all bg-[#0A1413]/60"
              >
                <span>View Works</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Follow Me Social Row */}
            <div className="pt-4 flex items-center gap-3">
              <span className="text-xs font-semibold text-[#94A3B8] mr-1">Follow Me :</span>
              <a
                href={`https://github.com/${profile.github_username || 'Husnain0018'}`}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="w-9 h-9 rounded-full bg-[#0C1817] border border-white/10 flex items-center justify-center text-[#94A3B8] hover:border-[#FACC15] hover:text-[#FACC15] transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/ali-husnain-426311385"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="w-9 h-9 rounded-full bg-[#0C1817] border border-white/10 flex items-center justify-center text-[#94A3B8] hover:border-[#FACC15] hover:text-[#FACC15] transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
              {profile.phone && (
                <a
                  href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="WhatsApp"
                  className="w-9 h-9 rounded-full bg-[#0C1817] border border-white/10 flex items-center justify-center text-[#94A3B8] hover:border-[#FACC15] hover:text-[#FACC15] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              <a
                href={`mailto:${profile.email}`}
                title="Email"
                className="w-9 h-9 rounded-full bg-[#0C1817] border border-white/10 flex items-center justify-center text-[#94A3B8] hover:border-[#FACC15] hover:text-[#FACC15] transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Yellow Brush Splatter + Portrait Cutout + Experience Badge (5 cols) */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-[460px] h-[520px] sm:h-[560px] flex items-end justify-center">
              {/* THE EXACT YELLOW BRUSH SPLATTER BACKGROUND (Matching Liam Reference) */}
              <div className="absolute inset-0 -top-6 -right-6 pointer-events-none z-0 scale-125">
                <YellowBrushSplash className="w-full h-full object-contain" />
              </div>

              {/* Developer Cutout Photo (Directly on canvas with bottom fade, matching Liam) */}
              <div
                className="relative z-10 w-[92%] h-[92%] flex items-end justify-center"
                style={{
                  WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                  maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/uploads/ali_husnain_cutout.png"
                  alt={`${profile.full_name}`}
                  className="w-full h-full object-contain object-bottom filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] contrast-[1.05]"
                />
              </div>

              {/* Floating Circular Experience Badge (Exact Liam Match: 5+ Years Experience) */}
              <div className="absolute bottom-6 right-2 sm:right-4 z-20 w-24 h-24 rounded-full bg-[#0C1817] border-2 border-[#FACC15] shadow-[0_12px_32px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center text-center p-2 backdrop-blur-md">
                <span className="font-heading text-2xl font-black text-[#FACC15] leading-none">
                  2+
                </span>
                <span className="text-[10px] text-[#CBD5E1] font-semibold leading-tight mt-1">
                  Years<br />Experience
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// PART 7 — LIAM TEMPLATE ABOUT ME SECTION (Exact Clone)
// ============================================================================
export function AboutSection({ profile }: { profile: Profile }) {
  return (
    <section id="about" className="py-24 bg-[#0A1413] border-t border-[#FACC15]/10 relative">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Paragraph, Signature & Button (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FACC15] block">
              ABOUT ME
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-white leading-tight">
              Designing With <span className="text-[#FACC15]">Passion</span> <br />
              While Exploring The World.
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              I&apos;m Ali, a Full-Stack Web Developer &amp; UI/UX Designer based in Pakistan. I have a passion for web design and love to create responsive, intelligent digital solutions for web and mobile devices.
            </p>

            {/* Original Handwritten Signature */}
            <div className="pt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/ali-husnain-signature.png"
                alt="Ali Husnain handwritten signature"
                className="h-[52px] sm:h-[60px] w-auto object-contain"
                draggable={false}
              />
            </div>

            {/* Button */}
            <div className="pt-2">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FACC15] text-[#0A1312] font-bold text-xs hover:bg-[#EAB308] transition-all"
              >
                <span>More About Me</span>
                <Download className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Profile Metadata List + 4 Counters (6 cols) */}
          <div className="lg:col-span-6 space-y-8">
            {/* Metadata List Card */}
            <div className="p-6 rounded-2xl bg-[#0C1817] border border-[rgba(250,204,21,0.12)] space-y-4 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-[#FACC15]">👤</span>
                  <div>
                    <span className="text-[#94A3B8] block text-[11px]">Name:</span>
                    <span className="font-semibold text-white">{profile.full_name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#FACC15]">✉️</span>
                  <div>
                    <span className="text-[#94A3B8] block text-[11px]">Email:</span>
                    <span className="font-semibold text-white truncate block">{profile.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#FACC15]">📍</span>
                  <div>
                    <span className="text-[#94A3B8] block text-[11px]">From:</span>
                    <span className="font-semibold text-white">{profile.location || 'Gujranwala, Pakistan'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#FACC15]">💼</span>
                  <div>
                    <span className="text-[#94A3B8] block text-[11px]">Availability:</span>
                    <span className="font-semibold text-[#FACC15]">Freelance / Full-Time</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Stat Counters (Exact Liam Match) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#0C1817] border border-[rgba(250,204,21,0.12)] text-center divide-x divide-white/5">
              <div className="space-y-1">
                <span className="font-heading text-3xl font-black text-[#FACC15] block">02+</span>
                <span className="text-[11px] text-[#94A3B8] uppercase tracking-wider block">Years Exp.</span>
              </div>
              <div className="space-y-1 pl-3">
                <span className="font-heading text-3xl font-black text-white block">28+</span>
                <span className="text-[11px] text-[#94A3B8] uppercase tracking-wider block">Projects</span>
              </div>
              <div className="space-y-1 pl-3">
                <span className="font-heading text-3xl font-black text-white block">15+</span>
                <span className="text-[11px] text-[#94A3B8] uppercase tracking-wider block">Tech Stacks</span>
              </div>
              <div className="space-y-1 pl-3">
                <span className="font-heading text-3xl font-black text-[#FACC15] block">01</span>
                <span className="text-[11px] text-[#94A3B8] uppercase tracking-wider block">NAVTTC A+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// PART 8 — TECHNICAL SKILLS (COMPACT CATEGORY PANELS)
// ============================================================================
export function SkillsSection({ skills }: { skills: Skill[] }) {
  const categories = Array.from(new Set(skills.map((s) => s.category)));
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const visibleSkills =
    selectedCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

  const groupedCategories =
    selectedCategory === 'All' ? categories : [selectedCategory];

  return (
    <section id="skills" className="py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#55D6BE] block">
              02 / TECHNICAL CAPABILITY
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#F5F7FC] mt-2">
              Technical Skills &amp; Stack
            </h2>
            <p className="text-sm sm:text-base text-[#A5B0C0] mt-2 max-w-2xl">
              Organized into structured categories with verified experience labels. Clean, recruiter-friendly, and free from fabricated percentage metrics.
            </p>
          </div>

          {/* Filter Pills */}
          <div
            role="tablist"
            aria-label="Filter skills by category"
            className="flex flex-wrap gap-2"
          >
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#6C8CFF] text-white shadow-sm'
                  : 'bg-[#151B25] border border-[rgba(255,255,255,0.08)] text-[#A5B0C0] hover:text-[#F5F7FC]'
              }`}
            >
              All ({skills.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#6C8CFF] text-white shadow-sm'
                    : 'bg-[#151B25] border border-[rgba(255,255,255,0.08)] text-[#A5B0C0] hover:text-[#F5F7FC]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Category Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedCategories.map((category) => {
            const catSkills = visibleSkills.filter((s) => s.category === category);
            if (catSkills.length === 0) return null;

            return (
              <div
                key={category}
                className="rounded-2xl bg-[#151B25] border border-[rgba(255,255,255,0.08)] p-6 hover:border-[#6C8CFF]/50 transition-all duration-200 flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[rgba(255,255,255,0.08)]">
                    <h3 className="font-heading text-base font-bold text-[#F5F7FC]">
                      {category}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#10141C] border border-[rgba(255,255,255,0.08)] text-[11px] text-[#6C8CFF] font-semibold">
                      {catSkills.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {catSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#10141C] border border-[rgba(255,255,255,0.05)] hover:border-[#6C8CFF]/30 transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#6C8CFF]/10 flex items-center justify-center text-[#6C8CFF] shrink-0">
                            <DynamicIcon name={skill.icon} className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-semibold text-[#F5F7FC] truncate">
                            {skill.name}
                          </span>
                        </div>
                        {skill.proficiency_label && (
                          <span className="text-[11px] text-[#737F91] truncate ml-2 font-medium shrink-0">
                            {skill.proficiency_label}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// PART 11 & 12 — DEVELOPMENT JOURNEY, EDUCATION & CERTIFICATIONS
// ============================================================================
export function JourneyEducationCertificationsSection({
  education,
  certifications,
  experience,
}: {
  education: Education[];
  certifications: Certification[];
  experience: ExperienceItem[];
}) {
  const [previewCert, setPreviewCert] = useState<Certification | null>(null);

  return (
    <>
      {/* PART 11 — MY DEVELOPMENT JOURNEY */}
      <section id="journey" className="py-24 bg-[#10141C]/70 border-y border-[rgba(255,255,255,0.08)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#A78BFA] block">
              03 / MILESTONES
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#F5F7FC] mt-2">
              My Development Journey
            </h2>
            <p className="text-sm sm:text-base text-[#A5B0C0] mt-2">
              Chronological timeline tracking verified engineering milestones, academic projects, and professional internship experience.
            </p>
          </div>

          <div className="relative border-l-2 border-[rgba(255,255,255,0.1)] ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-9">
            {experience.map((item) => (
              <div
                key={item.id}
                className="relative rounded-2xl bg-[#151B25] border border-[rgba(255,255,255,0.08)] p-6 hover:border-[#6C8CFF]/40 transition-all duration-200"
              >
                {/* Timeline node */}
                <span className="absolute -left-[33px] sm:-left-[49px] top-6 w-4 h-4 rounded-full bg-[#6C8CFF] ring-4 ring-[#090B10]" />

                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#6C8CFF]/15 border border-[#6C8CFF]/30 text-xs font-semibold text-[#6C8CFF] uppercase">
                      {item.type}
                    </span>
                    <span className="text-xs font-semibold text-[#55D6BE]">
                      {item.start_date} — {item.end_date}
                    </span>
                  </div>
                  {item.location && (
                    <span className="text-xs text-[#737F91] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {item.location}
                    </span>
                  )}
                </div>

                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#F5F7FC]">
                  {item.title}
                </h3>
                <p className="text-sm font-semibold text-[#6C8CFF] mb-3">
                  {item.organization}
                </p>
                <p className="text-sm text-[#A5B0C0] leading-relaxed mb-4">
                  {item.description}
                </p>

                {item.highlights && item.highlights.length > 0 && (
                  <ul className="space-y-2 text-xs sm:text-sm text-[#A5B0C0]">
                    {item.highlights.map((hl, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#55D6BE] shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {(item.certificate_url || item.verification_url) && (
                  <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.08)] flex flex-wrap gap-3">
                    {item.certificate_url && (
                      <a
                        href={item.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10141C] border border-[rgba(255,255,255,0.1)] text-xs font-semibold text-[#F5F7FC] hover:border-[#55D6BE]"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#55D6BE]" />
                        <span>View Experience Certificate</span>
                      </a>
                    )}
                    {item.verification_url && (
                      <a
                        href={item.verification_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10141C] border border-[rgba(255,255,255,0.1)] text-xs font-semibold text-[#6C8CFF] hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Online Verification</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PART 12 — EDUCATION & CERTIFICATIONS */}
      <section className="py-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Education Column */}
          <div id="education" className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#6C8CFF] block">
                04 / ACADEMICS
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#F5F7FC] mt-1">
                Education
              </h2>
            </div>

            <div className="space-y-4">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="rounded-2xl bg-[#151B25] border border-[rgba(255,255,255,0.08)] p-6 space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-[#6C8CFF]/15 border border-[#6C8CFF]/30 text-xs font-semibold text-[#6C8CFF]">
                      {edu.start_date} – {edu.end_date}
                    </span>
                    <span className="text-xs text-[#737F91]">{edu.location}</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#F5F7FC]">
                    {edu.degree}
                  </h3>
                  <p className="text-sm font-semibold text-[#55D6BE]">
                    {edu.institution}
                  </p>
                  {edu.description && (
                    <p className="text-xs sm:text-sm text-[#A5B0C0] leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Column */}
          <div id="certifications" className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#55D6BE] block">
                05 / CREDENTIALS
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#F5F7FC] mt-1">
                Professional Certifications
              </h2>
            </div>

            <div className="space-y-5">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="rounded-2xl bg-[#151B25] border border-[rgba(255,255,255,0.08)] p-6 flex flex-col sm:flex-row gap-5 items-start shadow-lg"
                >
                  {cert.certificate_url && (
                    <button
                      type="button"
                      onClick={() => setPreviewCert(cert)}
                      className="w-full sm:w-44 aspect-[4/3] rounded-xl overflow-hidden bg-[#10141C] border border-[rgba(255,255,255,0.08)] shrink-0 relative group cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cert.certificate_url}
                        alt={cert.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-[#090B10]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-lg bg-[#6C8CFF] text-white text-xs font-semibold flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          View Certificate
                        </span>
                      </div>
                    </button>
                  )}

                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#55D6BE]/15 border border-[#55D6BE]/30 text-xs font-semibold text-[#55D6BE]">
                        {cert.technology_track}
                      </span>
                      {cert.grade && (
                        <span className="px-2.5 py-0.5 rounded-md bg-[#6C8CFF]/15 border border-[#6C8CFF]/30 text-xs font-semibold text-[#6C8CFF]">
                          Grade: {cert.grade}
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading text-lg font-bold text-[#F5F7FC]">
                      {cert.title}
                    </h3>
                    <p className="text-sm font-semibold text-[#55D6BE]">
                      {cert.organization}
                    </p>
                    <p className="text-xs sm:text-sm text-[#A5B0C0] leading-relaxed">
                      {cert.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#737F91] pt-1">
                      {cert.duration && <span>Duration: {cert.duration}</span>}
                      {cert.issue_date && <span>Issued: {cert.issue_date}</span>}
                      {cert.certificate_number && (
                        <span>Doc No: {cert.certificate_number}</span>
                      )}
                    </div>

                    <div className="pt-2 flex flex-wrap gap-2.5">
                      {cert.certificate_url && (
                        <button
                          type="button"
                          onClick={() => setPreviewCert(cert)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#10141C] border border-[rgba(255,255,255,0.1)] text-xs font-semibold text-[#F5F7FC] hover:border-[#6C8CFF] cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#6C8CFF]" />
                          <span>View Official Document</span>
                        </button>
                      )}
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#10141C] border border-[rgba(255,255,255,0.1)] text-xs font-semibold text-[#55D6BE] hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Online Verification</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Lightbox Modal */}
      {previewCert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={previewCert.title}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewCert(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#151B25] border border-[rgba(255,255,255,0.12)] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.08)] bg-[#10141C]">
              <div>
                <h3 className="font-heading text-base font-bold text-[#F5F7FC]">
                  {previewCert.title}
                </h3>
                <p className="text-xs text-[#A5B0C0]">
                  {previewCert.organization}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewCert(null)}
                aria-label="Close modal"
                className="p-2 rounded-lg bg-[#151B25] text-[#A5B0C0] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-[80vh] overflow-auto flex justify-center bg-[#090B10]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewCert.certificate_url}
                alt={previewCert.title}
                className="max-h-[72vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================================
// PART 13 & 14 — LIAM TEMPLATE SERVICES & CAPABILITIES STRIP (Exact Clone)
// ============================================================================
export function ServicesAndStrengthsSection({
  services,
}: {
  services: ServiceItem[];
}) {
  const horizontalCapabilities = [
    { label: 'Agency', sub: 'Creative Solutions', icon: '⚡' },
    { label: 'Photography', sub: 'Capture Moments', icon: '📸' },
    { label: 'Music & Sound', sub: 'Audio Experiences', icon: '🎵' },
    { label: 'Painter & Art', sub: 'Creative Artwork', icon: '🎨' },
    { label: 'Web Design', sub: 'Modern Websites', icon: '💻' },
    { label: 'Illustrator', sub: 'Digital Illustrations', icon: '✏️' },
    { label: 'Trainer', sub: 'Train & Inspire', icon: '🎓' },
    { label: 'Freelancer', sub: 'Work Independently', icon: '🚀' },
  ];

  return (
    <section id="services" className="py-24 bg-[#060D0C] border-t border-[#FACC15]/10 relative">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 space-y-20">
        {/* WHAT I DO / Services That I Provide */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#FACC15] block">
                WHAT I DO
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mt-1">
                Services That <span className="text-[#FACC15]">I Provide</span>
              </h2>
            </div>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FACC15] hover:underline"
            >
              <span>View All Services</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(0, 4).map((srv, idx) => (
              <div
                key={srv.id || idx}
                className="rounded-2xl bg-[#0C1817] border border-[rgba(250,204,21,0.12)] p-6 flex flex-col justify-between hover:border-[#FACC15] transition-all duration-300 shadow-xl group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#060D0C] border border-[#FACC15]/30 flex items-center justify-center text-[#FACC15] mb-5 group-hover:scale-110 transition-transform">
                    <DynamicIcon name={srv.icon} className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-white mb-2.5 group-hover:text-[#FACC15] transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FACC15] hover:text-[#FDE047] transition-colors pt-5 mt-4 border-t border-white/5"
                >
                  <span>Order Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* HORIZONTAL CAPABILITIES STRIP (Exact match to bottom banner in reference image) */}
        <div className="pt-10 border-t border-[rgba(250,204,21,0.15)]">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {horizontalCapabilities.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#0C1817] border border-[rgba(250,204,21,0.1)] hover:border-[#FACC15] flex flex-col items-center text-center transition-all group"
              >
                <span className="text-2xl mb-2 text-[#FACC15] group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="font-heading text-xs font-bold text-white block">
                  {item.label}
                </span>
                <span className="text-[10px] text-[#94A3B8] block mt-0.5 truncate max-w-full">
                  {item.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
