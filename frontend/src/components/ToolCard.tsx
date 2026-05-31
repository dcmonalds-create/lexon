import { useNavigate } from 'react-router-dom';
import {
  FileText, AlertTriangle, Home, Briefcase, Receipt, Coins, ScrollText, Link, PenLine,
  ShieldAlert, BadgeDollarSign, GitCompareArrows, FileWarning,
} from 'lucide-react';
import type { Tool } from '../types';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  FileText, AlertTriangle, Home, Briefcase, Receipt, Coins, ScrollText, Link, PenLine,
  ShieldAlert, BadgeDollarSign, GitCompareArrows, FileWarning,
};

export default function ToolCard({ tool }: { tool: Tool }) {
  const navigate = useNavigate();
  const IconComponent = ICON_MAP[tool.icon];

  return (
    <button
      onClick={() => navigate(`/tool/${tool.id}`)}
      className="group relative w-full text-left transition-all active:scale-[0.985]"
      style={{
        background: 'var(--paper-3)',
        border: '1px solid var(--rule-soft)',
        borderRadius: '14px',
        padding: '14px 16px 14px 18px',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink-3)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--rule-soft)'; }}
    >
      {/* Sienna spine — appears on hover */}
      <span
        aria-hidden
        className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'var(--accent)' }}
      />

      <div className="flex items-start gap-3.5">
        {/* Icon plate */}
        <div
          className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
          style={{
            background: 'var(--brand-soft)',
            color: 'var(--brand)',
          }}
        >
          {IconComponent ? (
            <IconComponent className="w-[18px] h-[18px]" strokeWidth={1.7} />
          ) : (
            <span className="text-base">{tool.icon}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {/* Tool name in display serif + price in mono */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3
              className="font-display text-[19px] leading-none"
              style={{ color: 'var(--ink)' }}
            >
              {tool.name}
            </h3>
            <span
              className="font-mono text-[10px] tabular tracking-wide"
              style={{ color: 'var(--ink-3)' }}
            >
              {tool.price} USDT
            </span>
          </div>

          <p
            className="text-[13px] mt-1.5 leading-snug"
            style={{ color: 'var(--ink-2)' }}
          >
            {tool.tagline}
          </p>
        </div>
      </div>
    </button>
  );
}
