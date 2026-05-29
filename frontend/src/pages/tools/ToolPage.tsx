import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getToolById } from '../../lib/tools.config';
import { useToolSubmit } from '../../hooks/useToolSubmit';
import Paywall from '../../components/Paywall';
import ResultCard from '../../components/ResultCard';
import Loader from '../../components/Loader';

export default function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const tool = getToolById(toolId || '');
  const { submit, loading, error, result, reset } = useToolSubmit();
  const [input, setInput] = useState('');
  const [fullResult, setFullResult] = useState<string | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.BackButton.show();
      const goBack = () => navigate(-1);
      tg.BackButton.onClick(goBack);
      return () => {
        tg.BackButton.offClick(goBack);
        tg.BackButton.hide();
      };
    }
  }, [navigate]);

  if (!tool) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Tool not found</p>
        <button onClick={() => navigate('/')} className="text-emerald-600 text-sm mt-2">
          Back to tools
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium');
    submit(tool.id, input);
  };

  const handleNewAnalysis = () => {
    setInput('');
    setFullResult(null);
    reset();
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 mb-4 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className={`${tool.color} rounded-2xl p-5 mb-4`}>
        <h2 className="text-lg font-bold text-gray-900">{tool.name}</h2>
        <p className="text-xs text-gray-500 mt-1">{tool.tagline}</p>
        <p className="text-sm text-gray-600 mt-2">{tool.description}</p>
      </div>

      {fullResult ? (
        <div>
          <ResultCard toolName={tool.name} fullResult={fullResult} />
          <button
            onClick={handleNewAnalysis}
            className="w-full mt-4 py-3 px-6 rounded-2xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            New Analysis
          </button>
        </div>
      ) : result ? (
        <Paywall
          teaser={result.teaser}
          sessionToken={result.sessionToken}
          toolName={tool.name}
          onUnlocked={setFullResult}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {tool.inputLabel}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={tool.inputPlaceholder}
              rows={6}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          {loading ? (
            <Loader text="Analyzing your case..." />
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-full bg-[#1D4035] hover:bg-[#164030] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-2xl transition-colors text-sm"
            >
              Analyze
            </button>
          )}
        </form>
      )}
    </div>
  );
}
