import { Sparkles } from 'lucide-react';

interface CeremonialRuleProps {
  className?: string;
}

/**
 * Tapering gilded horizontal rule with a centered starlight motif.
 */
export function CeremonialRule({ className = '' }: CeremonialRuleProps) {
  return (
    <div className={`flex items-center justify-center gap-4 my-8 ${className}`} aria-hidden="true">
      <div className="ceremonial-rule flex-1 max-w-36" />
      <span className="flex items-center justify-center w-7 h-7 rounded-full border border-gold/40 bg-parchment text-gold">
        <Sparkles className="w-3.5 h-3.5" />
      </span>
      <div className="ceremonial-rule flex-1 max-w-36" />
    </div>
  );
}
