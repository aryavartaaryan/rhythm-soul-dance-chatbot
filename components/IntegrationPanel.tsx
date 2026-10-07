// components/IntegrationPanel.tsx
// Shows lead/booking payloads captured by the bot in real-time.
// This is the "what the business sees" selling point panel.

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Database, X } from 'lucide-react';

export interface CapturedEvent {
  id: string;
  type: 'capture_lead' | 'book_trial_class';
  payload: Record<string, unknown>;
  capturedAt: string;
}

interface Props {
  events: CapturedEvent[];
  onClear: () => void;
}

export default function IntegrationPanel({ events, onClear }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-gray-100 bg-amber-50">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5" />
          What the business sees
          {events.length > 0 && (
            <span className="bg-amber-600 text-white rounded-full px-1.5 py-0.5 text-xs leading-none">
              {events.length}
            </span>
          )}
        </span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 max-h-64 overflow-y-auto">
          <p className="text-xs text-amber-700 mb-3 leading-relaxed">
            In production, these payloads are sent automatically to your CRM or booking system (HubSpot, Zoho, Calendly, etc.).
          </p>

          {events.length === 0 ? (
            <p className="text-xs text-amber-600 italic">
              No events yet. Try asking the bot to book a free trial class or leave your contact details.
            </p>
          ) : (
            <>
              <div className="flex justify-end mb-2">
                <button
                  onClick={onClear}
                  className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-800 transition-colors"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              </div>
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="bg-white rounded-lg border border-amber-200 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-amber-100 border-b border-amber-200">
                      <span className="font-mono text-xs font-bold text-amber-900">
                        {event.type === 'capture_lead' ? 'LEAD CAPTURED' : 'TRIAL BOOKING'}
                      </span>
                      <span className="text-xs text-amber-600">{new Date(event.capturedAt).toLocaleTimeString()}</span>
                    </div>
                    <pre className="text-xs p-3 overflow-x-auto text-gray-700 leading-relaxed">
                      {JSON.stringify(event.payload, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
