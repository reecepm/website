import { useEffect, useRef, useState, type ReactNode } from 'react';

type Bounds = { x: number; y: number; width: number; height: number };

type Props = {
  title: string;
  children: ReactNode;
  onClose?: () => void;
  initialBounds?: Bounds;
  zIndex?: number;
  onFocus?: () => void;
  rightSlot?: ReactNode;
};

const MIN_W = 400;
const MIN_H = 280;

function useMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return mobile;
}

export default function TerminalWindow({
  title,
  children,
  onClose,
  initialBounds: initBounds,
  zIndex = 10,
  onFocus,
  rightSlot,
}: Props) {
  const mobile = useMobile();
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const boundsBeforeMax = useRef<Bounds | null>(null);

  useEffect(() => {
    if (mobile) {
      setBounds({ x: 0, y: 0, width: window.innerWidth, height: window.innerHeight - 40 });
      return;
    }
    if (initBounds) {
      setBounds(initBounds);
      return;
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.min(Math.max(vw * 0.78, MIN_W), 1100);
    const h = Math.min(Math.max(vh * 0.72, MIN_H), vh - 80);
    setBounds({
      x: Math.round((vw - w) / 2),
      y: Math.round((vh - h) / 2) - 20,
      width: w,
      height: h,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobile]);

  const startDrag = (e: React.PointerEvent) => {
    if (mobile || maximized || !bounds) return;
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    onFocus?.();
    const startX = e.clientX;
    const startY = e.clientY;
    const sb = { ...bounds };

    const onMove = (ev: PointerEvent) => {
      setBounds({
        ...sb,
        x: sb.x + (ev.clientX - startX),
        y: Math.max(0, sb.y + (ev.clientY - startY)),
      });
    };
    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  };

  const startResize = (dir: string) => (e: React.PointerEvent) => {
    if (mobile || maximized || minimized || !bounds) return;
    e.preventDefault();
    e.stopPropagation();
    onFocus?.();
    const startX = e.clientX;
    const startY = e.clientY;
    const sb = { ...bounds };

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const nb = { ...sb };

      if (dir.includes('e')) nb.width = Math.max(MIN_W, sb.width + dx);
      if (dir.includes('w')) {
        const nw = Math.max(MIN_W, sb.width - dx);
        nb.x = sb.x + sb.width - nw;
        nb.width = nw;
      }
      if (dir.includes('s')) nb.height = Math.max(MIN_H, sb.height + dy);
      if (dir.includes('n')) {
        const nh = Math.max(MIN_H, sb.height - dy);
        nb.y = Math.max(0, sb.y + sb.height - nh);
        nb.height = nh;
      }
      setBounds(nb);
    };
    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  };

  const toggleMaximize = () => {
    if (mobile) return;
    if (minimized) {
      setMinimized(false);
      return;
    }
    if (maximized) {
      setBounds(boundsBeforeMax.current!);
      setMaximized(false);
    } else {
      boundsBeforeMax.current = bounds;
      setBounds({
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight - 40,
      });
      setMaximized(true);
    }
  };

  const toggleMinimize = () => {
    if (mobile) return;
    if (maximized) {
      setBounds(boundsBeforeMax.current!);
      setMaximized(false);
    }
    setMinimized((v) => !v);
  };

  if (!bounds) return null;

  // --- Mobile layout: full-screen, no chrome ---
  if (mobile) {
    const isOverlay = !!onClose;
    return (
      <div
        className="fixed inset-0 flex flex-col overflow-hidden"
        style={{
          zIndex,
          bottom: 'calc(2.5rem + env(safe-area-inset-bottom))',
          paddingTop: 'env(safe-area-inset-top)',
          background: 'var(--pt-surface)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--pt-border)',
          animation: isOverlay
            ? 'pt-window-open 250ms cubic-bezier(0.2, 0.8, 0.3, 1) both'
            : 'pt-window-open 400ms cubic-bezier(0.2, 0.8, 0.3, 1) 200ms both',
        }}
        onPointerDown={onFocus}
      >
        <div className="flex items-center px-3 h-10 shrink-0 relative">
          {onClose ? (
            <button
              onClick={onClose}
              className="text-[var(--pt-text-dim)] hover:text-[var(--pt-accent)] transition-colors text-sm z-10"
              aria-label="Close"
            >
              ← Back
            </button>
          ) : (
            <div className="w-14" />
          )}
          <span className="absolute left-0 right-0 text-center text-xs text-[var(--pt-text-dim)] truncate px-16 pointer-events-none">
            {title}
          </span>
          {rightSlot && <div className="ml-auto z-10">{rightSlot}</div>}
        </div>
        <div className="h-px bg-[var(--pt-border)]" />
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    );
  }

  // --- Desktop layout: floating window with glass rim ---
  const displayHeight = minimized ? 41 : bounds.height;
  const isSecondary = !!initBounds;
  const fullscreen = maximized;
  const glassInset = fullscreen ? 0 : 6;
  const outerRadius = fullscreen ? 0 : 16;
  const innerRadius = fullscreen ? 0 : 10;

  return (
    <div
      className="fixed"
      style={{
        left: bounds.x - glassInset,
        top: bounds.y - glassInset,
        width: bounds.width + glassInset * 2,
        height: displayHeight + glassInset * 2,
        zIndex,
        transition: minimized ? 'height 200ms ease' : undefined,
        animation: isSecondary
          ? 'pt-window-open 300ms cubic-bezier(0.2, 0.8, 0.3, 1) both'
          : 'pt-window-open 500ms cubic-bezier(0.2, 0.8, 0.3, 1) 200ms both',
      }}
      onPointerDown={onFocus}
    >
      {/* Glass rim */}
      {!fullscreen && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: outerRadius,
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)',
          }}
        />
      )}

      {/* Inner window */}
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          margin: glassInset,
          height: displayHeight,
          borderRadius: innerRadius,
          background: 'var(--pt-surface)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--pt-border-bright)',
          boxShadow: fullscreen ? '0 25px 60px -12px rgba(0,0,0,0.6)' : undefined,
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center px-4 h-10 shrink-0 select-none cursor-grab active:cursor-grabbing relative"
          onPointerDown={startDrag}
          onDoubleClick={toggleMaximize}
        >
          {/* Traffic lights */}
          <div className="flex gap-2 relative z-10 group/tl">
            <button
              className="relative w-3 h-3 rounded-full bg-[#ff5f57] transition-all"
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
              }}
              aria-label="Close"
            >
              <span className="absolute inset-0 flex items-center justify-center text-[9px] leading-none text-black/70 opacity-0 group-hover/tl:opacity-100 transition-opacity">
                ✕
              </span>
            </button>
            <button
              className="relative w-3 h-3 rounded-full bg-[#febc2e] transition-all"
              onClick={(e) => {
                e.stopPropagation();
                toggleMinimize();
              }}
              aria-label="Minimize"
            >
              <span className="absolute inset-0 flex items-center justify-center text-[11px] leading-none text-black/70 opacity-0 group-hover/tl:opacity-100 transition-opacity font-bold">
                −
              </span>
            </button>
            <button
              className="relative w-3 h-3 rounded-full bg-[#28c840] transition-all"
              onClick={(e) => {
                e.stopPropagation();
                toggleMaximize();
              }}
              aria-label="Maximize"
            >
              <span className="absolute inset-0 flex items-center justify-center text-[9px] leading-none text-black/70 opacity-0 group-hover/tl:opacity-100 transition-opacity font-bold">
                +
              </span>
            </button>
          </div>

          {/* Title */}
          <span className="absolute left-0 right-0 text-center text-xs text-[var(--pt-text-dim)] truncate px-24 pointer-events-none">
            {title}
          </span>

          {/* Right slot */}
          {rightSlot && <div className="ml-auto relative z-10">{rightSlot}</div>}
        </div>

        {!minimized && (
          <>
            <div className="h-px bg-[var(--pt-border)]" />
            <div className="flex-1 overflow-hidden">{children}</div>
          </>
        )}
      </div>

      {/* Resize handles */}
      {!fullscreen && !minimized && (
        <>
          <div className="absolute -top-[3px] left-4 right-4 h-[6px] cursor-n-resize" onPointerDown={startResize('n')} />
          <div className="absolute -bottom-[3px] left-4 right-4 h-[6px] cursor-s-resize" onPointerDown={startResize('s')} />
          <div className="absolute -left-[3px] top-4 bottom-4 w-[6px] cursor-w-resize" onPointerDown={startResize('w')} />
          <div className="absolute -right-[3px] top-4 bottom-4 w-[6px] cursor-e-resize" onPointerDown={startResize('e')} />
          <div className="absolute -top-[3px] -left-[3px] w-4 h-4 cursor-nw-resize" onPointerDown={startResize('nw')} />
          <div className="absolute -top-[3px] -right-[3px] w-4 h-4 cursor-ne-resize" onPointerDown={startResize('ne')} />
          <div className="absolute -bottom-[3px] -left-[3px] w-4 h-4 cursor-sw-resize" onPointerDown={startResize('sw')} />
          <div className="absolute -bottom-[3px] -right-[3px] w-4 h-4 cursor-se-resize" onPointerDown={startResize('se')} />
        </>
      )}
    </div>
  );
}
