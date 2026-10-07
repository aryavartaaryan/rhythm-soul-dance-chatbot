'use client';
import { motion } from 'framer-motion';

const COLORS = [
  'from-rose-500 to-pink-600',
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
];

export interface InstructorData {
  id: string; name: string; specialty: string; yearsExperience: number; bio: string;
}

interface Props { instructors: InstructorData[] }

export default function InstructorCard({ instructors }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {instructors.map((inst, i) => (
        <motion.div
          key={inst.id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: i * 0.05 }}
          className="glass rounded-2xl p-4 flex flex-col gap-2 min-w-[200px] max-w-[220px] flex-shrink-0"
        >
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${COLORS[i % COLORS.length]} flex items-center justify-center text-lg font-bold text-white`}>
            {inst.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <p className="font-semibold text-sm text-[var(--text-primary)]">{inst.name}</p>
            <p className="text-xs gradient-text font-medium">{inst.specialty}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{inst.yearsExperience} yrs experience</p>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">{inst.bio}</p>
        </motion.div>
      ))}
    </div>
  );
}
