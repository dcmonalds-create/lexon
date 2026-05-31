import { TOOLS } from '../lib/tools.config';
import ToolCard from '../components/ToolCard';

export default function Home() {
  return (
    <div>
      {/* Editorial masthead */}
      <div className="mb-7 rule-above">
        <p
          className="font-mono text-[10px] uppercase tracking-[0.22em]"
          style={{ color: 'var(--ink-3)' }}
        >
          Issue No. 01 · Legal Counsel
        </p>
        <h1
          className="font-display text-[44px] leading-[0.95] mt-1.5"
          style={{ color: 'var(--ink)' }}
        >
          What do you<br />
          <span className="italic" style={{ color: 'var(--accent)' }}>need to know?</span>
        </h1>
        <p
          className="text-[13.5px] mt-3 max-w-[28ch]"
          style={{ color: 'var(--ink-2)' }}
        >
          One USDT for the answer a lawyer would give you for two hundred.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 lex-stagger">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
