// app/chat/page.tsx
// Full-screen chat interface — shareable direct link.

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCcw, Music, Wifi, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import ChatMessage from '@/components/ChatMessage';
import TypingIndicator from '@/components/TypingIndicator';
import QuickReplies from '@/components/QuickReplies';
import IntegrationPanel, { type CapturedEvent } from '@/components/IntegrationPanel';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'model',
  content:
    "Hi there! I'm **Rhythm**, the virtual assistant for **Rhythm & Soul Dance Academy**. 🎵\n\nI can help you find the perfect class, answer questions about our schedule and pricing, or book your **FREE first trial class**.\n\nWhat can I do for you today?",
};

const QUICK_REPLIES = [
  'What classes do you offer?',
  'Help me find a class',
  'Pricing & packs',
  'Book a free trial',
  'Class timings this week',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<CapturedEvent[]>([]);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim().slice(0, 500);
      if (!trimmed || isLoading) return;

      setShowQuickReplies(false);
      const userMsg: Message = { id: Date.now().toString(), role: 'user', content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      try {
        const allMessages = [...messages, userMsg].filter((m) => m.id !== 'welcome');
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? 'Unknown error');
        }

        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: data.response,
        };
        setMessages((prev) => [...prev, botMsg]);

        if (data.functionCall) {
          const event: CapturedEvent = {
            id: Date.now().toString(),
            type: data.functionCall.type,
            payload: data.functionCall.payload,
            capturedAt: new Date().toISOString(),
          };
          setEvents((prev) => [...prev, event]);
        }
      } catch (err: unknown) {
        const error = err as Error;
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content:
            error.message?.startsWith("I'm")
              ? error.message
              : "I'm having trouble right now. Please try again in a moment or contact us at **(512) 555-0147** or **hello@rhythmandsoul.dance**.",
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const handleReset = () => {
    setMessages([WELCOME_MESSAGE]);
    setShowQuickReplies(true);
    setEvents([]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-700 to-pink-600 text-white flex-shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1.5 rounded-full hover:bg-white/20 transition-colors mr-1">
            <ArrowLeft className="w-4 h-4 text-white" />
          </Link>
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <Music className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">Rhythm & Soul Dance Academy</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Wifi className="w-2.5 h-2.5 text-green-300" />
              <span className="text-xs text-green-300 font-medium">AI Assistant Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-xs text-purple-200 bg-white/10 rounded-full px-3 py-1">
            <Sparkles className="w-3 h-3" />
            Powered by Gemini AI
          </div>
          <button
            onClick={handleReset}
            aria-label="New chat"
            title="Start new conversation"
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 text-gray-900 text-center py-1.5 px-4 text-xs font-medium flex-shrink-0">
        Demo Mode — Sample data. Built to be customised for your dance school.
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 max-w-3xl mx-auto w-full scroll-smooth">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        )}
        {showQuickReplies && !isLoading && messages.length === 1 && (
          <QuickReplies suggestions={QUICK_REPLIES} onSelect={sendMessage} disabled={isLoading} />
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 500))}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Ask about classes, pricing, book a trial..."
              className="flex-1 px-4 py-3 text-sm rounded-full border border-gray-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 disabled:opacity-50 transition-all bg-gray-50"
              maxLength={500}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center disabled:opacity-40 hover:shadow-md transition-all active:scale-95"
              aria-label="Send message"
            >
              <svg className="w-4 h-4 text-white rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Powered by Gemini AI · Rhythm & Soul Dance Academy · (512) 555-0147
          </p>
        </div>
        {/* Integration Panel */}
        <IntegrationPanel events={events} onClear={() => setEvents([])} />
      </div>
    </div>
  );
}
