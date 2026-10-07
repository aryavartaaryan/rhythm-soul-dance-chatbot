// components/ChatWidget.tsx
// The floating chat widget embedded in the landing page.
// On mobile: full-screen overlay. On desktop: floating panel bottom-right.

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, RotateCcw, Music, Wifi } from 'lucide-react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import QuickReplies from './QuickReplies';
import IntegrationPanel, { type CapturedEvent } from './IntegrationPanel';

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

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<CapturedEvent[]>([]);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [hasUnread, setHasUnread] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when widget opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setHasUnread(false);
    }
  }, [isOpen]);

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

        // Handle function call events for the integration panel
        if (data.functionCall) {
          const event: CapturedEvent = {
            id: Date.now().toString(),
            type: data.functionCall.type,
            payload: data.functionCall.payload,
            capturedAt: new Date().toISOString(),
          };
          setEvents((prev) => [...prev, event]);
        }

        // If widget is closed, show unread badge
        if (!isOpen) setHasUnread(true);
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
    [messages, isLoading, isOpen]
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
    <>
      {/* Floating bubble button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
            )}
          </>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[370px] max-w-[calc(100vw-1.5rem)] h-[580px] max-h-[calc(100vh-7rem)] bg-gray-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-4 duration-200
          sm:w-[370px] sm:bottom-24 sm:right-6
          max-sm:bottom-0 max-sm:right-0 max-sm:w-full max-sm:h-full max-sm:max-h-full max-sm:rounded-none">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-700 to-pink-600 text-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Music className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm leading-tight">Rhythm & Soul</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Wifi className="w-2.5 h-2.5 text-green-300" />
                  <span className="text-xs text-green-300 font-medium">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleReset}
              aria-label="New chat"
              title="Start new conversation"
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 scroll-smooth">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}
            {showQuickReplies && !isLoading && messages.length === 1 && (
              <QuickReplies
                suggestions={QUICK_REPLIES}
                onSelect={sendMessage}
                disabled={isLoading}
              />
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="flex-shrink-0 border-t border-gray-200 bg-white px-3 py-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 500))}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="Ask about classes, pricing..."
                className="flex-1 px-3 py-2 text-sm rounded-full border border-gray-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 disabled:opacity-50 transition-all bg-gray-50"
                maxLength={500}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={isLoading || !input.trim()}
                className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center disabled:opacity-40 hover:shadow-md transition-all active:scale-95"
                aria-label="Send message"
              >
                <svg className="w-4 h-4 text-white rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1.5 text-center">
              Powered by AI · Rhythm & Soul Dance Academy
            </p>
          </div>

          {/* Integration Preview Panel */}
          <IntegrationPanel events={events} onClear={() => setEvents([])} />
        </div>
      )}
    </>
  );
}
