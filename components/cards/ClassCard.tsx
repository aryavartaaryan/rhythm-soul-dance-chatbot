'use client';
import { motion } from 'framer-motion';
import { Clock, Users, Calendar, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

const STYLE_EMOJI: Record<string, string> = {
  'Hip Hop': '🎤', Ballet: '🩰', Salsa: '💃', Bollywood: '🎬',
  Contemporary: '🌊', Zumba: '🔥', 'Kids Creative Dance': '🎨', Jazz: '🎷',
};
const LEVEL_COLOR: Record<string, string> = {
  Beginner: 'bg-emerald-500/20 text-emerald-400',
  Intermediate: 'bg-amber-500/20 text-amber-400',
  Advanced: 'bg-rose-500/20 text-rose-400',
};

export interface ClassData {
  id: string; name: string; style: string; level: string; ageGroup: string;
  duration: string; schedule: { day: string; time: string }[];
  instructor: string; pricePerClass: number; maxClassSize: number; description: string;
}

interface Props {
  cls: ClassData;
  onBookTrial?: (className: string) => void;
}

export default function ClassCard({ cls, onBookTrial }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="glass rounded-2xl p-4 flex flex-col gap-3 min-w-[240px] max-w-[280px] flex-shrink-0"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{STYLE_EMOJI[cls.style] ?? '🎵'}</span>
          <div>
            <p className="font-semibold text-sm text-[var(--text-primary)] leading-tight">{cls.name}</p>
            <p className="text-xs text-[var(--text-secondary)]">{cls.ageGroup}</p>
          </div>
        </div>
        <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0', LEVEL_COLOR[cls.level] ?? 'bg-gray-500/20 text-gray-400')}>
          {cls.level}
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 text-xs text-[var(--text-secondary)]">
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{cls.duration}</span>
        <span className="flex items-center gap-1"><Users className="w-3 h-3" />Max {cls.maxClassSize}</span>
      </div>

      {/* Schedule pills */}
      <div className="flex flex-wrap gap-1.5">
        {cls.schedule.map((s) => (
          <span key={s.day + s.time}
            className="flex items-center gap-1 text-xs bg-white/5 border border-white/8 rounded-full px-2 py-0.5 text-[var(--text-secondary)]">
            <Calendar className="w-2.5 h-2.5" />{s.day} {s.time}
          </span>
        ))}
      </div>

      {/* Instructor + price */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--text-secondary)]">with <span className="font-medium text-[var(--text-primary)]">{cls.instructor}</span></p>
        <p className="font-bold text-base gradient-text">${cls.pricePerClass}<span className="text-xs font-normal text-[var(--text-secondary)]">/class</span></p>
      </div>

      {/* CTA */}
      <button
        onClick={() => onBookTrial?.(cls.name)}
        className="w-full flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold text-white send-btn transition-all"
      >
        Book free trial <ChevronRight className="w-3 h-3" />
      </button>
    </motion.div>
  );
}
