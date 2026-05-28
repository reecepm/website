import { useEffect, useRef } from 'react';
import type { SiteInfo } from '@/theme-runtime/types';
import { useThemeNavigator } from '@/theme-runtime/navigator';
import { formatAuthor, formatDisplayDate } from '@/themes/manifest';

type Props = {
  initialSlug: string;
  about: SiteInfo;
};

const BTN =
  'bg-transparent border-0 px-1.5 py-1 cursor-pointer font-mono text-[11px] inline-flex gap-0.5 text-[var(--mt-muted)] transition-colors hover:text-[var(--mt-accent)] disabled:opacity-40 disabled:cursor-not-allowed';

const BRACKET = 'text-[var(--mt-text-secondary)] opacity-50';

export default function MonospaceTerminalNavigator({ initialSlug, about }: Props) {
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
  } = useThemeNavigator({ initialSlug });

  const infoWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!infoOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!infoWrapperRef.current) return;
      if (!infoWrapperRef.current.contains(e.target as Node)) {
        setInfoOpen(false);
      }
    };
    const id = window.setTimeout(() => document.addEventListener('click', onClick), 0);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener('click', onClick);
    };
  }, [infoOpen, setInfoOpen]);

  const author = formatAuthor(current.meta);
  const description = current.meta.description ?? '';

  return (
    <div className="fixed left-0 right-0 bottom-0 z-[100] font-mono pointer-events-none [&>*]:pointer-events-auto">
      {expanded && (
        <div
          className="bg-[var(--mt-bg)] border-t border-[var(--mt-border)] max-h-[50vh] overflow-y-auto"
          role="dialog"
          aria-label="Theme timeline"
        >
          <div className="flex flex-row items-center gap-3 px-8 pt-3.5 pb-2.5 text-[var(--mt-muted)] text-[11px] uppercase tracking-wider">
            <span>timeline</span>
            <span className="text-[var(--mt-border)]">·</span>
            <span>{themes.length} {themes.length === 1 ? 'entry' : 'entries'}</span>
            <div className="flex-1" />
            <span>↑ scroll</span>
            <span className="text-[var(--mt-border)]">·</span>
            <span>esc to close</span>
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
                    className={`flex flex-row items-center w-full gap-6 bg-transparent border-0 border-t border-t-[var(--mt-bg-elevated)] font-mono text-left cursor-pointer transition-colors hover:bg-[var(--mt-bg-elevated)] ${
                      isCurrent ? 'py-2.5 px-8 bg-[var(--mt-bg-elevated)]' : 'py-2 px-8'
                    }`}
                  >
                    <span
                      className={`text-xs w-3 shrink-0 ${
                        isCurrent ? 'text-[var(--mt-accent)]' : 'text-[var(--mt-border)]'
                      }`}
                    >
                      {isCurrent ? '▸' : ' '}
                    </span>
                    <span
                      className={`text-xs w-[92px] shrink-0 ${
                        isCurrent ? 'text-[var(--mt-text)]' : 'text-[var(--mt-muted)]'
                      }`}
                    >
                      {formatDisplayDate(t.meta.date)}
                    </span>
                    <span
                      className={`text-xs w-[200px] shrink-0 ${
                        isCurrent ? 'text-[var(--mt-accent)] font-medium' : 'text-[var(--mt-muted)]'
                      }`}
                    >
                      {t.meta.id}
                    </span>
                    <span
                      className={`text-[11px] w-[220px] shrink-0 ${
                        isCurrent ? 'text-[var(--mt-muted)]' : 'text-[var(--mt-text-secondary)] opacity-70'
                      }`}
                    >
                      {formatAuthor(t.meta)}
                    </span>
                    <span
                      className={`text-[11px] flex-1 whitespace-nowrap overflow-hidden text-ellipsis min-w-0 ${
                        isCurrent ? 'text-[var(--mt-muted)]' : 'text-[var(--mt-text-secondary)] opacity-70'
                      }`}
                    >
                      {t.meta.description ?? ''}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="flex flex-row items-center min-h-10 px-4 md:px-8 gap-3 bg-[var(--mt-bg)] border-t border-[var(--mt-border)] text-[var(--mt-text)] text-xs pb-[env(safe-area-inset-bottom)]">
        {/* terminal info — truncates as one unit so it never pushes the controls off-screen */}
        <div className="flex-1 min-w-0 truncate">
          <span className="text-[var(--mt-accent)] font-medium text-[13px]">$</span>{' '}
          <span className="text-[var(--mt-muted)] max-md:hidden">~/themes/ </span>
          <span className="text-[var(--mt-text)] font-medium">{formatDisplayDate(current.meta.date)}</span>
          <span className="text-[var(--mt-border)]"> · </span>
          <span className="text-[var(--mt-accent)]">{current.meta.id}</span>
          <span className="text-[var(--mt-border)] max-md:hidden"> · </span>
          <span className="text-[var(--mt-muted)] max-md:hidden">{author}</span>
          <span className="text-[var(--mt-border)] max-md:hidden"> · </span>
          <span className="text-[var(--mt-text-secondary)] opacity-70 max-md:hidden">{description}</span>
        </div>

        <div className="flex flex-row items-center gap-2 md:gap-3 shrink-0">
          <button
            type="button"
            className={BTN}
            onClick={() => navigateTo(older)}
            disabled={!older}
            aria-label="Previous theme"
          >
            <span className={BRACKET}>[</span>
            <span>prev</span>
            <span className={BRACKET}>]</span>
          </button>
          <span className="text-[var(--mt-border)] max-md:hidden">·</span>
          <button
            type="button"
            className={BTN}
            onClick={() => navigateTo(newer)}
            disabled={!newer}
            aria-label="Next theme"
          >
            <span className={BRACKET}>[</span>
            <span>next</span>
            <span className={BRACKET}>]</span>
          </button>
          <span className="text-[var(--mt-border)] max-md:hidden">·</span>
          <button
            type="button"
            className={BTN}
            onClick={() => {
              setExpanded((v) => !v);
              setInfoOpen(false);
            }}
            aria-label="Toggle timeline"
            aria-expanded={expanded}
          >
            <span className={BRACKET}>[</span>
            <span>list</span>
            <span className={BRACKET}>]</span>
          </button>
          <span className="text-[var(--mt-border)] max-md:hidden">·</span>

          <div className="relative inline-flex" ref={infoWrapperRef}>
            <button
              type="button"
              className={BTN}
              onClick={() => {
                setInfoOpen((v) => !v);
                setExpanded(false);
              }}
              onMouseEnter={() => setInfoOpen(true)}
              aria-label="About this site"
              aria-expanded={infoOpen}
            >
              <span className={BRACKET}>[</span>
              <span className="text-[var(--mt-accent)]">?</span>
              <span className={BRACKET}>]</span>
            </button>
            {infoOpen && (
              <div
                className="absolute bottom-[calc(100%+16px)] right-0 w-[360px] max-w-[90vw] bg-[var(--mt-bg)] border border-[var(--mt-accent)] px-5 pt-[18px] pb-3.5 flex flex-col gap-2.5 z-[101]"
                role="dialog"
                aria-label={about.title}
                onMouseLeave={() => setInfoOpen(false)}
              >
                <div className="text-[var(--mt-accent)] text-[13px] font-medium tracking-[0.02em]">
                  {about.title}
                </div>
                <div className="text-[var(--mt-text)] text-xs leading-[1.4]">{about.tagline}</div>
                <div className="text-[var(--mt-muted)] text-[11px] leading-[1.55]">
                  {about.description}
                </div>
                <div className="flex flex-row items-center gap-1.5 pt-2.5 border-t border-[var(--mt-bg-elevated)] text-[var(--mt-text-secondary)] opacity-60 text-[10px] uppercase tracking-[0.08em]">
                  <span>press</span>
                  <span className="text-[var(--mt-muted)] border border-[var(--mt-bg-elevated)] px-[5px] py-px opacity-100">
                    esc
                  </span>
                  <span>to close</span>
                </div>
                <div className="absolute bottom-[-6px] right-3 w-2.5 h-2.5 bg-[var(--mt-bg)] border-r border-b border-[var(--mt-accent)] rotate-45" />
              </div>
            )}
          </div>

          <span className="inline-block w-2 h-3.5 bg-[var(--mt-accent)] ml-1 shrink-0 animate-[mt-blink_1.2s_step-end_infinite] max-md:hidden" />
        </div>
      </div>
    </div>
  );
}
