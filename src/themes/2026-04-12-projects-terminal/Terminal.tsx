import { useState, useRef, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import {
  processCommand,
  getCompletions,
  showWelcomeContent,
  type CommandContext,
} from './commands';
import type { ThemeContent, BlogEntry } from '@/theme-runtime/types';

type LineType = 'command' | 'output' | 'error' | 'system';
type OutputLine = { id: number; content: ReactNode; type: LineType };

type Props = {
  content: ThemeContent;
  pathname: string;
  onOpenPost: (post: BlogEntry) => void;
  colorScheme: string;
  onToggleTheme: () => void;
};

const STORAGE_KEY = 'pt-terminal-cmds';

const matchBlogPostPath = (p: string): string | null => {
  const m = p.match(/^\/blog\/(.+?)\/?$/);
  return m ? m[1] : null;
};

export default function Terminal({
  content,
  pathname,
  onOpenPost,
  colorScheme,
  onToggleTheme,
}: Props) {
  const [lines, setLines] = useState<OutputLine[]>([]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [savedInput, setSavedInput] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lineIdRef = useRef(0);
  const lastCmdNavRef = useRef<string | null>(null);
  const prevPathRef = useRef(pathname);
  const mountedRef = useRef(false);
  const isAtBottomRef = useRef(true);
  const executedCmdsRef = useRef<string[]>([]);

  const addLine = useCallback((node: ReactNode, type: LineType = 'output') => {
    setLines((prev) => [...prev, { id: lineIdRef.current++, content: node, type }]);
  }, []);

  const addCommand = useCallback(
    (cmd: string) => {
      addLine(
        <span>
          <span className="text-[var(--pt-prompt)]">~ $</span>{' '}
          <span className="text-[var(--pt-text)]">{cmd}</span>
        </span>,
        'command',
      );
    },
    [addLine],
  );

  const navigate = useCallback((path: string) => {
    const current = window.location.pathname.replace(/\/+$/, '') || '/';
    if (current === path) return;
    lastCmdNavRef.current = path;
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);

  const ctx: CommandContext = useMemo(
    () => ({
      content,
      output: (node: ReactNode) => addLine(node, 'output'),
      error: (msg: string) =>
        addLine(<span className="text-[var(--pt-error)]">{msg}</span>, 'error'),
      clear: () => setLines([]),
      navigate,
      history: cmdHistory,
      openPost: onOpenPost,
      colorScheme,
      toggleTheme: onToggleTheme,
    }),
    [content, addLine, navigate, cmdHistory, onOpenPost, colorScheme, onToggleTheme],
  );

  const persistCmds = useCallback((cmds: string[]) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cmds));
    } catch {}
  }, []);

  const executeCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim();
      if (!trimmed) return;
      addCommand(trimmed);
      processCommand(trimmed, ctx);
      setCmdHistory((prev) => [...prev, trimmed]);
      setHistoryIdx(-1);
      setSavedInput('');
      setInput('');
      executedCmdsRef.current.push(trimmed);
      persistCmds(executedCmdsRef.current);
    },
    [addCommand, ctx, persistCmds],
  );

  // Mount: restore from session or show fresh welcome
  useEffect(() => {
    let restored = false;
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const cmds: string[] = JSON.parse(saved);
        if (cmds.length > 0) {
          restored = true;
          // Replay with side effects suppressed
          const replayCtx: CommandContext = {
            ...ctx,
            navigate: () => {},
            openPost: () => {},
            toggleTheme: () => {},
          };
          showWelcomeContent(replayCtx);
          for (const cmd of cmds) {
            addCommand(cmd);
            processCommand(cmd, replayCtx);
          }
          setCmdHistory(cmds);
          executedCmdsRef.current = [...cmds];
        }
      }
    } catch {}

    if (!restored) {
      showWelcomeContent(ctx);
      if (pathname === '/blog') {
        addCommand('blog');
        processCommand('blog', ctx);
      } else if (pathname !== '/') {
        const postId = matchBlogPostPath(pathname);
        if (postId) {
          addCommand(`read ${postId}`);
          processCommand(`read ${postId}`, ctx);
        }
      }
    }

    mountedRef.current = true;
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mountedRef.current) return;
    if (pathname === prevPathRef.current) return;
    prevPathRef.current = pathname;

    if (pathname === lastCmdNavRef.current) {
      lastCmdNavRef.current = null;
      return;
    }

    const postId = matchBlogPostPath(pathname);
    if (postId) {
      addCommand(`read ${postId}`);
      processCommand(`read ${postId}`, ctx);
    } else if (pathname === '/blog') {
      addCommand('blog');
      processCommand('blog', ctx);
    } else if (pathname === '/') {
      addCommand('home');
      processCommand('home', ctx);
    }
  }, [pathname, addCommand, ctx]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && isAtBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [lines]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el) {
      isAtBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 30;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const cmdEl = (e.target as HTMLElement).closest('[data-terminal-cmd]');
    if (cmdEl) {
      e.preventDefault();
      const cmd = cmdEl.getAttribute('data-terminal-cmd')!;
      executeCommand(cmd);
      return;
    }
    const sel = window.getSelection();
    if (sel && sel.toString().length > 0) return;
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      if (historyIdx === -1) {
        setSavedInput(input);
        setHistoryIdx(cmdHistory.length - 1);
        setInput(cmdHistory[cmdHistory.length - 1]);
      } else if (historyIdx > 0) {
        setHistoryIdx(historyIdx - 1);
        setInput(cmdHistory[historyIdx - 1]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      if (historyIdx < cmdHistory.length - 1) {
        setHistoryIdx(historyIdx + 1);
        setInput(cmdHistory[historyIdx + 1]);
      } else {
        setHistoryIdx(-1);
        setInput(savedInput);
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      if (input) {
        addLine(
          <span>
            <span className="text-[var(--pt-prompt)]">~ $</span>{' '}
            <span className="text-[var(--pt-text)]">{input}</span>
            <span className="text-[var(--pt-muted)]">^C</span>
          </span>,
          'command',
        );
      }
      setInput('');
      setHistoryIdx(-1);
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
      executedCmdsRef.current = [];
      persistCmds([]);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (input) {
        const completions = getCompletions(input);
        if (completions.length === 1) {
          setInput(completions[0]);
        } else if (completions.length > 1) {
          addLine(
            <div className="flex flex-wrap gap-x-4 gap-y-1 py-1">
              {completions.map((c) => (
                <span key={c} className="text-[var(--pt-accent)]">
                  {c}
                </span>
              ))}
            </div>,
            'system',
          );
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-full text-sm" onClick={handleClick}>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 pt-scroll"
        onScroll={handleScroll}
      >
        {lines.map((line) => (
          <div key={line.id} className="whitespace-pre-wrap break-words">
            {line.content}
          </div>
        ))}
      </div>

      <div className="flex items-center px-4 py-2.5 border-t border-[var(--pt-border)] shrink-0">
        <span className="text-[var(--pt-prompt)] mr-2 select-none">~ $</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            // On mobile, scroll input into view when virtual keyboard opens
            setTimeout(() => inputRef.current?.scrollIntoView({ block: 'nearest' }), 300);
          }}
          className="flex-1 bg-transparent text-[var(--pt-text)] outline-none caret-[var(--pt-prompt)] text-base sm:text-sm"
          autoComplete="off"
          spellCheck={false}
          autoCapitalize="off"
          enterKeyHint="send"
        />
      </div>
    </div>
  );
}
