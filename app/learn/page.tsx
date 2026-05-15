'use client';

import Link from 'next/link';
import { BookOpen, ExternalLink, Leaf, Droplets, Sprout, Lightbulb } from 'lucide-react';
import { Container } from '@/components/layout/container';

const LEARNING_TOPICS = [
  {
    title: 'How Aeroponics Works',
    description: 'Discover the science behind growing plants with mist and air instead of soil.',
    icon: Leaf,
    href: '/learn/how-aeroponics-works',
  },
  {
    title: 'Setup Guide',
    description: 'Step-by-step instructions to assemble and start your Urbanvana tower.',
    icon: BookOpen,
    href: '/learn/setup-guide',
  },
  {
    title: 'Nutrient Guide',
    description: 'Learn how to balance pH, TDS, and mix the perfect nutrient solution.',
    icon: Droplets,
    href: '/learn/nutrients',
  },
  {
    title: 'Growing Tips',
    description: 'Expert advice on planting, pruning, and harvesting your fresh produce.',
    icon: Sprout,
    href: '/learn/growing-tips',
  },
];

export default function LearnPage() {
  return (
    <div className="bg-[var(--color-bg)] py-16 md:py-24">
      <Container>
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-[#002304] px-6 py-20 text-center shadow-[var(--shadow-xl)] sm:px-12 md:py-32 mb-16">
          <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] mix-blend-overlay"></div>
          
          <div className="relative z-10 mx-auto max-w-2xl">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h1 className="font-heading text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl mb-6">
              Learning Center
            </h1>
            
            <p className="font-body text-lg text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
              Master the art of soil-free growing. Whether you're setting up your first tower or looking to optimize your harvest, we have everything you need to succeed.
            </p>
            
            {/* Highlighted Manual Button */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a 
                href="https://docs.google.com/document/d/1gdnnk70u0nAD6HyeFnQjX0XQvktqXiDzYHZCDJDFago/edit?tab=t.0"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-[var(--color-primary)] px-8 py-4 font-heading text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-[var(--color-primary-dark)] hover:scale-105 shadow-[0_8px_30px_rgba(0,184,83,0.3)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/30"
              >
                <BookOpen className="h-5 w-5" />
                View Learning Manual
                <ExternalLink className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Learning Topics Grid */}
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-[var(--color-ink)] md:text-4xl">
              Explore Topics
            </h2>
            <p className="mt-4 font-body text-[var(--color-text-muted)]">
              Dive deeper into specific areas of your growing journey.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {LEARNING_TOPICS.map((topic) => (
              <Link 
                key={topic.title} 
                href={topic.href}
                className="group flex flex-col rounded-2xl border border-[var(--color-border)] bg-white p-8 transition-all duration-300 hover:border-[var(--color-primary)]/50 hover:shadow-[var(--shadow-md)]"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--color-primary-light)]/40 transition-colors group-hover:bg-[var(--color-primary-light)]">
                  <topic.icon className="h-7 w-7 text-[var(--color-primary)]" />
                </div>
                <h3 className="mb-3 font-heading text-xl font-bold text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-primary)]">
                  {topic.title}
                </h3>
                <p className="font-body text-[var(--color-text-muted)] leading-relaxed flex-1">
                  {topic.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
