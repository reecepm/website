import { Reece, Experience, Projects, Blog, Socials } from '@/theme-runtime/content';

const monthYear = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <h2 className="qd-mono text-[11px] uppercase tracking-[0.18em] text-[var(--qd-muted)] font-medium m-0">
    {children}
  </h2>
);

export default function Landing() {
  const profile = Reece.useProfile();
  const experience = Experience.useAll();
  const projects = Projects.useAll();
  const posts = Blog.useAll();
  const socials = Socials.useAll();

  return (
    <>
      <style>{`
        /* hover/focus reveal: company + role + dates at a glance, detail on intent */
        .v4-row { padding: 0.85rem 0; outline: none; }
        .v4-row + .v4-row { border-top: 1px solid var(--qd-line); }
        .v4-detail {
          display: grid;
          grid-template-rows: 0fr;
          opacity: 0;
          transition: grid-template-rows 320ms cubic-bezier(0.2, 0.8, 0.3, 1), opacity 260ms ease;
        }
        .v4-detail > div { overflow: hidden; min-height: 0; }
        .v4-row:hover .v4-detail,
        .v4-row:focus-within .v4-detail { grid-template-rows: 1fr; opacity: 1; }
        .v4-detail-inner { padding-top: 0.6rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .v4-tags { display: flex; flex-wrap: wrap; gap: 0.3rem 0.6rem; margin: 0; padding: 0; list-style: none; }
        .v4-proj + .v4-proj { margin-top: 1.1rem; padding-top: 1.1rem; border-top: 1px solid var(--qd-line); }
      `}</style>

      <div className="mx-auto max-w-[600px] px-6 py-20 flex flex-col gap-12">

        {/* Top nav */}
        <header className="flex items-baseline justify-between">
          <a href="/" className="qd-mono text-[13px] text-[var(--qd-text)] no-underline hover:text-[var(--qd-accent)] transition-colors">
            reece.so
          </a>
          <a href="/blog" className="qd-mono text-[13px] text-[var(--qd-muted)] no-underline hover:text-[var(--qd-accent)] transition-colors">
            writing
          </a>
        </header>

        {/* Hero — centered */}
        <section className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-[1.5rem] font-[500] tracking-[-0.02em] leading-[1.2] text-[var(--qd-text)] m-0">
            {profile.name}
          </h1>
          <p className="qd-mono text-[13px] text-[var(--qd-muted)] m-0 tracking-[0.04em]">
            {profile.role} &middot; {profile.focus} &middot; {profile.location}
          </p>
          <p className="text-[15px] leading-[22.5px] text-[var(--qd-text-soft)] m-0 max-w-[54ch]">
            {profile.bio}
          </p>
        </section>

        {/* Work — essentials at a glance, detail on hover/focus */}
        <section className="flex flex-col gap-4">
          <Eyebrow>Work</Eyebrow>
          <div>
            {experience.map((exp) => (
              <div key={exp.company} className="v4-row" tabIndex={0}>
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span className="text-[14px] text-[var(--qd-text)]">
                      {exp.url ? (
                        <a
                          href={exp.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="no-underline text-[var(--qd-text)] hover:text-[var(--qd-accent)] transition-colors"
                        >
                          {exp.company}
                        </a>
                      ) : (
                        exp.company
                      )}
                    </span>
                    <span className="text-[13px] text-[var(--qd-muted)]">{exp.role}</span>
                  </div>
                  <span className="qd-mono text-[13px] text-[var(--qd-muted)] shrink-0">{exp.dateRange}</span>
                </div>

                <div className="v4-detail">
                  <div>
                    <div className="v4-detail-inner">
                      {exp.description && (
                        <p className="text-[14px] leading-[1.6] text-[var(--qd-text-soft)] m-0">{exp.description}</p>
                      )}
                      {exp.tags.length > 0 && (
                        <ul className="v4-tags">
                          {exp.tags.map((tag) => (
                            <li key={tag} className="qd-mono text-[12px] text-[var(--qd-muted)]">{tag}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experiments — shown in full (this is what people want to read) */}
        <section className="flex flex-col gap-4">
          <Eyebrow>Experiments</Eyebrow>
          {projects.length > 0 ? (
            <div>
              {projects.map((p) => (
                <div key={p.name} className="v4-proj flex flex-col gap-1.5">
                  <span className="text-[14px] text-[var(--qd-text)]">
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline text-[var(--qd-text)] hover:text-[var(--qd-accent)] transition-colors"
                      >
                        {p.name}
                      </a>
                    ) : (
                      p.name
                    )}
                  </span>
                  {p.description && (
                    <p className="text-[14px] leading-[1.6] text-[var(--qd-text-soft)] m-0">{p.description}</p>
                  )}
                  {p.tags.length > 0 && (
                    <ul className="v4-tags">
                      {p.tags.map((tag) => (
                        <li key={tag} className="qd-mono text-[12px] text-[var(--qd-muted)]">{tag}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="qd-mono text-[13px] text-[var(--qd-muted)] m-0">Coming soon.</p>
          )}
        </section>

        {/* Writing */}
        <section className="flex flex-col gap-4">
          <Eyebrow>Writing</Eyebrow>
          {posts.length > 0 ? (
            <div className="flex flex-col gap-3">
              {posts.map((post) => (
                <a key={post.id} href={`/blog/${post.id}`} className="flex flex-col gap-0.5 no-underline group">
                  <span className="text-[14px] text-[var(--qd-text)] group-hover:text-[var(--qd-accent)] transition-colors">
                    {post.title}
                  </span>
                  <span className="qd-mono text-[12px] text-[var(--qd-muted)]">
                    {monthYear(post.date)}
                    {post.description ? ` · ${post.description}` : ''}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="qd-mono text-[13px] text-[var(--qd-muted)] m-0">Nothing here yet.</p>
          )}
        </section>

        {/* Elsewhere */}
        <section className="flex flex-col gap-4">
          <Eyebrow>Elsewhere</Eyebrow>
          <nav className="flex flex-wrap gap-x-6 gap-y-2.5">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                rel={social.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="text-[14px] capitalize text-[var(--qd-text-soft)] no-underline hover:text-[var(--qd-accent)] transition-colors"
              >
                {social.name}
              </a>
            ))}
          </nav>
        </section>

      </div>
    </>
  );
}
