// app/api/chat/route.ts  –  server-only Gemini handler
import { NextRequest, NextResponse } from 'next/server';
import { HarmCategory, HarmBlockThreshold, Type, type Tool } from '@google/genai';
import { getGenAI, MODEL_NAME } from '@/lib/gemini';
import { buildSystemPrompt } from '@/lib/systemPrompt';
import { checkRateLimit } from '@/lib/rateLimit';
import { schoolData } from '@/data/school';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ChatMessage { role: 'user' | 'model'; content: string; }

interface LeadPayload {
  name: string; email?: string; phone?: string;
  interestedClass: string; notes?: string; capturedAt: string;
}
interface BookingPayload {
  name: string; email: string; classId: string; preferredDate: string; bookedAt: string;
}

// ── Gemini tool declarations ──────────────────────────────────────────────────
const TOOLS: Tool[] = [{
  functionDeclarations: [
    {
      name: 'show_classes',
      description: 'Show rich class cards in the chat UI for specific classes. Call this whenever recommending 1-4 classes. Always also include a short text reply.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          classIds: { type: Type.STRING, description: 'Comma-separated class IDs from school data (e.g. "cls-001,cls-003")' },
          message:  { type: Type.STRING, description: 'Short text response to show alongside the cards' },
        },
        required: ['classIds', 'message'],
      },
    },
    {
      name: 'show_pricing',
      description: 'Show a rich pricing card in the chat UI. Call when the user asks about pricing, packages, or cost.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          message: { type: Type.STRING, description: 'Short text response to accompany the pricing card' },
        },
        required: ['message'],
      },
    },
    {
      name: 'show_instructors',
      description: 'Show instructor profile cards in the chat UI. Call when the user asks about instructors.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          instructorIds: { type: Type.STRING, description: 'Comma-separated instructor IDs, or "all" for all instructors' },
          message:       { type: Type.STRING, description: 'Short text response to accompany the cards' },
        },
        required: ['instructorIds', 'message'],
      },
    },
    {
      name: 'capture_lead',
      description: 'Save a prospective student lead (name + email/phone + class interest). Call after collecting their details.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          name:            { type: Type.STRING, description: 'Full name' },
          email:           { type: Type.STRING, description: 'Email address' },
          phone:           { type: Type.STRING, description: 'Phone number (optional)' },
          interestedClass: { type: Type.STRING, description: 'Class name or style they are interested in' },
          notes:           { type: Type.STRING, description: 'Any extra notes' },
        },
        required: ['name', 'interestedClass'],
      },
    },
    {
      name: 'book_trial_class',
      description: 'Book a free trial class for a student. Call when they provide name, email, class ID, and a preferred date.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          name:          { type: Type.STRING, description: 'Full name' },
          email:         { type: Type.STRING, description: 'Email for confirmation' },
          classId:       { type: Type.STRING, description: 'Class ID (e.g. cls-003)' },
          preferredDate: { type: Type.STRING, description: 'Preferred date string' },
        },
        required: ['name', 'email', 'classId', 'preferredDate'],
      },
    },
  ],
}];

