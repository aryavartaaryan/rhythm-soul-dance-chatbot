'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, ThumbsUp, ThumbsDown, Music } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  richComponent?: React.ReactNode;
}

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const [copied, setCopied] = useState(false);
  const isBot = message.role === 'model';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn('flex gap-3 group', isBot ? 'justify-start' : 'justify-end')}
    >
      {/* Bot avatar */}
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
          style={{ background: 'linear-gradient(135deg, #F43F5E, #8B5CF6, #6366F1)' }}>
          <Music className="w-3.5 h-3.5 text-white" />
        </div>
      )}

      <div className={cn('flex flex-col gap-1 max-w-[80%]', isBot ? 'items-start' : 'items-end')}>
        {/* Bubble */}
        <div
          className={cn(
            'px-4 py-3 rounded-2xl text-sm leading-relaxed',
            isBot
              ? 'glass rounded-bl-sm text-[var(--text-primary)]'
              : 'rounded-br-sm text-white'
          )}
          style={!isBot ? { background: 'linear-gradient(135deg, #F43F5E, #8B5CF6)' } : {}}
        >
          {isBot ? (
            <div className="prose-chat">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {/* Rich component (class cards, pricing, etc.) */}
        {message.richComponent && (
          <div className="w-full mt-1">{message.richComponent}</div>
        )}

        {/* Actions row — show on hover */}
        <div className={cn(
          'flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
          isBot ? 'ml-1' : 'mr-1'
        )}>
          <span className="text-[10px] text-[var(--text-muted)]">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isBot && (
            <>
              <button onClick={handleCopy} aria-label="Copy message"
                className="p-1 rounded hover:bg-white/10 transition-colors ml-1">
                {copied
                  ? <Check className="w-3 h-3 text-green-400" />
                  : <Copy className="w-3 h-3 text-[var(--text-muted)]" />}
              </button>
              <button aria-label="Thumbs up" className="p-1 rounded hover:bg-white/10 transition-colors">
                <ThumbsUp className="w-3 h-3 text-[var(--text-muted)]" />
              </button>
              <button aria-label="Thumbs down" className="p-1 rounded hover:bg-white/10 transition-colors">
                <ThumbsDown className="w-3 h-3 text-[var(--text-muted)]" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
