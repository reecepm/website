const CHARS = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+';
const SKIP_TAGS = new Set([
  'script', 'style', 'noscript', 'svg', 'path', 'circle', 'rect',
  'line', 'polyline', 'polygon', 'ellipse', 'g', 'defs', 'use',
]);

const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

const isVisible = (el: HTMLElement): boolean => el.offsetParent !== null;

const hasVisualStyle = (el: HTMLElement): boolean => {
  const style = getComputedStyle(el);
  const bg = style.backgroundColor;
  const hasBg = bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
  const hasBorder =
    parseFloat(style.borderTopWidth) > 0 ||
    parseFloat(style.borderRightWidth) > 0 ||
    parseFloat(style.borderBottomWidth) > 0 ||
    parseFloat(style.borderLeftWidth) > 0;
  return hasBg || hasBorder;
};

const isFlexOrGridItem = (el: HTMLElement): boolean => {
  const parent = el.parentElement;
  if (!parent) return false;
  const d = getComputedStyle(parent).display;
  return d.includes('flex') || d.includes('grid');
};

type AnimEvent = { el: HTMLElement; action: 'show' | 'scramble' };

const collectEvents = (section: HTMLElement): AnimEvent[] => {
  const events: AnimEvent[] = [];

  const walk = (el: Element) => {
    if (SKIP_TAGS.has(el.tagName.toLowerCase())) return;
    const htmlEl = el as HTMLElement;
    if (!isVisible(htmlEl)) return;

    const isLeaf = el.children.length === 0;

    if (isLeaf) {
      if (htmlEl.textContent?.trim()) {
        events.push({ el: htmlEl, action: 'scramble' });
      }
      return;
    }

    if (hasVisualStyle(htmlEl) && isFlexOrGridItem(htmlEl)) {
      events.push({ el: htmlEl, action: 'show' });
    }

    for (const child of el.children) walk(child);
  };

  for (const child of section.children) walk(child);
  return events;
};

const prepareText = (el: HTMLElement): string | null => {
  const text = el.textContent || '';
  if (!text.trim()) return null;

  if (text.length > 60) {
    const h = el.getBoundingClientRect().height;
    el.style.minHeight = h + 'px';
    el.style.maxHeight = h + 'px';
    el.style.overflow = 'hidden';
  }

  el.textContent = '\u200B';
  return text;
};

const scramble = (el: HTMLElement, text: string, delay: number, timeouts: number[]) => {
  const speed = 25;
  const windowSize = Math.min(14, Math.max(4, Math.ceil(text.length / 6)));
  const step = Math.max(1, Math.ceil(text.length / 30));

  let pos = 0;

  const tick = () => {
    if (pos >= text.length) {
      el.textContent = text;
      el.style.minHeight = '';
      el.style.maxHeight = '';
      el.style.overflow = '';
      return;
    }

    pos = Math.min(pos + step, text.length);
    const scrambleEnd = Math.min(pos + windowSize, text.length);
    const scrambled = Array(scrambleEnd - pos).fill(0).map(randomChar).join('');
    el.textContent = text.slice(0, pos) + scrambled;
    timeouts.push(window.setTimeout(tick, speed) as unknown as number);
  };

  timeouts.push(window.setTimeout(tick, delay) as unknown as number);
};

/** Runs the scramble-in animation on a container. Returns a cleanup that cancels pending timers. */
export const runScrambleIn = (container: HTMLElement): (() => void) => {
  const timeouts: number[] = [];
  const sections = Array.from(container.children) as HTMLElement[];
  const GAP = 35;

  const sectionGroups = sections.map((section, i) => {
    if (i === 0) return { section, events: [] as AnimEvent[], texts: new Map<HTMLElement, string>() };

    const events = collectEvents(section);
    const texts = new Map<HTMLElement, string>();

    events.forEach((e) => {
      if (e.action === 'scramble') {
        const t = prepareText(e.el);
        if (t) texts.set(e.el, t);
      }
    });

    events.forEach((e) => {
      if (e.action === 'show') {
        e.el.style.display = 'none';
      }
    });

    return { section, events, texts };
  });

  let t = 0;

  for (let si = 0; si < sectionGroups.length; si++) {
    const { section, events, texts } = sectionGroups[si];
    if (si === 0) continue;

    const st = t;
    timeouts.push(
      window.setTimeout(() => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
      }, st) as unknown as number,
    );
    t += 40;

    for (const event of events) {
      const delay = t;

      if (event.action === 'show') {
        timeouts.push(window.setTimeout(() => { event.el.style.display = ''; }, delay) as unknown as number);
      } else {
        const text = texts.get(event.el);
        if (text) scramble(event.el, text, delay, timeouts);
      }

      t += GAP;
    }

    t += 30;
  }

  return () => {
    timeouts.forEach((id) => window.clearTimeout(id));
  };
};
