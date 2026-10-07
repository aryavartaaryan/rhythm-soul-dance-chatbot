'use client';
import { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled: boolean;
}

export default function InputBar({ value, onChange, onSend, disabled }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const remaining = 500 - value.length;

  return (
    <div className="glass rounded-2xl mx-4 mb-4 overflow-hidden border border-[var(--border)] focus-within:border-purple-500/50 transition-colors">
      <div className="flex items-end gap-2 p-3">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, 500))}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask about classes, pricing, schedule…"
          rows={1}
          className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none outline-none leading-relaxed min-h-[24px] max-h-[160px] disabled:opacity-50"
          aria-label="Message input"
        />
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center send-btn transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
      <div className="flex items-center justify-between px-3 pb-2">
        <p className="text-[10px] text-[var(--text-muted)]">
          Demo with sample data · Powered by Gemini AI
        </p>
        <span className={`text-[10px] tabular-nums ${remaining < 50 ? 'text-rose-400' : 'text-[var(--text-muted)]'}`}>
          {remaining}
        </span>
      </div>
    </div>
  );
}
