'use client';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import MessageBubble, { type Message } from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import EmptyState from './EmptyState';

interface Props {
  messages: Message[];
  isLoading: boolean;
  onSuggestionSelect: (text: string) => void;
}

export default function MessageList({ messages, isLoading, onSuggestionSelect }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 120);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="relative flex-1 overflow-hidden">
      <div ref={containerRef} onScroll={handleScroll}
        className="h-full overflow-y-auto px-4 py-6 space-y-4 scroll-smooth">
        {isEmpty
          ? <EmptyState onSelect={onSuggestionSelect} />
          : (
            <>
              <AnimatePresence initial={false}>
                {messages.map((m) => <MessageBubble key={m.id} message={m} />)}
              </AnimatePresence>
              {isLoading && (
                <motion.div className="flex justify-start"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <TypingIndicator />
                </motion.div>
              )}
            </>
          )
        }
        <div ref={bottomRef} />
      </div>

      {/* Scroll-to-bottom button */}
      <AnimatePresence>
        {showScrollBtn && !isEmpty && (
          <motion.button
            onClick={scrollToBottom}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-4 right-4 w-8 h-8 rounded-full glass border border-[var(--border)] flex items-center justify-center shadow-lg hover:bg-white/10 transition-colors"
          >
            <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
