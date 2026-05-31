import { useNavigate } from 'react-router-dom';
import {
  FileText, AlertTriangle, Home, Briefcase, Receipt, Coins, ScrollText, Link, PenLine, ShieldAlert, BadgeDollarSign, GitCompareArrows,
} from 'lucide-react';
import type { Tool } from '../types';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  AlertTriangle,
  Home,
  Briefcase,
  Receipt,
  Coins,
  ScrollText,
  Link,
  PenLine,
  ShieldAlert,
  BadgeDollarSign,
  GitCompareArrows,
};

export default function ToolCard({ tool }: { tool: Tool }) {
  const navigate = useNavigate();
  const IconComponent = ICON_MAP[tool.icon];

  return (
    <button
      onClick={() => navigate(`/tool/${tool.id}`)}
      className={`${tool.color} rounded-2xl p-4 text-left transition-all active:scale-[0.97] hover:shadow-md border border-transparent hover:border-gray-200 w-full`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shrink-0">
          {IconComponent ? (
            <IconComponent className="w-5 h-5 text-gray-700" />
          ) : (
            <span className="text-lg">{tool.icon}</span>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 text-sm">{tool.name}</h3>
            <span className="text-[10px] font-medium bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full">
              {tool.price} USDT
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{tool.tagline}</p>
        </div>
      </div>
    </button>
  );
}
