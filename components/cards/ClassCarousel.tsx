'use client';
import ClassCard, { type ClassData } from './ClassCard';

interface Props {
  classes: ClassData[];
  onBookTrial?: (className: string) => void;
}

export default function ClassCarousel({ classes, onBookTrial }: Props) {
  if (classes.length === 0) return null;
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin max-w-full">
      {classes.map((cls) => (
        <ClassCard key={cls.id} cls={cls} onBookTrial={onBookTrial} />
      ))}
    </div>
  );
}
