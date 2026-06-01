import { TOOLS, TOOL_GROUPS } from '../lib/tools.config';
import ToolCard from '../components/ToolCard';

export default function Home() {
  // Map for O(1) lookup; preserve declaration order otherwise.
  const byId = new Map(TOOLS.map((t) => [t.id, t]));
  // Tools not assigned to any group still render under a fallback section.
  const grouped = new Set(TOOL_GROUPS.flatMap((g) => g.toolIds));
  const ungrouped = TOOLS.filter((t) => !grouped.has(t.id));

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

      <div className="space-y-7">
        {TOOL_GROUPS.map((group) => {
          const groupTools = group.toolIds.map((id) => byId.get(id)).filter(Boolean) as typeof TOOLS;
          if (groupTools.length === 0) return null;

          const isFeatured = group.id === 'crypto';

          return (
            <section key={group.id} aria-labelledby={`group-${group.id}`}>
              {/* Section header */}
              <header className="mb-3 flex items-baseline gap-3">
                <span
                  aria-hidden
                  className="h-[2px] w-7 shrink-0"
                  style={{ background: isFeatured ? 'var(--accent)' : 'var(--rule)' }}
                />
                <div>
                  <h2
                    id={`group-${group.id}`}
                    className={`font-display leading-none ${isFeatured ? 'text-[22px]' : 'text-[19px]'}`}
                    style={{ color: 'var(--ink)' }}
                  >
                    {group.label}
                  </h2>
                  <p
                    className="font-mono text-[10px] uppercase tracking-[0.18em] mt-1"
                    style={{ color: isFeatured ? 'var(--accent)' : 'var(--ink-3)' }}
                  >
                    {group.tagline}
                  </p>
                </div>
              </header>

              <div className="grid grid-cols-1 gap-2.5 lex-stagger">
                {groupTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Fallback: any tool not in a group still gets rendered */}
        {ungrouped.length > 0 && (
          <section aria-labelledby="group-other">
            <header className="mb-3 flex items-baseline gap-3">
              <span aria-hidden className="h-[2px] w-7 shrink-0" style={{ background: 'var(--rule)' }} />
              <h2
                id="group-other"
                className="font-display text-[19px] leading-none"
                style={{ color: 'var(--ink)' }}
              >
                More
              </h2>
            </header>
            <div className="grid grid-cols-1 gap-2.5 lex-stagger">
              {ungrouped.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
