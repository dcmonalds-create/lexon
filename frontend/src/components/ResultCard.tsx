import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check } from 'lucide-react';

interface ResultCardProps {
  toolName: string;
  fullResult: string;
  timestamp?: number;
}

export default function ResultCard({ toolName, fullResult, timestamp }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
  };

  return (
    <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">{toolName} — Full Analysis</h4>
          {timestamp && (
            <p className="text-[10px] text-gray-400 mt-0.5">
              {new Date(timestamp * 1000).toLocaleDateString()}
            </p>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-500" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
      <div className="px-5 py-4 prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-800">
        <ReactMarkdown>{fullResult}</ReactMarkdown>
      </div>
    </div>
  );
}
