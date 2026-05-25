import type { ThemeContent, BlogEntry, ExperimentEntry } from '@/theme-runtime/types';
import type { ReactNode } from 'react';
import { themes, formatDisplayDate } from '@/themes/manifest';
import { writeStoredTheme } from '@/theme-runtime/theme-cookie';

export type CommandContext = {
  content: ThemeContent;
  output: (node: ReactNode) => void;
  error: (msg: string) => void;
  clear: () => void;
  navigate: (path: string) => void;
  history: string[];
  openPost: (post: BlogEntry) => void;
  openExperiment: (exp: ExperimentEntry) => void;
  colorScheme: string;
  toggleTheme: () => void;
};

type Command = {
  desc: string;
  handler: (args: string[], ctx: CommandContext) => void;
};

const COMMANDS: Record<string, Command> = {
  help: {
    desc: 'Show available commands',
    handler: (_, ctx) => {
      const visible = Object.entries(COMMANDS);
      ctx.output(
        <div className="py-2">
          <div className="text-[var(--pt-accent)] mb-2">Available commands:</div>
          {visible.map(([name, { desc }]) => (
            <div key={name} className="flex gap-4">
              <span className="text-[var(--pt-prompt)] w-20 shrink-0">{name}</span>
              <span className="text-[var(--pt-text-dim)]">{desc}</span>
            </div>
          ))}
          <div className="mt-3 text-[var(--pt-muted)] text-xs">
            Try <span className="text-[var(--pt-prompt)]">ls</span>,{' '}
            <span className="text-[var(--pt-prompt)]">cat</span>,{' '}
            <span className="text-[var(--pt-prompt)]">neofetch</span>, or{' '}
            <span className="text-[var(--pt-prompt)]">sudo</span> for surprises.
          </div>
        </div>,
      );
    },
  },

  about: {
    desc: 'Who am I',
    handler: (_, ctx) => {
      const p = ctx.content.profile;
      ctx.navigate('/');
      ctx.output(
        <div className="py-2 space-y-2">
          <div className="text-[var(--pt-accent)] text-lg font-semibold">{p.name}</div>
          <div className="text-[var(--pt-muted)]">{'─'.repeat(40)}</div>
          <div>
            <span className="text-[var(--pt-text-dim)]">Role: </span>
            {p.role}
          </div>
          <div>
            <span className="text-[var(--pt-text-dim)]">Location: </span>
            {p.location}
          </div>
          <div>
            <span className="text-[var(--pt-text-dim)]">Focus: </span>
            {p.focus}
          </div>
          <div className="pt-2 text-[var(--pt-text-dim)] leading-relaxed">{p.bio}</div>
        </div>,
      );
    },
  },

  blog: {
    desc: 'List blog posts',
    handler: (_, ctx) => {
      const posts = ctx.content.blog;
      ctx.navigate('/blog');
      ctx.output(
        <div className="py-2">
          <div className="text-[var(--pt-accent)] mb-2">Blog Posts</div>
          <div className="text-[var(--pt-muted)] mb-3">{'─'.repeat(40)}</div>
          {posts.length === 0 ? (
            <div className="text-[var(--pt-text-dim)]">No posts yet.</div>
          ) : (
            <div className="space-y-1">
              {posts.map((post) => (
                <div key={post.id} className="flex gap-4">
                  <span className="text-[var(--pt-muted)] shrink-0">
                    {post.date.toISOString().slice(0, 10)}
                  </span>
                  <span
                    data-terminal-cmd={`read ${post.id}`}
                    className="text-[var(--pt-link)] hover:text-[var(--pt-accent)] cursor-pointer hover:underline"
                  >
                    {post.title}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 text-[var(--pt-text-dim)] text-xs">
            Click a title or type{' '}
            <span className="text-[var(--pt-prompt)]">read &lt;slug&gt;</span> to open.
          </div>
        </div>,
      );
    },
  },

  read: {
    desc: 'Open a blog post',
    handler: (args, ctx) => {
      const slug = args.join(' ');
      if (!slug) {
        ctx.error('Usage: read <post-slug>');
        return;
      }
      const post = ctx.content.blog.find(
        (p) => p.id === slug || p.title.toLowerCase().includes(slug.toLowerCase()),
      );
      if (!post) {
        ctx.error(`Post not found: ${slug}`);
        return;
      }
      ctx.navigate(`/blog/${post.id}`);
      ctx.openPost(post);
      ctx.output(
        <span className="text-[var(--pt-text-dim)]">Opened: {post.title}</span>,
      );
    },
  },

  work: {
    desc: 'Work experience',
    handler: (_, ctx) => {
      const exp = ctx.content.experience;
      ctx.output(
        <div className="py-2">
          <div className="text-[var(--pt-accent)] mb-2">Experience</div>
          <div className="text-[var(--pt-muted)] mb-3">{'─'.repeat(40)}</div>
          <div className="space-y-4">
            {exp.map((e, i) => (
              <div key={i}>
                <div className="flex gap-4">
                  <span className="text-[var(--pt-muted)] shrink-0 w-28">{e.dateRange}</span>
                  <div>
                    {e.url ? (
                      <a href={e.url} target="_blank" rel="noopener" className="text-[var(--pt-link)] hover:underline font-medium" data-theme-external="">{e.company}</a>
                    ) : (
                      <span className="text-[var(--pt-text)] font-medium">{e.company}</span>
                    )}
                    <span className="text-[var(--pt-text-dim)]"> — {e.role}</span>
                  </div>
                </div>
                {e.description && (
                  <div className="ml-32 text-[var(--pt-text-dim)] text-sm mt-1">
                    {e.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>,
      );
    },
  },

  projects: {
    desc: 'Side projects & experiments',
    handler: (_, ctx) => {
      const projs = ctx.content.experiments;
      ctx.navigate('/experiments');
      ctx.output(
        <div className="py-2">
          <div className="text-[var(--pt-accent)] mb-2">Projects</div>
          <div className="text-[var(--pt-muted)] mb-3">{'─'.repeat(40)}</div>
          {projs.length === 0 ? (
            <div className="text-[var(--pt-text-dim)]">No experiments yet.</div>
          ) : (
            <div className="space-y-1">
              {projs.map((p) => (
                <div key={p.id} className="flex gap-4">
                  <span className="text-[var(--pt-muted)] shrink-0">
                    {p.date.toISOString().slice(0, 10)}
                  </span>
                  <span
                    data-terminal-cmd={`exp ${p.id}`}
                    className="text-[var(--pt-link)] hover:text-[var(--pt-accent)] cursor-pointer hover:underline"
                  >
                    {p.title}
                  </span>
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--pt-border)] text-[var(--pt-text-dim)] self-center"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 text-[var(--pt-text-dim)] text-xs">
            Click a title or type{' '}
            <span className="text-[var(--pt-prompt)]">exp &lt;slug&gt;</span> to open.
          </div>
        </div>,
      );
    },
  },

  exp: {
    desc: 'Open an experiment',
    handler: (args, ctx) => {
      const slug = args.join(' ');
      if (!slug) {
        ctx.error('Usage: exp <experiment-slug>');
        return;
      }
      const exp = ctx.content.experiments.find(
        (p) => p.id === slug || p.title.toLowerCase().includes(slug.toLowerCase()),
      );
      if (!exp) {
        ctx.error(`Experiment not found: ${slug}`);
        return;
      }
      ctx.navigate(`/experiments/${exp.id}`);
      ctx.openExperiment(exp);
      ctx.output(
        <span className="text-[var(--pt-text-dim)]">Opened: {exp.title}</span>,
      );
    },
  },

  socials: {
    desc: 'Find me online',
    handler: (_, ctx) => {
      const socials = ctx.content.socials;
      ctx.output(
        <div className="py-2">
          <div className="text-[var(--pt-accent)] mb-2">Socials</div>
          <div className="text-[var(--pt-muted)] mb-3">{'─'.repeat(40)}</div>
          <div className="space-y-1">
            {socials.map((s, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-[var(--pt-text-dim)] w-20 shrink-0">{s.name}</span>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener"
                  className="text-[var(--pt-link)] hover:underline truncate"
                  data-theme-external=""
                >
                  {s.url}
                </a>
              </div>
            ))}
          </div>
        </div>,
      );
    },
  },

  theme: {
    desc: 'Toggle light/dark mode',
    handler: (_, ctx) => {
      const newScheme = ctx.colorScheme === 'dark' ? 'light' : 'dark';
      ctx.toggleTheme();
      ctx.output(
        <span className="text-[var(--pt-text-dim)]">Switched to {newScheme} mode</span>,
      );
    },
  },

  next: {
    desc: 'Next theme',
    handler: (_, ctx) => {
      const slug = document.documentElement.getAttribute('data-theme-slug') || '';
      const idx = themes.findIndex((t) => t.slug === slug);
      const newer = idx > 0 ? themes[idx - 1] : undefined;
      if (newer) {
        ctx.output(
          <span className="text-[var(--pt-text-dim)]">
            Switching to: {newer.meta.name} ({formatDisplayDate(newer.meta.date)})
          </span>,
        );
        writeStoredTheme(newer.slug);
        window.__themeRoot?.swap(newer.slug);
      } else {
        ctx.error('Already on the newest theme.');
      }
    },
  },

  prev: {
    desc: 'Previous theme',
    handler: (_, ctx) => {
      const slug = document.documentElement.getAttribute('data-theme-slug') || '';
      const idx = themes.findIndex((t) => t.slug === slug);
      const older = idx >= 0 && idx < themes.length - 1 ? themes[idx + 1] : undefined;
      if (older) {
        ctx.output(
          <span className="text-[var(--pt-text-dim)]">
            Switching to: {older.meta.name} ({formatDisplayDate(older.meta.date)})
          </span>,
        );
        writeStoredTheme(older.slug);
        window.__themeRoot?.swap(older.slug);
      } else {
        ctx.error('Already on the oldest theme.');
      }
    },
  },

  clear: {
    desc: 'Clear terminal',
    handler: (_, ctx) => ctx.clear(),
  },

  ls: {
    desc: 'List files',
    handler: (_, ctx) => {
      ctx.output(
        <div className="py-1 flex flex-wrap gap-x-6 gap-y-1">
          <span className="text-[var(--pt-link)]">about.txt</span>
          <span className="text-[var(--pt-accent)]">work/</span>
          <span className="text-[var(--pt-accent)]">blog/</span>
          <span className="text-[var(--pt-accent)]">projects/</span>
          <span className="text-[var(--pt-link)]">socials.txt</span>
          <span className="text-[var(--pt-muted)]">.secrets</span>
          <span className="text-[var(--pt-text-dim)]">README.md</span>
        </div>,
      );
    },
  },

  cat: {
    desc: 'Read a file',
    handler: (args, ctx) => {
      const file = args[0];
      if (!file) {
        ctx.error('Usage: cat <filename>');
        return;
      }
      const handlers: Record<string, () => void> = {
        'about.txt': () => COMMANDS.about.handler([], ctx),
        'socials.txt': () => COMMANDS.socials.handler([], ctx),
        'README.md': () =>
          ctx.output(
            <div className="py-2 space-y-1">
              <div className="text-[var(--pt-accent)]"># reece.so</div>
              <div className="text-[var(--pt-text-dim)]">
                Personal website, themed daily by AI.
              </div>
              <div className="text-[var(--pt-text-dim)]">
                Type &apos;help&apos; for navigation commands.
              </div>
            </div>,
          ),
        '.secrets': () =>
          ctx.output(
            <div className="py-2">
              <div className="text-[var(--pt-warning)]">You found the secret file!</div>
              <div className="text-[var(--pt-text-dim)] mt-1">
                This website is themed by AI. Every theme you see was designed and built by a
                different AI model. Use the navigator at the bottom to travel through time.
              </div>
            </div>,
          ),
      };
      const handler = handlers[file];
      if (handler) {
        handler();
      } else {
        ctx.error(`cat: ${file}: No such file or directory`);
      }
    },
  },

  cd: {
    desc: 'Change directory',
    handler: (args, ctx) => {
      const dir = args[0] || '~';
      const aliases: Record<string, string> = {
        work: 'work',
        blog: 'blog',
        projects: 'projects',
        '~': 'home',
        '..': 'home',
        '/': 'home',
      };
      const cmd = aliases[dir];
      if (cmd === 'home') {
        HIDDEN.home([], ctx);
      } else if (cmd && COMMANDS[cmd]) {
        COMMANDS[cmd].handler([], ctx);
      } else {
        ctx.error(`cd: no such directory: ${dir}`);
      }
    },
  },

  pwd: {
    desc: 'Print working directory',
    handler: (_, ctx) =>
      ctx.output(<span className="text-[var(--pt-text-dim)]">/home/visitor</span>),
  },

  whoami: {
    desc: 'Display current user',
    handler: (_, ctx) => ctx.output(<span className="text-[var(--pt-prompt)]">visitor</span>),
  },

  date: {
    desc: 'Show current date',
    handler: (_, ctx) =>
      ctx.output(<span className="text-[var(--pt-text-dim)]">{new Date().toString()}</span>),
  },

  echo: {
    desc: 'Echo text',
    handler: (args, ctx) => ctx.output(<span>{args.join(' ')}</span>),
  },

  history: {
    desc: 'Show command history',
    handler: (_, ctx) => {
      ctx.output(
        <div className="py-1">
          {ctx.history.length === 0 ? (
            <span className="text-[var(--pt-text-dim)]">No history yet.</span>
          ) : (
            ctx.history.map((cmd, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-[var(--pt-muted)] w-8 text-right">{i + 1}</span>
                <span>{cmd}</span>
              </div>
            ))
          )}
        </div>,
      );
    },
  },

  neofetch: {
    desc: 'System information',
    handler: (_, ctx) => {
      const p = ctx.content.profile;
      ctx.output(
        <div className="py-2 flex gap-6">
          <pre className="text-[var(--pt-accent)] text-xs leading-tight shrink-0">
            {[
              '  ██████████  ',
              ' ██        ██ ',
              '██  ██  ██  ██',
              '██          ██',
              ' ██   ██   ██ ',
              '  ██      ██  ',
              '   ████████   ',
            ].join('\n')}
          </pre>
          <div className="space-y-0.5 text-sm">
            <div>
              <span className="text-[var(--pt-prompt)]">visitor</span>
              <span className="text-[var(--pt-muted)]">@</span>
              <span className="text-[var(--pt-accent)]">reece.so</span>
            </div>
            <div className="text-[var(--pt-muted)]">{'─'.repeat(20)}</div>
            <div>
              <span className="text-[var(--pt-prompt)]">OS: </span>
              <span className="text-[var(--pt-text-dim)]">reece.so v2026</span>
            </div>
            <div>
              <span className="text-[var(--pt-prompt)]">Shell: </span>
              <span className="text-[var(--pt-text-dim)]">projects-terminal</span>
            </div>
            <div>
              <span className="text-[var(--pt-prompt)]">Host: </span>
              <span className="text-[var(--pt-text-dim)]">{p.name}</span>
            </div>
            <div>
              <span className="text-[var(--pt-prompt)]">Role: </span>
              <span className="text-[var(--pt-text-dim)]">{p.role}</span>
            </div>
            <div>
              <span className="text-[var(--pt-prompt)]">Location: </span>
              <span className="text-[var(--pt-text-dim)]">{p.location}</span>
            </div>
            <div>
              <span className="text-[var(--pt-prompt)]">Uptime: </span>
              <span className="text-[var(--pt-text-dim)]">since 2026-01-01</span>
            </div>
          </div>
        </div>,
      );
    },
  },

  sudo: {
    desc: 'Run as superuser',
    handler: (_, ctx) =>
      ctx.output(
        <span className="text-[var(--pt-error)]">
          Nice try. You don&apos;t have sudo privileges on this website.
        </span>,
      ),
  },

  vim: {
    desc: 'Open vim',
    handler: (_, ctx) =>
      ctx.output(
        <div className="py-1">
          <div className="text-[var(--pt-warning)]">You&apos;re now stuck in vim.</div>
          <div className="text-[var(--pt-text-dim)]">
            Just kidding — type :q to... oh wait, this isn&apos;t actually vim.
          </div>
        </div>,
      ),
  },

  exit: {
    desc: 'Exit terminal',
    handler: (_, ctx) =>
      ctx.output(
        <span className="text-[var(--pt-muted)]">There is no escape. You live here now.</span>,
      ),
  },
};

const HIDDEN: Record<string, (args: string[], ctx: CommandContext) => void> = {
  home: (_, ctx) => {
    ctx.navigate('/');
    showWelcomeContent(ctx);
  },
  rm: (args, ctx) => {
    if (args.join(' ').includes('-rf')) {
      ctx.output(
        <div className="py-1">
          <div className="text-[var(--pt-error)]">Deleting all files...</div>
          <div className="text-[var(--pt-text-dim)]">Just kidding. This is a website.</div>
        </div>,
      );
    } else {
      ctx.error('rm: operation not permitted');
    }
  },
  nano: (_, ctx) =>
    ctx.output(
      <span className="text-[var(--pt-text-dim)]">
        nano: command not found. We only have vim here. Good luck.
      </span>,
    ),
};

export function showWelcomeContent(ctx: CommandContext) {
  const p = ctx.content.profile;
  ctx.output(
    <div className="py-3">
      <div className="text-[var(--pt-accent)] text-lg font-semibold mb-1">{p.name}</div>
      <div className="text-[var(--pt-text-dim)] mb-4">
        {p.role} · {p.location}
      </div>
      <div className="text-[var(--pt-text-dim)] mb-4">
        Welcome! Navigate using commands or click the links below.
        <br />
        Type <span className="text-[var(--pt-prompt)]">help</span> for a list of all commands.
      </div>
      <div className="space-y-0.5">
        {(['about', 'blog', 'work', 'projects', 'socials'] as const).map((cmd) => (
          <div
            key={cmd}
            className="flex gap-4 py-1.5 -mx-2 px-2 rounded cursor-pointer hover:bg-[var(--pt-border)] active:bg-[var(--pt-border-bright)] transition-colors"
            data-terminal-cmd={cmd}
          >
            <span className="text-[var(--pt-prompt)] w-20 shrink-0">
              {cmd}
            </span>
            <span className="text-[var(--pt-text-dim)]">{COMMANDS[cmd]?.desc}</span>
          </div>
        ))}
      </div>
    </div>,
  );
}

export function processCommand(input: string, ctx: CommandContext): void {
  const parts = input.trim().split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  const command = COMMANDS[cmd];
  if (command) {
    command.handler(args, ctx);
    return;
  }

  const hidden = HIDDEN[cmd];
  if (hidden) {
    hidden(args, ctx);
    return;
  }

  ctx.error(`Command not found: ${cmd}. Type 'help' for available commands.`);
}

export function getCompletions(partial: string): string[] {
  const lower = partial.toLowerCase();
  return Object.keys(COMMANDS).filter((c) => c.startsWith(lower));
}
