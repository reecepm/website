import { useThemeNavigator } from '@/theme-runtime/navigator';
import { formatAuthor, formatDisplayDate } from '@/themes/manifest';
import type { SiteInfo } from '@/theme-runtime/types';

type Props = {
  initialSlug: string;
  about: SiteInfo;
  colorScheme: string;
  onToggleTheme: () => void;
};

export default function Navigator({ initialSlug, about, colorScheme, onToggleTheme }: Props) {
  const {
    themes,
    current,
    newer,
    older,
    expanded,
    setExpanded,
    infoOpen,
    setInfoOpen,
    navigateTo,
  } = useThemeNavigator({ initialSlug, keyboard: false });

  if (!current) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 text-xs" style={{ zIndex: 50 }}>
      {expanded && (
        <div
          className="mx-auto max-w-lg mb-1 rounded-lg overflow-hidden"
          style={{
            background: 'var(--pt-surface)',
            border: '1px solid var(--pt-border-bright)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="max-h-48 overflow-y-auto p-2 pt-scroll">
            {themes.map((t) => (
              <button
                key={t.slug}
                onClick={() => navigateTo(t)}
                className={`w-full text-left px-3 py-2.5 sm:py-1.5 rounded flex items-center gap-3 transition-colors ${
                  t.slug === current.slug
                    ? 'bg-[var(--pt-border)] text-[var(--pt-accent)]'
                    : 'hover:bg-[var(--pt-border)] text-[var(--pt-text-dim)]'
                }`}
              >
                <span className="text-[var(--pt-muted)] w-20 shrink-0">
                  {formatDisplayDate(t.meta.date)}
                </span>
                <span className="truncate">{t.meta.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {infoOpen && (
        <div
          className="mx-auto max-w-sm mb-1 rounded-lg p-4"
          style={{
            background: 'var(--pt-surface)',
            border: '1px solid var(--pt-border-bright)',
            backdropFilter: 'blur(16px)',
          }}
          role="dialog"
          aria-label="Theme info"
        >
          <div className="text-[var(--pt-accent)] font-medium mb-1">{about.title}</div>
          <div className="text-[var(--pt-text-dim)] mb-2">{about.description}</div>
          <div className="text-[var(--pt-muted)]">
            Theme: {current.meta.name} · {formatAuthor(current.meta)}
          </div>
          {current.meta.description && (
            <div className="text-[var(--pt-muted)] mt-1">{current.meta.description}</div>
          )}
        </div>
      )}

      <div
        className="flex items-center justify-between px-4 min-h-10"
        style={{
          background: 'var(--pt-surface-solid)',
          borderTop: '1px solid var(--pt-border)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => older && navigateTo(older)}
            disabled={!older}
            className="px-2 py-1 rounded border border-[var(--pt-border-bright)] text-[var(--pt-text-dim)] disabled:text-[var(--pt-muted)] disabled:opacity-30 disabled:border-[var(--pt-border)] hover:text-[var(--pt-accent)] hover:border-[var(--pt-accent)] transition-colors"
            aria-label="Previous theme"
          >
            ‹
          </button>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-[var(--pt-text-dim)] hover:text-[var(--pt-accent)] transition-colors"
            aria-label="Toggle theme list"
            aria-expanded={expanded}
          >
            <span className="truncate max-w-[40vw] sm:max-w-none inline-block align-bottom">{formatDisplayDate(current.meta.date)} · {current.meta.name}</span>
          </button>
          <button
            onClick={() => newer && navigateTo(newer)}
            disabled={!newer}
            className="px-2 py-1 rounded border border-[var(--pt-border-bright)] text-[var(--pt-text-dim)] disabled:text-[var(--pt-muted)] disabled:opacity-30 disabled:border-[var(--pt-border)] hover:text-[var(--pt-accent)] hover:border-[var(--pt-accent)] transition-colors"
            aria-label="Next theme"
          >
            ›
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            className="text-[var(--pt-text-dim)] hover:text-[var(--pt-accent)] transition-colors"
            aria-label="Toggle color scheme"
          >
            {colorScheme === 'dark' ? '○' : '●'}
          </button>
          <button
            onClick={() => setInfoOpen((v) => !v)}
            className="text-[var(--pt-text-dim)] hover:text-[var(--pt-accent)] transition-colors"
            aria-label="Toggle info"
          >
            ?
          </button>
        </div>
      </div>
    </div>
  );
}
