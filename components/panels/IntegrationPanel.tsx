'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, X, ChevronDown, ChevronUp, Wifi, Trash2 } from 'lucide-react';

export interface CapturedEvent {
  id: string;
  type: 'capture_lead' | 'book_trial_class';
  payload: Record<string, unknown>;
  capturedAt: string;
}

interface Props {
  events: CapturedEvent[];
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const INTEGRATIONS = [
  { name: 'Website widget', icon: '🌐', status: 'Connected' },
  { name: 'HubSpot CRM',   icon: '🔗', status: 'Ready' },
  { name: 'Calendly',      icon: '📅', status: 'Ready' },
  { name: 'Email notify',  icon: '📧', status: 'Ready' },
];

function JsonViewer({ data }: { data: Record<string, unknown> }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-lg overflow-hidden border border-white/8">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-1.5 bg-white/4 text-xs font-mono text-[var(--text-muted)] hover:bg-white/8 transition-colors">
        <span>payload</span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.pre
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden text-[11px] font-mono leading-relaxed px-3 py-2 text-green-300 bg-black/20"
          >
            {JSON.stringify(data, null, 2)}
          </motion.pre>
        )}
      </AnimatePresence>
    </div>
  );
}

function PanelContent({ events, onClear }: { events: CapturedEvent[]; onClear: () => void }) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-400" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">Business view</p>
          {events.length > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
              style={{ background: 'linear-gradient(135deg,#F43F5E,#8B5CF6)' }}>
              {events.length}
            </span>
          )}
        </div>
        {events.length > 0 && (
          <button onClick={onClear} className="p-1.5 rounded-lg hover:bg-white/8 transition-colors">
            <Trash2 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Integration status */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
            Integration status
          </p>
          <div className="space-y-1.5">
            {INTEGRATIONS.map(({ name, icon, status }) => (
              <div key={name} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/3 border border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{icon}</span>
                  <span className="text-xs text-[var(--text-secondary)]">{name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wifi className="w-2.5 h-2.5 text-green-400" />
                  <span className="text-[10px] text-green-400 font-medium">{status}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[var(--text-muted)] mt-2 leading-relaxed">
            In production, every lead flows into your CRM and booking system automatically.
          </p>
        </div>

        {/* Live events */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
            Live captures
          </p>
          {events.length === 0 ? (
            <div className="text-center py-8 glass rounded-2xl">
              <Database className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
              <p className="text-xs text-[var(--text-muted)]">
                Leads captured by the chatbot will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((ev) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-xl overflow-hidden"
                >
                  <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)]">
                    <span className="text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg,#F43F5E,#8B5CF6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                      {ev.type === 'capture_lead' ? '● Lead captured' : '● Trial booked'}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      {new Date(ev.capturedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="p-3">
                    <JsonViewer data={ev.payload} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function IntegrationPanel({ events, onClear, isOpen, onClose, isMobile }: Props) {
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/60 z-40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose} />
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-80 z-50 overflow-hidden"
              style={{ background: 'var(--surface)', borderLeft: '1px solid var(--border)' }}
              initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            >
              <button onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 transition-colors z-10">
                <X className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
              <PanelContent events={events} onClear={onClear} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className={`flex-shrink-0 overflow-hidden transition-all duration-300 border-l border-[var(--border)] ${isOpen ? 'w-80' : 'w-0'}`}
      style={{ background: 'var(--surface)' }}>
      {isOpen && <PanelContent events={events} onClear={onClear} />}
    </div>
  );
}
