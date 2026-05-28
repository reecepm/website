import { createContext, memo, useContext, type ReactNode } from 'react';
import type { ThemeContent, ExperienceEntry, ExperimentEntry, SocialEntry, BlogEntry } from './types';

// Pre-rendered markdown body. Memoized so an unrelated theme re-render (opening
// the global lightbox, a colour toggle, dragging a window) can't re-run
// dangerouslySetInnerHTML — rebuilding the subtree would reset any open carousel
// and reload its videos. `html` is build-time stable, so this never re-renders.
export const ProseHtml = memo(function ProseHtml({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
});

const ContentContext = createContext<ThemeContent | null>(null);

export const ContentProvider = ({ content, children }: { content: ThemeContent; children: ReactNode }) => (
  <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
);

const useContent = (): ThemeContent => {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('Theme content hooks must be used inside <ContentProvider>');
  return ctx;
};

type RenderFn<T> = (item: T, index: number) => ReactNode;

export const Reece = {
  useProfile: () => useContent().profile,
  Name: () => <>{useContent().profile.name}</>,
  Role: () => <>{useContent().profile.role}</>,
  Location: () => <>{useContent().profile.location}</>,
  Focus: () => <>{useContent().profile.focus}</>,
  Bio: () => <>{useContent().profile.bio}</>,
};

export const Experience = {
  useAll: () => useContent().experience,
  List: ({ children }: { children: RenderFn<ExperienceEntry> }) => {
    const items = useContent().experience;
    return <>{items.map((item, i) => children(item, i))}</>;
  },
};

export const Projects = {
  useAll: () => useContent().experiments,
  List: ({ limit, children }: { limit?: number; children: RenderFn<ExperimentEntry> }) => {
    const items = useContent().experiments;
    const sliced = typeof limit === 'number' ? items.slice(0, limit) : items;
    return <>{sliced.map((item, i) => children(item, i))}</>;
  },
};

export const Socials = {
  useAll: () => useContent().socials,
  List: ({ children }: { children: RenderFn<SocialEntry> }) => {
    const items = useContent().socials;
    return <>{items.map((item, i) => children(item, i))}</>;
  },
};

export const Blog = {
  useAll: () => useContent().blog,
  useRecent: (n: number) => useContent().blog.slice(0, n),
  List: ({ limit, children }: { limit?: number; children: RenderFn<BlogEntry> }) => {
    const items = useContent().blog;
    const sliced = typeof limit === 'number' ? items.slice(0, limit) : items;
    return <>{sliced.map((item, i) => children(item, i))}</>;
  },
};
