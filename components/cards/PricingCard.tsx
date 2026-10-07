'use client';
import { motion } from 'framer-motion';
import { Star, Zap } from 'lucide-react';

interface Props {
  onBookTrial?: () => void;
}

const TIERS = [
  { label: 'Drop-In',           price: 'from $15', sub: 'per class',        highlight: false },
  { label: '4-Class Pack',      price: '$64',      sub: '$16/class · 6 wks', highlight: false },
  { label: '8-Class Pack',      price: '$112',     sub: '$14/class · 10 wks', highlight: true },
  { label: 'Unlimited Monthly', price: '$149',     sub: 'unlimited 30 days', highlight: false },
];

export default function PricingCard({ onBookTrial }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="glass rounded-2xl p-4 w-full max-w-sm flex flex-col gap-3"
    >
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-purple-400" />
        <p className="font-semibold text-sm text-[var(--text-primary)]">Pricing &amp; Packages</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {TIERS.map(({ label, price, sub, highlight }) => (
          <div key={label}
            className={`rounded-xl p-3 flex flex-col gap-1 ${highlight ? 'ring-1 ring-purple-500/50 bg-purple-500/10' : 'bg-white/4'}`}>
            {highlight && <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wide flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-purple-400" />Popular</span>}
            <p className="text-xs font-medium text-[var(--text-secondary)]">{label}</p>
            <p className="text-lg font-bold gradient-text">{price}</p>
            <p className="text-[10px] text-[var(--text-muted)]">{sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-3 text-center"
        style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.15), rgba(99,102,241,0.15))' }}>
        <p className="text-sm font-bold text-[var(--text-primary)]">🎉 First Class FREE</p>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">No credit card required</p>
      </div>

      <button onClick={onBookTrial}
        className="w-full py-2 rounded-xl text-xs font-semibold text-white send-btn transition-all">
        Book my free trial →
      </button>
    </motion.div>
  );
}
