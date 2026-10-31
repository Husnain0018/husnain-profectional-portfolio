'use client';

import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { Profile, SocialLink } from '@/types/portfolio';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

export function ContactSection({
  profile,
  socialLinks,
}: {
  profile: Profile;
  socialLinks: SocialLink[];
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('');

    if (name.trim().length < 2) {
      setStatus('error');
      setFeedback('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!email.includes('@') || email.trim().length < 5) {
      setStatus('error');
      setFeedback('Please enter a valid email address.');
      return;
    }
    if (subject.trim().length < 3) {
      setStatus('error');
      setFeedback('Please enter a subject (at least 3 characters).');
      return;
    }
    if (message.trim().length < 10) {
      setStatus('error');
      setFeedback('Please write a message of at least 10 characters.');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus('error');
        setFeedback(data.error || 'Failed to send message. Please try again.');
        return;
      }

      setStatus('success');
      setFeedback(
        data.message ||
          'Thank you! Your message has been securely saved to the inbox.'
      );
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setStatus('error');
      setFeedback('Network error while sending message. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#060D0C] border-t border-[#FACC15]/10">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FACC15] block">
            GET IN TOUCH
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white mt-1">
            Have a Project <span className="text-[#FACC15]">in Mind?</span>
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] mt-2">
            Let&apos;s discuss your idea and explore how we can turn it into a practical digital solution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column — Contact Details & Identity */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl bg-[#0C1817] border border-[rgba(250,204,21,0.12)] p-6 sm:p-8 space-y-5 shadow-xl">
              <h3 className="font-heading text-lg font-bold text-white">
                Direct Communication Channels
              </h3>

              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#060D0C] border border-white/5 hover:border-[#FACC15] transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FACC15]/15 flex items-center justify-center text-[#FACC15] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-[#94A3B8] block uppercase tracking-wider">
                      Email Address
                    </span>
                    <span className="text-sm font-semibold text-white break-all">
                      {profile.email}
                    </span>
                  </div>
                </a>
              )}

              {profile.phone && (
                <a
                  href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#060D0C] border border-white/5 hover:border-[#FACC15] transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FACC15]/15 flex items-center justify-center text-[#FACC15] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#94A3B8] block uppercase tracking-wider">
                      Phone &amp; WhatsApp
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {profile.phone}
                    </span>
                  </div>
                </a>
              )}

              {profile.location && (
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#060D0C] border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-[#FACC15]/15 flex items-center justify-center text-[#FACC15] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#94A3B8] block uppercase tracking-wider">
                      Location
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {profile.location}
                    </span>
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] block">
                  Official Profiles
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {socialLinks
                    .filter((s) => s.is_visible && s.url.trim().length > 0)
                    .map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#060D0C] border border-white/10 text-xs font-semibold text-white hover:border-[#FACC15] hover:text-[#FACC15] transition-all"
                      >
                        <DynamicIcon name={link.icon} className="w-4 h-4" />
                        <span>{link.platform}</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — Working Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl bg-[#0C1817] border border-[rgba(250,204,21,0.12)] p-6 sm:p-8 space-y-5 shadow-2xl"
            >
              {/* Spam Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_hp">Do not fill this field</label>
                <input
                  id="website_hp"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]"
                  >
                    Full Name <span className="text-[#FACC15]">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full px-4 py-3 rounded-xl bg-[#060D0C] border border-white/10 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#FACC15]"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]"
                  >
                    Email Address <span className="text-[#FACC15]">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#060D0C] border border-white/10 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#FACC15]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]"
                >
                  Subject <span className="text-[#FACC15]">*</span>
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Project Inquiry / Job Opportunity / Web Application"
                  className="w-full px-4 py-3 rounded-xl bg-[#060D0C] border border-white/10 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#FACC15]"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]"
                >
                  Message <span className="text-[#FACC15]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your project, timeline, technical requirements, or inquiry..."
                  className="w-full px-4 py-3 rounded-xl bg-[#060D0C] border border-white/10 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#FACC15] resize-y"
                />
              </div>

              {status === 'error' && (
                <div
                  role="alert"
                  className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs sm:text-sm text-rose-300 flex items-center gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{feedback}</span>
                </div>
              )}

              {status === 'success' && (
                <div
                  role="status"
                  className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs sm:text-sm text-emerald-300 flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{feedback}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-[#FACC15] text-[#0A1312] font-bold text-xs hover:bg-[#EAB308] hover:shadow-[0_4px_20px_rgba(250,204,21,0.4)] disabled:opacity-60 transition-all duration-200 cursor-pointer"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving &amp; Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
