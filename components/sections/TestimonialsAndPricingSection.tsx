'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Quote, ArrowUpRight, Sparkles } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'James Anderson',
    role: 'CEO, Kreative Tech',
    text: 'Ali is an exceptional developer and designer. He delivered our web application with pixel-perfect attention to detail, modern performance, and rock-solid code quality.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Sophia Martinez',
    role: 'Head of Product, NexaFlow',
    text: 'Working with Ali was an outstanding experience. He understood our architecture needs immediately and delivered high-velocity frontend and backend solutions that exceeded expectations.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Daniel Thomas',
    role: 'Founder, Photon Systems',
    text: 'Reliable, creative, and technically gifted. Ali transformed our initial wireframes into an enterprise-grade digital experience. Highly recommended for any serious web or app project.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
];

const PRICING_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    tagline: 'Ideal for landing pages & simple websites',
    priceMonthly: 29,
    priceYearly: 24,
    popular: false,
    features: [
      '1 Modern Responsive Website',
      'Mobile-First Responsive Layout',
      'Clean Code & SEO Optimization',
      'Full Source Code Delivery',
      'Email Support & 1-Month Bug Fixes',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    tagline: 'Perfect for full-stack apps & startups',
    priceMonthly: 59,
    priceYearly: 49,
    popular: true,
    features: [
      '3 Modern Web Applications / Pages',
      'Full-Stack Frontend & Backend APIs',
      'Database Architecture (PostgreSQL / SQLite)',
      'Admin CMS Dashboard Integration',
      'Priority Support & Free Minor Updates',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Comprehensive digital product suite',
    priceMonthly: 99,
    priceYearly: 85,
    popular: false,
    features: [
      'Unlimited / Large-Scale Web Platforms',
      'Cross-Platform Mobile App (Flutter / React)',
      'AI & Intelligent Automation Integrations',
      'High-Performance Cloud Deployment Support',
      '24/7 Dedicated Support & Code Audits',
    ],
  },
];

const CLIENT_PARTNERS = [
  { name: 'Sitemark', icon: '◈' },
  { name: 'Hexalab', icon: '⬢' },
  { name: 'Luminous', icon: '✦' },
  { name: 'CloudApp', icon: '☁' },
  { name: 'Penta', icon: '⬟' },
];

export function TestimonialsSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-[#060D0C]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FACC15] block mb-2 font-mono">
            TESTIMONIALS
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            What Clients Say
          </h2>
        </div>

        {/* 3 Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={item.name}
              className={`relative p-8 rounded-2xl bg-[#0C1817] border transition-all duration-300 flex flex-col justify-between ${
                idx === activeIdx
                  ? 'border-[#FACC15]/40 shadow-[0_10px_30px_rgba(250,204,21,0.1)]'
                  : 'border-white/5 hover:border-[#FACC15]/20'
              }`}
              onClick={() => setActiveIdx(idx)}
            >
              {/* Golden Double Quote Mark */}
              <div className="text-[#FACC15] font-serif text-4xl leading-none mb-4 select-none opacity-90">
                “
              </div>

              {/* Review Text */}
              <p className="text-sm text-[#94A3B8] leading-relaxed mb-8 flex-1 italic">
                {item.text}
              </p>

              {/* Author Row */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover border border-[#FACC15]/30"
                />
                <div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#94A3B8]">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeIdx
                  ? 'w-6 bg-[#FACC15]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingPlansSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-[#060D0C] border-t border-white/5">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
        {/* Header & Monthly/Yearly Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FACC15] block mb-2 font-mono">
              TRUSTED PLANS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Choose The Right Plan
            </h2>
          </div>

          {/* Billing Toggle Pill */}
          <div className="inline-flex items-center bg-[#0C1817] p-1.5 rounded-full border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-[#FACC15] text-[#0A1312] shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-[#FACC15] text-[#0A1312] shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Yearly <span className="opacity-75 text-[10px]">(-20%)</span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.popular
                    ? 'bg-[#0E1E1C] border-2 border-[#FACC15] shadow-[0_15px_40px_rgba(250,204,21,0.15)] md:-translate-y-2'
                    : 'bg-[#0C1817] border border-white/10 hover:border-white/20'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-[#FACC15] text-[#0A1312] font-black text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Popular
                  </div>
                )}

                <div>
                  {/* Plan Name & Tagline */}
                  <h3 className="font-heading text-xl font-bold text-white mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mb-6">
                    {plan.tagline}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-white/10">
                    <span className="font-heading text-4xl sm:text-5xl font-black text-white">
                      ${price}
                    </span>
                    <span className="text-xs text-[#94A3B8] font-medium">
                      / month
                    </span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-[#CBD5E1]">
                        <div className="w-4 h-4 rounded-full bg-[#FACC15]/15 text-[#FACC15] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Link
                  href="/#contact"
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs inline-flex items-center justify-center gap-2 transition-all ${
                    plan.popular
                      ? 'bg-[#FACC15] text-[#0A1312] hover:bg-[#EAB308] shadow-[0_4px_20px_rgba(250,204,21,0.3)]'
                      : 'border border-white/20 text-white hover:border-[#FACC15] hover:text-[#FACC15] bg-[#0A1413]/50'
                  }`}
                >
                  <span>Get Started</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Client Partners Ribbon (Exact Liam Match: Sitemark, Hexalab, Luminous, CloudApp, Penta) */}
        <div className="mt-14 pt-10 border-t border-white/5 pb-4">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#64748B] mb-8 font-mono">
            Trusted By Innovative Teams &amp; Digital Brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-80 hover:opacity-100 transition-opacity">
            {CLIENT_PARTNERS.map((partner) => (
              <div
                key={partner.name}
                className="flex items-center gap-2.5 text-[#94A3B8] hover:text-[#FACC15] transition-colors"
              >
                <span className="text-xl text-[#FACC15]">{partner.icon}</span>
                <span className="font-heading font-extrabold text-sm sm:text-base tracking-wider text-white">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
