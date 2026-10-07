// components/QuickReplies.tsx
'use client';

interface Props {
  suggestions: string[];
  onSelect: (text: string) => void;
  disabled: boolean;
}

export default function QuickReplies({ suggestions, onSelect, disabled }: Props) {
  return (
    <div className="flex flex-wrap gap-2 px-3 py-2">
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          disabled={disabled}
          className="px-3 py-1.5 text-xs font-medium rounded-full border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:border-purple-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
