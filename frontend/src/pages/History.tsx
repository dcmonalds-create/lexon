import { useEffect } from 'react';
import { useHistoryStore } from '../store/historyStore';
import { useUserStore } from '../store/userStore';
import { getHistory } from '../lib/api';
import { getToolById } from '../lib/tools.config';
import ResultCard from '../components/ResultCard';
import Loader from '../components/Loader';
import { Clock } from 'lucide-react';

export default function History() {
  const { items, loading, setItems, setLoading } = useHistoryStore();
  const telegramId = useUserStore((s) => s.telegramId);

  useEffect(() => {
    if (!telegramId) return;
    setLoading(true);
    getHistory(telegramId)
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [telegramId, setItems, setLoading]);

  if (loading) return <Loader text="Loading history..." />;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
        <Clock className="w-10 h-10" />
        <p className="text-sm">No results yet</p>
        <p className="text-xs">Your paid analyses will appear here</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Your Results</h2>
      <div className="space-y-4">
        {items.map((item) => {
          const tool = getToolById(item.tool_id);
          return (
            <ResultCard
              key={item.id}
              toolName={tool?.name || item.tool_id}
              fullResult={item.full_result}
              timestamp={item.created_at}
            />
          );
        })}
      </div>
    </div>
  );
}
