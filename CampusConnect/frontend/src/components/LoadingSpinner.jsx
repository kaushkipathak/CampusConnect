import React from 'react';
import { Sparkles } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading campus events...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-lavender/30 border-t-brand-violet animate-spin" />
        <Sparkles className="w-5 h-5 text-brand-coral absolute animate-pulse" />
      </div>
      <p className="text-sm font-medium text-brand-charcoal/70 tracking-wide">{message}</p>
    </div>
  );
}
