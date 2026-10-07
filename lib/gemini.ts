// lib/gemini.ts
// Lazy-initialised Gemini client. Called only from server-side routes at request time,
// so the missing-key check runs at runtime (not at build time).

import { GoogleGenAI } from '@google/genai';

let _client: GoogleGenAI | null = null;

export function getGenAI(): GoogleGenAI {
  if (_client) return _client;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Missing environment variable GEMINI_API_KEY. ' +
      'Add it to .env.local for local dev or to your Vercel project settings for production.'
    );
  }
  _client = new GoogleGenAI({ apiKey });
  return _client;
}

// Model name driven by env var — defaults to gemini-2.5-flash for free-tier usage.
export const MODEL_NAME = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
