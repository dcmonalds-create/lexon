import { TOOLS } from '../lib/tools.config';
import ToolCard from '../components/ToolCard';

export default function Home() {
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-900">LexOn</h1>
        <p className="text-sm text-gray-500">Your legal co-pilot</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
