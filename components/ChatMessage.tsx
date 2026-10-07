// components/ChatMessage.tsx
'use client';

import ReactMarkdown from 'react-markdown';
import { Music } from 'lucide-react';

interface Props {
  role: 'user' | 'model';
  content: string;
}

export default function ChatMessage({ role, content }: Props) {
  const isBot = role === 'model';

  return (
    <div className={`flex gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mt-1">
          <Music className="w-3.5 h-3.5 text-white" />
        </div>
      )}

      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isBot
            ? 'bg-white text-gray-800 rounded-bl-sm'
            : 'bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-br-sm'
        }`}
      >
        {isBot ? (
          <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-strong:text-purple-700">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{content}</p>
        )}
      </div>
    </div>
  );
}
