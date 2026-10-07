// components/chat/ChatShell.tsx  –  full 3-panel chat application shell
'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Music, Sun, Moon, Database, PanelLeftOpen, PanelLeftClose,
  RotateCcw, Wifi,
} from 'lucide-react';

import MessageList from './MessageList';
import InputBar from './InputBar';
import Sidebar from '@/components/panels/Sidebar';
import IntegrationPanel, { type CapturedEvent } from '@/components/panels/IntegrationPanel';
import ClassCarousel from '@/components/cards/ClassCarousel';
import PricingCard from '@/components/cards/PricingCard';
import InstructorCard, { type InstructorData } from '@/components/cards/InstructorCard';
import SuccessCard from '@/components/cards/SuccessCard';
import type { Message } from './MessageBubble';
import type { ClassData } from '@/components/cards/ClassCard';

type Theme = 'dark' | 'light';

// ── helpers ──────────────────────────────────────────────────────────────────
let msgId = 0;
const newId = () => `m${++msgId}`;

const WELCOME: Message = {
  id: 'welcome',
  role: 'model',
  content: "Hi! I'm **Aria**, your Rhythm & Soul assistant. I can help you find the perfect class, check pricing, or book your **free trial**. What would you like to know? 🎵",
  timestamp: new Date(),
};

// ── component ─────────────────────────────────────────────────────────────────
export default function ChatShell() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<CapturedEvent[]>([]);

  // Detect mobile
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const addMessage = (msg: Omit<Message, 'id'>) =>
    setMessages((prev) => [...prev, { ...msg, id: newId() }]);

  const handleReset = () => {
    setMessages([]);
    setInput('');
  };

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim().slice(0, 500);
    if (!trimmed || isLoading) return;

    const userMsg: Message = { id: newId(), role: 'user', content: trimmed, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMsg]
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? 'Unknown error');

      const fc = data.functionCall;
      let richComponent: React.ReactNode | undefined;

      // Build rich in-chat component for function results
      if (fc) {
        if (fc.type === 'show_classes' && Array.isArray(fc.richData)) {
          richComponent = (
            <ClassCarousel
              classes={fc.richData as ClassData[]}
              onBookTrial={(className) =>
                sendMessage(`I'd like to book a free trial for ${className}`)
              }
            />
          );
        } else if (fc.type === 'show_pricing') {
          richComponent = (
            <PricingCard
              onBookTrial={() => sendMessage("I'd like to book a free trial class")}
            />
          );
        } else if (fc.type === 'show_instructors' && Array.isArray(fc.richData)) {
          richComponent = <InstructorCard instructors={fc.richData as InstructorData[]} />;
        } else if (fc.type === 'capture_lead') {
          const p = fc.payload as Record<string, string>;
          richComponent = (
            <SuccessCard
              type="lead"
              name={p.name}
              email={p.email}
              interestedClass={p.interestedClass}
            />
          );
          setEvents((prev) => [...prev, {
            id: newId(),
            type: 'capture_lead',
            payload: fc.payload,
            capturedAt: new Date().toISOString(),
          }]);
          if (!panelOpen && !isMobile) setPanelOpen(true);
        } else if (fc.type === 'book_trial_class') {
          const p = fc.payload as Record<string, string>;
          richComponent = (
            <SuccessCard
              type="booking"
              name={p.name}
              email={p.email}
              classId={p.classId}
              preferredDate={p.preferredDate}
            />
          );
          setEvents((prev) => [...prev, {
            id: newId(),
            type: 'book_trial_class',
            payload: fc.payload,
            capturedAt: new Date().toISOString(),
          }]);
          if (!panelOpen && !isMobile) setPanelOpen(true);
        }
      }

      addMessage({ role: 'model', content: data.response, timestamp: new Date(), richComponent });
    } catch (err: unknown) {
      const e = err as Error;
      addMessage({
        role: 'model',
        content: e.message?.startsWith("I'm")
          ? e.message
          : "I'm having trouble right now. Please try again or call us at **(512) 555-0147**.",
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, panelOpen, isMobile]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* Radial glow behind chat */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)' }} />
      </div>

      {/* ── Left Sidebar ── */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleReset}
        onSelectTopic={sendMessage}
        isMobile={isMobile}
      />

      {/* ── Center: chat ── */}
      <main className="flex flex-col flex-1 min-w-0 overflow-hidden relative">

        {/* Top bar */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] glass flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle sidebar"
              className="p-2 rounded-xl hover:bg-white/8 transition-colors"
            >
              {sidebarOpen && !isMobile
                ? <PanelLeftClose className="w-4 h-4 text-[var(--text-secondary)]" />
                : <PanelLeftOpen  className="w-4 h-4 text-[var(--text-secondary)]" />
              }
            </button>

            {/* Bot identity */}
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #F43F5E, #8B5CF6, #6366F1)' }}>
                  <Music className="w-4 h-4 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2"
                  style={{ borderColor: 'var(--bg)' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)] leading-tight">Aria</p>
                <div className="flex items-center gap-1">
                  <Wifi className="w-2.5 h-2.5 text-green-400" />
                  <span className="text-[10px] text-green-400">Online</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Theme toggle */}
            <button onClick={() => setTheme((t) => t === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="p-2 rounded-xl hover:bg-white/8 transition-colors">
              {theme === 'dark'
                ? <Sun  className="w-4 h-4 text-[var(--text-secondary)]" />
                : <Moon className="w-4 h-4 text-[var(--text-secondary)]" />}
            </button>

            {/* Integration panel toggle */}
            <motion.button
              onClick={() => setPanelOpen((o) => !o)}
              aria-label="Toggle integration panel"
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                panelOpen
                  ? 'text-purple-300 bg-purple-500/15 border border-purple-500/30'
                  : 'text-[var(--text-secondary)] hover:bg-white/8'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Business view</span>
              {events.length > 0 && (
                <span className="w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#F43F5E,#8B5CF6)' }}>
                  {events.length}
                </span>
              )}
            </motion.button>

            {/* Reset */}
            <button onClick={handleReset} aria-label="New chat"
              className="p-2 rounded-xl hover:bg-white/8 transition-colors">
              <RotateCcw className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <MessageList
          messages={messages}
          isLoading={isLoading}
          onSuggestionSelect={sendMessage}
        />

        {/* Input */}
        <InputBar
          value={input}
          onChange={setInput}
          onSend={() => sendMessage(input)}
          disabled={isLoading}
        />
      </main>

      {/* ── Right panel ── */}
      <IntegrationPanel
        events={events}
        onClear={() => setEvents([])}
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        isMobile={isMobile}
      />
    </div>
  );
}
