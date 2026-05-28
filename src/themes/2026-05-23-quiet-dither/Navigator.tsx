import { useEffect, useRef } from 'react';
import type { SiteInfo, ColorScheme } from '@/theme-runtime/types';
import { useThemeNavigator } from '@/theme-runtime/navigator';
import { formatAuthor, formatDisplayDate } from '@/themes/manifest';

type Props = {
  initialSlug: string;
  about: SiteInfo;
  scheme: ColorScheme;
  onToggleTheme: () => void;
};

const BTN =
  'h-8 min-w-8 px-2 grid place-items-center rounded-[9px] bg-transparent border-0 cursor-pointer text-[var(--qd-muted)] transition-colors hover:text-[var(--qd-text)] hover:bg-[var(--qd-hover)] disabled:opacity-30 disabled:pointer-events-none';

export default function QuietDitherNavigator({ initialSlug, about, scheme, onToggleTheme }: Props) {
  const { themes, current, newer, older, expanded, setExpanded, infoOpen, setInfoOpen, navigateTo } =
    useThemeNavigator({ initialSlug });

  const wrapRef = useRef<HTMLDivElement>(null);

  // Close the open panel on an outside click.
  useEffect(() => {
    if (!expanded && !infoOpen) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setExpanded(false);
        setInfoOpen(false);
      }
    };
    const id = window.setTimeout(() => document.addEventListener('click', onClick), 0);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener('click', onClick);
    };
  }, [expanded, infoOpen, setExpanded, setInfoOpen]);

  return (
    <div
      ref={wrapRef}
      className="qd-nav qd-mono fixed left-1/2 -translate-x-1/2 z-[100] text-[12px] pointer-events-none [&>*]:pointer-events-auto"
    >
      {expanded && (
        <div
          className="absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-[min(92vw,580px)] max-h-[52vh] overflow-y-auto rounded-[14px] border border-[var(--qd-line)] bg-[var(--qd-surface)] shadow-[0_18px_50px_-18px_rgba(0,0,0,0.6)] py-1.5"
          role="dialog"
          aria-label="Version timeline"
        >
          <div className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--qd-muted)]">
            <span>timeline</span>
            <span className="opacity-40">·</span>
            <span>{themes.length} versions</span>
          </div>
          <ul className="list-none p-0 m-0">
            {themes.map((t) => {
              const isCurrent = t.slug === current.slug;
              return (
                <li key={t.slug}>
                  <button
                    type="button"
                    onClick={() => {
                      setExpanded(false);
                      navigateTo(t);
                    }}
                    className={`flex w-full items-baseline gap-4 px-4 py-2.5 text-left bg-transparent border-0 cursor-pointer transition-colors hover:bg-[var(--qd-hover)] ${
                      isCurrent ? 'bg-[var(--qd-hover)]' : ''
                    }`}
                  >
                    <span className={`shrink-0 ${isCurrent ? 'text-[var(--qd-accent)]' : 'text-transparent'}`}>▸</span>
                    <span className="shrink-0 w-[78px] text-[var(--qd-muted)]">{formatDisplayDate(t.meta.date)}</span>
                    <span
                      className={`shrink-0 w-[150px] ${isCurrent ? 'text-[var(--qd-text)] font-medium' : 'text-[var(--qd-muted)]'}`}
                    >
                      {t.meta.name}
                    </span>
                    <span className="flex-1 min-w-0 truncate text-[11px] text-[var(--qd-muted)] opacity-80">
                      {formatAuthor(t.meta)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {infoOpen && (
        <div
          className="absolute bottom-[calc(100%+10px)] right-0 w-[330px] rounded-[14px] border border-[var(--qd-line)] bg-[var(--qd-surface)] shadow-[0_18px_50px_-18px_rgba(0,0,0,0.6)] px-5 py-4 flex flex-col gap-2"
          role="dialog"
          aria-label={about.title}
        >
          <div className="text-[13px] font-medium text-[var(--qd-text)]">{about.title}</div>
          <div className="text-[12px] text-[var(--qd-muted)]">{about.tagline}</div>
          <div className="text-[11px] leading-[1.6] text-[var(--qd-muted)] opacity-80">{about.description}</div>
        </div>
      )}

      <div className="flex items-center gap-1 rounded-[14px] border border-[var(--qd-line)] bg-[var(--qd-surface)] px-1.5 py-1.5 shadow-[0_10px_36px_-18px_rgba(0,0,0,0.5)]">
        <button className={BTN} onClick={() => navigateTo(older)} disabled={!older} aria-label="Older version">
          ‹
        </button>

        <button
          type="button"
          className="h-8 px-3 flex items-center gap-2 rounded-[9px] bg-transparent border-0 cursor-pointer hover:bg-[var(--qd-hover)] transition-colors leading-none"
          onClick={() => {
            setExpanded((v) => !v);
            setInfoOpen(false);
          }}
          aria-label="Toggle version timeline"
          aria-expanded={expanded}
        >
          <span className="qd-nav-text text-[var(--qd-muted)]">{formatDisplayDate(current.meta.date)}</span>
          <span className="qd-nav-text text-[var(--qd-text)] font-medium whitespace-nowrap">{current.meta.name}</span>
        </button>

        <button className={BTN} onClick={() => navigateTo(newer)} disabled={!newer} aria-label="Newer version">
          ›
        </button>

        <span className="w-px h-5 bg-[var(--qd-line)] mx-1" />

        <button
          type="button"
          className={BTN}
          onClick={() => {
            setInfoOpen((v) => !v);
            setExpanded(false);
          }}
          aria-label="About this site"
          aria-expanded={infoOpen}
        >
          ?
        </button>

        <button type="button" className={BTN} onClick={onToggleTheme} aria-label="Toggle light or dark">
          {scheme === 'dark' ? '☾' : '☀'}
        </button>
      </div>
    </div>
  );
}
