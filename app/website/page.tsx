// app/website/page.tsx  –  mock website landing page (secondary route)
'use client';
import Link from 'next/link';
import { schoolData } from '@/data/school';
import { Music, Phone, Mail, MapPin, Clock, Star, Users, ChevronRight } from 'lucide-react';

const STYLE_EMOJI: Record<string, string> = {
  'Hip Hop': '🎤', Ballet: '🩰', Salsa: '💃', Bollywood: '🎬',
  Contemporary: '🌊', Zumba: '🔥', 'Kids Creative Dance': '🎨', Jazz: '🎷',
};

export default function WebsitePage() {
  const uniqueStyles = [...new Set(schoolData.classes.map((c) => c.style))];
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
      {/* Banner */}
      <div className="text-center py-2 px-4 text-xs font-medium"
        style={{ background: 'linear-gradient(90deg, #F43F5E, #8B5CF6)', color: '#fff' }}>
        🚀 Demo website — <Link href="/" className="underline font-bold">Open the AI chatbot →</Link>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-40 glass border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#F43F5E,#8B5CF6)' }}>
              <Music className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">Rhythm &amp; Soul</span>
          </div>
          <Link href="/"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white send-btn transition-all">
            Open AI Chat <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.12), rgba(99,102,241,0.12))' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium mb-6 border border-[var(--border)]">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            Austin&apos;s Premier Dance Studio Since 2012
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text">{schoolData.tagline}</h1>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto mb-8 leading-relaxed">{schoolData.about}</p>
          <Link href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white send-btn transition-all">
            Chat with our AI · Book Free Trial
          </Link>
        </div>
      </section>

      {/* Classes grid */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Dance Styles</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {uniqueStyles.map((style) => (
            <div key={style} className="glass rounded-2xl p-4 text-center hover:border-purple-500/40 transition-all border border-[var(--border)]">
              <div className="text-3xl mb-2">{STYLE_EMOJI[style] ?? '🎵'}</div>
              <p className="text-sm font-semibold">{style}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                from ${schoolData.classes.find((c) => c.style === style)?.pricePerClass ?? 0}/class
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Instructors */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-[var(--border)]">
        <h2 className="text-2xl font-bold text-center mb-8">Our Instructors</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {schoolData.instructors.map((inst) => (
            <div key={inst.id} className="glass rounded-2xl p-4 border border-[var(--border)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#F43F5E,#8B5CF6)' }}>
                  {inst.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-sm">{inst.name}</p>
                  <p className="text-xs gradient-text">{inst.specialty}</p>
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{inst.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Music className="w-4 h-4 text-purple-400" />
              <span className="font-bold">Rhythm &amp; Soul</span>
            </div>
            <p className="text-[var(--text-secondary)] text-xs">{schoolData.about.slice(0, 100)}…</p>
          </div>
          <div>
            <p className="font-semibold mb-3 text-xs uppercase tracking-wide text-[var(--text-muted)]">Contact</p>
            <div className="space-y-2 text-xs text-[var(--text-secondary)]">
              <div className="flex gap-2"><MapPin className="w-3 h-3 text-purple-400 flex-shrink-0 mt-0.5" />{schoolData.address}</div>
              <div className="flex gap-2"><Phone className="w-3 h-3 text-purple-400" />{schoolData.phone}</div>
              <div className="flex gap-2"><Mail className="w-3 h-3 text-purple-400" />{schoolData.email}</div>
            </div>
          </div>
          <div>
            <p className="font-semibold mb-3 text-xs uppercase tracking-wide text-[var(--text-muted)]">Hours</p>
            {Object.entries(schoolData.hours).map(([day, hrs]) => (
              <div key={day} className="flex justify-between text-xs text-[var(--text-secondary)]">
                <span className="capitalize text-[var(--text-muted)]">{day}</span>
                <span>{hrs}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-1"><Users className="w-3 h-3" />500+ students</div>
          <div className="flex items-center gap-1"><Clock className="w-3 h-3" />Open 7 days</div>
          <p>© 2024 Rhythm &amp; Soul Dance Academy</p>
        </div>
      </footer>
    </div>
  );
}
