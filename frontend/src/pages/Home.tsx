import { TOOLS } from '../lib/tools.config';
import ToolCard from '../components/ToolCard';

export default function Home() {
  return (
    <div>
      {/* Editorial masthead */}
      <div className="mb-7 rule-above">
        <h1
          className="font-display text-[34px] leading-[1.05]"
          style={{ color: 'var(--ink)' }}
        >
          AI-powered <span className="italic" style={{ color: 'var(--accent)' }}>legal super-app.</span>
        </h1>
        <p
          className="text-[14px] leading-relaxed mt-4"
          style={{ color: 'var(--ink-2)' }}
        >
          Scan contracts, dispute fines, know your rental rights, check employment law, force refunds, get crypto tax guidance, and decode government forms.
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
