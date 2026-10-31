import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ShieldCheck, ExternalLink } from 'lucide-react';
import { Profile, SocialLink, SiteAppearance } from '@/types/portfolio';
import { BrandLogo } from '@/components/brand/Logo';
import { DynamicIcon, Github } from '@/components/ui/DynamicIcon';

export function Footer({
  profile,
  socialLinks,
  appearance,
}: {
  profile: Profile;
  socialLinks: SocialLink[];
  appearance: SiteAppearance;
}) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#060D0C] border-t border-[#FACC15]/10 text-[#94A3B8]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Info Column */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/#home" className="inline-block group" title="Ali Husnain">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/ali-husnain-signature.png"
                alt="Ali Husnain handwritten signature"
                className="h-[46px] sm:h-[54px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                draggable={false}
              />
            </Link>
            <p className="text-sm text-[#94A3B8] max-w-sm leading-relaxed font-normal">
              {appearance.footer_tagline ||
                'Building modern digital experiences through clean code, thoughtful design, and continuous learning.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              {socialLinks
                .filter((s) => s.is_visible && s.url.trim().length > 0)
                .map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    title={link.platform}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0C1817] border border-white/10 text-xs font-medium text-white hover:border-[#FACC15] hover:text-[#FACC15] transition-all"
                  >
                    <DynamicIcon name={link.icon} className="w-3.5 h-3.5" />
                    <span>{link.platform}</span>
                  </a>
                ))}
            </div>
          </div>

          {/* Quick Navigation Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li><Link href="/#home" className="hover:text-[#FACC15] transition-colors">Home</Link></li>
              <li><Link href="/#about" className="hover:text-[#FACC15] transition-colors">About Me</Link></li>
              <li><Link href="/#services" className="hover:text-[#FACC15] transition-colors">Services Provided</Link></li>
              <li><Link href="/#projects" className="hover:text-[#FACC15] transition-colors">Featured Works</Link></li>
              <li><Link href="/#journey" className="hover:text-[#FACC15] transition-colors">Journey &amp; Experience</Link></li>
              <li><Link href="/#contact" className="hover:text-[#FACC15] transition-colors">Get in Touch</Link></li>
            </ul>
          </div>

          {/* Contact & Verification Column */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Verified Contacts
            </h4>
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2.5 text-xs text-[#94A3B8] hover:text-[#FACC15] transition-colors break-all"
              >
                <Mail className="w-4 h-4 text-[#FACC15] shrink-0" />
                <span>{profile.email}</span>
              </a>
            )}
            {profile.phone && (
              <a
                href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-xs text-[#94A3B8] hover:text-[#FACC15] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#FACC15] shrink-0" />
                <span>{profile.phone} (WhatsApp / Phone)</span>
              </a>
            )}
            {profile.location && (
              <div className="flex items-center gap-2.5 text-xs text-[#94A3B8]">
                <MapPin className="w-4 h-4 text-[#FACC15] shrink-0" />
                <span>{profile.location}</span>
              </div>
            )}
            <a
              href={`https://github.com/${profile.github_username || 'Husnain0018'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#6C8CFF] hover:underline pt-2"
            >
              <Github className="w-4 h-4" />
              <span>github.com/{profile.github_username || 'Husnain0018'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737F91]">
          <p>
            &copy; {currentYear} {profile.full_name}. Engineered with Next.js, TypeScript &amp; Supabase.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/projects"
              className="hover:text-[#F5F7FC] transition-colors"
            >
              All Projects Directory
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-[#737F91] hover:text-[#55D6BE] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CMS Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
