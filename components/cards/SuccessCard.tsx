'use client';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar } from 'lucide-react';

interface Props {
  type: 'lead' | 'booking';
  name: string;
  email?: string;
  interestedClass?: string;
  classId?: string;
  preferredDate?: string;
}

export default function SuccessCard({ type, name, email, interestedClass, classId, preferredDate }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl p-4 w-full max-w-sm border border-green-500/30"
      style={{ background: 'rgba(34,197,94,0.08)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
        <p className="font-semibold text-sm text-green-300">
          {type === 'booking' ? "You're booked!" : 'Details saved!'}
        </p>
      </div>
      <div className="space-y-1 text-xs text-[var(--text-secondary)]">
        <p><span className="text-[var(--text-primary)] font-medium">Name:</span> {name}</p>
        {email && <p><span className="text-[var(--text-primary)] font-medium">Email:</span> {email}</p>}
        {interestedClass && <p><span className="text-[var(--text-primary)] font-medium">Class:</span> {interestedClass}</p>}
        {classId && <p><span className="text-[var(--text-primary)] font-medium">Class ID:</span> {classId}</p>}
        {preferredDate && (
          <p className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span className="text-[var(--text-primary)] font-medium">Date:</span> {preferredDate}
          </p>
        )}
      </div>
      <p className="text-[10px] text-[var(--text-muted)] mt-3">
        {type === 'booking'
          ? 'A confirmation email is on its way. See you on the dance floor! 💃'
          : 'Our team will be in touch shortly to confirm your free trial.'}
      </p>
    </motion.div>
  );
}
