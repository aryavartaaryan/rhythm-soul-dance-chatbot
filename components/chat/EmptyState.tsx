'use client';
import { motion } from 'framer-motion';
import { Music, Search, DollarSign, Users, Calendar, Sparkles, Star } from 'lucide-react';
import { cn } from '@/lib/cn';

const SUGGESTIONS = [
  { icon: Music,    text: 'What classes do you offer?',         color: 'from-rose-500 to-pink-500' },
  { icon: Search,   text: 'Help me find the right class',       color: 'from-violet-500 to-purple-500' },
  { icon: DollarSign, text: 'Pricing and packages',            color: 'from-indigo-500 to-blue-500' },
  { icon: Users,    text: 'Meet the instructors',               color: 'from-emerald-500 to-teal-500' },
  { icon: Calendar, text: "This week's schedule",               color: 'from-amber-500 to-orange-500' },
  { icon: Star,     text: 'Book a free trial class',            color: 'from-fuchsia-500 to-rose-500' },
];

interface Props {
  onSelect: (text: string) => void;
}

export default function EmptyState({ onSelect }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-12 text-center">
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'backOut' }}
        className="relative mb-6"
      >
        <div className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #F43F5E, #8B5CF6, #6366F1)' }}>
          <Music className="w-9 h-9 text-white" />
        </div>
        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[var(--bg)] flex items-center justify-center">
          <Sparkles className="w-2.5 h-2.5 text-white" />
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
      >
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Hi, I&apos;m <span className="gradient-text">Aria</span> 👋
        </h2>
        <p className="text-[var(--text-secondary)] text-sm max-w-sm mb-8">
          Your AI assistant at <strong className="text-[var(--text-primary)]">Rhythm &amp; Soul Dance Academy</strong>.
          I can help you find the perfect class, check pricing, or book your free trial.
        </p>
      </motion.div>

      {/* Suggestion grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.35 }}
      >
        {SUGGESTIONS.map(({ icon: Icon, text, color }, i) => (
          <motion.button
            key={text}
            onClick={() => onSelect(text)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="suggestion-card glass rounded-xl p-3 text-left flex flex-col gap-2 hover:border-purple-500/40 transition-all cursor-pointer"
          >
            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br', color)}>
              <Icon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs text-[var(--text-secondary)] font-medium leading-snug">{text}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
