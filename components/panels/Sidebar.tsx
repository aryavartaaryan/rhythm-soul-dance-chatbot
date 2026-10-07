'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Plus, X, Phone, Clock } from 'lucide-react';
import { cn } from '@/lib/cn';

const TOPICS = [
  { label: 'Classes offered',         msg: 'What classes do you offer?' },
  { label: 'Weekly schedule',         msg: "What's the schedule this week?" },
  { label: 'Pricing & packs',         msg: 'Tell me about pricing and packages' },
  { label: 'Meet instructors',        msg: 'Tell me about your instructors' },
  { label: 'Book free trial',         msg: 'I want to book a free trial class' },
  { label: 'Contact & location',      msg: 'Where are you located and how do I contact you?' },
  { label: 'Do you teach tango?',     msg: 'Do you teach tango?' },
  { label: 'Kids classes',            msg: 'Do you have classes for kids?' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectTopic: (msg: string) => void;
  isMobile: boolean;
}

export default function Sidebar({ isOpen, onClose, onNewChat, onSelectTopic, isMobile }: Props) {
  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #F43F5E, #8B5CF6)' }}>
            <Music className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--text-primary)] leading-tight">Rhythm &amp; Soul</p>
            <p className="text-[10px] text-[var(--text-muted)]">Dance Academy</p>
          </div>
        </div>
        {isMobile && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>
        )}
      </div>

      {/* New chat */}
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <button onClick={() => { onNewChat(); if(isMobile) onClose(); }}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium send-btn text-white transition-all">
          <Plus className="w-4 h-4" />
          New conversation
        </button>
      </div>

      {/* Quick topics */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] px-2 mb-2">
          Quick topics
        </p>
        <div className="space-y-0.5">
          {TOPICS.map(({ label, msg }) => (
            <button key={label}
              onClick={() => { onSelectTopic(msg); if(isMobile) onClose(); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-white/6 hover:text-[var(--text-primary)] transition-all">
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer card */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="glass rounded-xl p-3 space-y-2">
          <p className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-purple-400" />Studio Hours
          </p>
          {[
            ['Mon–Thu', '9 AM – 9 PM'],
            ['Friday', '9 AM – 8 PM'],
            ['Saturday', '8 AM – 6 PM'],
            ['Sunday', '10 AM – 4 PM'],
          ].map(([day, hrs]) => (
            <div key={day} className="flex justify-between text-[10px]">
              <span className="text-[var(--text-muted)]">{day}</span>
              <span className="text-[var(--text-secondary)]">{hrs}</span>
            </div>
          ))}
          <div className="pt-1 border-t border-[var(--border)] flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-purple-400" />
            <span className="text-[10px] text-[var(--text-secondary)]">(512) 555-0147</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/60 z-40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose} />
            <motion.aside
              className="fixed left-0 top-0 bottom-0 w-72 z-50 overflow-hidden"
              style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
              initial={{ x: -288 }} animate={{ x: 0 }} exit={{ x: -288 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <aside className={cn(
      'flex-shrink-0 flex-col overflow-hidden transition-all duration-300 border-r border-[var(--border)]',
      isOpen ? 'w-72 flex' : 'w-0 hidden'
    )} style={{ background: 'var(--surface)' }}>
      {content}
    </aside>
  );
}
