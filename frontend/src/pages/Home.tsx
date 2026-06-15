import { TOOLS, TOOL_GROUPS } from '../lib/tools.config';
import ToolCard from '../components/ToolCard';
import { Users, ArrowUpRight } from 'lucide-react';

const FAMILYPOCKET_URL = 'https://t.me/famillypocket_bot';

function openFamilyPocket() {
  const tg = window.Telegram?.WebApp;
  if (tg?.openTelegramLink) {
    tg.openTelegramLink(FAMILYPOCKET_URL);
  } else {
    window.open(FAMILYPOCKET_URL, '_blank', 'noopener,noreferrer');
  }
  tg?.HapticFeedback?.impactOccurred('light');
}

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

        {/* ─── Cross-promo: FamilyPocket ─────────────────────────────── */}
        <section aria-labelledby="group-familypocket">
          <header className="mb-3 flex items-baseline gap-3">
            <span
              aria-hidden
              className="h-[2px] w-7 shrink-0"
              style={{ background: 'var(--rule)' }}
            />
            <div>
              <h2
                id="group-familypocket"
                className="font-display text-[19px] leading-none"
                style={{ color: 'var(--ink)' }}
              >
                Also from us
              </h2>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.18em] mt-1"
                style={{ color: 'var(--ink-3)' }}
              >
                Shared rooms · Family budgeting
              </p>
            </div>
          </header>

          <button
            onClick={openFamilyPocket}
            className="w-full text-left rounded-[14px] p-5 transition-colors"
            style={{
              background: 'var(--paper-3)',
              border: '1px solid var(--rule-soft)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--rule-soft)';
            }}
            aria-label="Open FamilyPocket on Telegram"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                <Users className="w-[18px] h-[18px]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3
                    className="font-display text-[18px] leading-tight"
                    style={{ color: 'var(--ink)' }}
                  >
                    FamilyPocket
                  </h3>
                  <ArrowUpRight
                    className="w-3.5 h-3.5"
                    style={{ color: 'var(--accent)' }}
                  />
                </div>
                <p
                  className="text-[13px] leading-relaxed mt-1"
                  style={{ color: 'var(--ink-2)' }}
                >
                  Budget together. Invite a partner, family or roommates into one shared room — track spending by Telegram ID, settle up without spreadsheets.
                </p>
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.18em] mt-2"
                  style={{ color: 'var(--ink-3)' }}
                >
                  t.me/famillypocket_bot →
                </p>
              </div>
            </div>
          </button>
        </section>

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