const SAFETY = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// ── Tool handlers ─────────────────────────────────────────────────────────────
function handleShowClasses(args: Record<string, string>) {
  const ids = (args.classIds ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const classes = ids.map((id) => schoolData.classes.find((c) => c.id === id)).filter(Boolean);
  return { classes, message: args.message ?? '' };
}

function handleShowPricing(args: Record<string, string>) {
  return { pricing: schoolData.pricing, message: args.message ?? '' };
}

function handleShowInstructors(args: Record<string, string>) {
  const raw = (args.instructorIds ?? 'all').toLowerCase();
  const instructors =
    raw === 'all'
      ? schoolData.instructors
      : raw.split(',').map((id) => schoolData.instructors.find((i) => i.id === id.trim())).filter(Boolean);
  return { instructors, message: args.message ?? '' };
}

function handleCaptureLead(args: Record<string, string>) {
  const payload: LeadPayload = {
    name: args.name, email: args.email, phone: args.phone,
    interestedClass: args.interestedClass, notes: args.notes,
    capturedAt: new Date().toISOString(),
  };
  console.log('[LEAD]', JSON.stringify(payload));
  // ── PRODUCTION: replace with real CRM call ──────────────────────────────
  // await fetch('https://api.hubspot.com/crm/v3/objects/contacts', { ... })
  // ─────────────────────────────────────────────────────────────────────────
  return {
    payload,
    message: `Got it! I've saved your details — our team will confirm your free trial shortly. 🎉`,
  };
}

function handleBookTrialClass(args: Record<string, string>) {
  const payload: BookingPayload = {
    name: args.name, email: args.email, classId: args.classId,
    preferredDate: args.preferredDate, bookedAt: new Date().toISOString(),
  };
  console.log('[BOOKING]', JSON.stringify(payload));
  // ── PRODUCTION: replace with Calendly / Google Calendar call ─────────────
  // await fetch(process.env.BOOKING_WEBHOOK_URL!, { method:'POST', body: JSON.stringify(payload) })
  // ─────────────────────────────────────────────────────────────────────────
  return {
    payload,
    message: `You're booked! A confirmation will be sent to ${args.email}. Can't wait to see you on the dance floor! 💃🕺`,
  };
}

// ── Main POST handler ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many messages — please wait a minute." }, { status: 429 });
    }

    let body: { messages?: unknown };
    try { body = await req.json(); } catch {
      return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
    }

    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ error: 'messages array required.' }, { status: 400 });
    }

    const rawMessages = body.messages as Array<{ role: string; content: string }>;
    const valid: ChatMessage[] = rawMessages
      .filter((m) => m && (m.role === 'user' || m.role === 'model') && typeof m.content === 'string' && m.content.trim())
      .map((m) => ({ role: m.role as 'user' | 'model', content: m.content.slice(0, 500) }));

    if (!valid.length) return NextResponse.json({ error: 'No valid messages.' }, { status: 400 });

    const trimmed = valid.slice(-12);
    const history = trimmed.slice(0, -1).map((m) => ({ role: m.role, parts: [{ text: m.content }] }));
    const last = trimmed[trimmed.length - 1];

    const chat = getGenAI().chats.create({
      model: MODEL_NAME,
      config: { systemInstruction: buildSystemPrompt(), tools: TOOLS, safetySettings: SAFETY },
      history,
    });

    const resp = await chat.sendMessage({ message: last.content });
    const parts = resp.candidates?.[0]?.content?.parts ?? [];

    let textResponse = '';
    let functionCall: { type: string; payload: Record<string, unknown>; richData?: unknown; message?: string } | null = null;

    for (const part of parts) {
      if (part.text) { textResponse += part.text; continue; }
      if (!part.functionCall) continue;

      const { name, args } = part.functionCall;
      const fn = (args ?? {}) as Record<string, string>;

      try {
        if (name === 'show_classes') {
          const r = handleShowClasses(fn);
          textResponse = r.message;
          functionCall = { type: 'show_classes', payload: {}, richData: r.classes, message: r.message };
          await chat.sendMessage({ message: [{ functionResponse: { name, response: { ok: true } } }] });
        } else if (name === 'show_pricing') {
          const r = handleShowPricing(fn);
          textResponse = r.message;
          functionCall = { type: 'show_pricing', payload: {}, richData: r.pricing, message: r.message };
          await chat.sendMessage({ message: [{ functionResponse: { name, response: { ok: true } } }] });
        } else if (name === 'show_instructors') {
          const r = handleShowInstructors(fn);
          textResponse = r.message;
          functionCall = { type: 'show_instructors', payload: {}, richData: r.instructors, message: r.message };
          await chat.sendMessage({ message: [{ functionResponse: { name, response: { ok: true } } }] });
        } else if (name === 'capture_lead') {
          const r = handleCaptureLead(fn);
          textResponse = r.message;
          functionCall = { type: 'capture_lead', payload: r.payload as unknown as Record<string,unknown>, message: r.message };
          await chat.sendMessage({ message: [{ functionResponse: { name, response: { success: true } } }] });
        } else if (name === 'book_trial_class') {
          const r = handleBookTrialClass(fn);
          textResponse = r.message;
          functionCall = { type: 'book_trial_class', payload: r.payload as unknown as Record<string,unknown>, message: r.message };
          await chat.sendMessage({ message: [{ functionResponse: { name, response: { success: true } } }] });
        }
      } catch {
        // Function call failed — fallback to plain text
        textResponse = "I've noted your request! Our team will follow up with you shortly.";
      }
      break;
    }

    if (!textResponse) {
      textResponse = "I'm sorry, could you rephrase that? Or call us at **(512) 555-0147**.";
    }

    return NextResponse.json({ response: textResponse, functionCall });
  } catch (err: unknown) {
    const e = err as { status?: number };
    console.error('[CHAT API]', err);
    if (e?.status === 429) {
      return NextResponse.json({ error: "I'm handling a lot of requests. Please try again in a moment." }, { status: 429 });
    }
    return NextResponse.json(
      { error: "I'm having trouble right now. Please try again or call us at (512) 555-0147." },
      { status: 500 }
    );
  }
}
