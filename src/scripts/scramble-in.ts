const CHARS = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+'
const SKIP_TAGS = new Set([
  'script', 'style', 'noscript', 'svg', 'path', 'circle', 'rect',
  'line', 'polyline', 'polygon', 'ellipse', 'g', 'defs', 'use',
])

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

function isVisible(el: HTMLElement): boolean {
  return el.offsetParent !== null
}

function hasVisualStyle(el: HTMLElement): boolean {
  const style = getComputedStyle(el)
  const bg = style.backgroundColor
  const hasBg = bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent'
  const hasBorder =
    parseFloat(style.borderTopWidth) > 0 ||
    parseFloat(style.borderRightWidth) > 0 ||
    parseFloat(style.borderBottomWidth) > 0 ||
    parseFloat(style.borderLeftWidth) > 0
  return hasBg || hasBorder
}

function isFlexOrGridItem(el: HTMLElement): boolean {
  const parent = el.parentElement
  if (!parent) return false
  const d = getComputedStyle(parent).display
  return d.includes('flex') || d.includes('grid')
}

interface AnimEvent {
  el: HTMLElement
  action: 'show' | 'scramble'
  text?: string
}

function collectEvents(section: HTMLElement): AnimEvent[] {
  const events: AnimEvent[] = []

  function walk(el: Element) {
    if (SKIP_TAGS.has(el.tagName.toLowerCase())) return
    const htmlEl = el as HTMLElement
    if (!isVisible(htmlEl)) return

    const isLeaf = el.children.length === 0

    if (isLeaf) {
      if (htmlEl.textContent?.trim()) {
        events.push({ el: htmlEl, action: 'scramble' })
      }
      // Decorative visual leaves (lines, cursors) stay visible — no event
      return
    }

    // Non-leaf containers: hide if they're a flex/grid item with visual style
    // so they pop into the layout when revealed (no grey bg flash)
    if (hasVisualStyle(htmlEl) && isFlexOrGridItem(htmlEl)) {
      events.push({ el: htmlEl, action: 'show' })
    }

    for (const child of el.children) {
      walk(child)
    }
  }

  for (const child of section.children) {
    walk(child)
  }

  return events
}

function prepareText(el: HTMLElement): string | null {
  const text = el.textContent || ''
  if (!text.trim()) return null

  // Lock height only for multi-line text to prevent wrapping jitter
  if (text.length > 60) {
    const h = el.getBoundingClientRect().height
    el.style.minHeight = h + 'px'
    el.style.maxHeight = h + 'px'
    el.style.overflow = 'hidden'
  }

  el.textContent = '\u200B'
  return text
}

function scramble(el: HTMLElement, text: string, delay: number) {
  const speed = 25
  const window = Math.min(14, Math.max(4, Math.ceil(text.length / 6)))
  const step = Math.max(1, Math.ceil(text.length / 30))

  let pos = 0

  function tick() {
    if (pos >= text.length) {
      el.textContent = text
      el.style.minHeight = ''
      el.style.maxHeight = ''
      el.style.overflow = ''
      return
    }

    pos = Math.min(pos + step, text.length)

    // Scramble window never extends past original text length
    const scrambleEnd = Math.min(pos + window, text.length)
    const scrambled = Array(scrambleEnd - pos).fill(0).map(() => randomChar()).join('')

    el.textContent = text.slice(0, pos) + scrambled
    setTimeout(tick, speed)
  }

  setTimeout(tick, delay)
}

// ── Main ──
document.querySelectorAll<HTMLElement>('[data-scramble-in]').forEach(container => {
  const sections = Array.from(container.children) as HTMLElement[]
  const GAP = 35

  // Phase 1: collect events, prepare text, then hide containers
  const sectionGroups = sections.map((section, i) => {
    // Skip header — no animation
    if (i === 0) return { section, events: [] as AnimEvent[], texts: new Map<HTMLElement, string>() }

    const events = collectEvents(section)

    // Step 1: prepare ALL text while everything is still in layout
    const texts = new Map<HTMLElement, string>()
    events.forEach(e => {
      if (e.action === 'scramble') {
        const t = prepareText(e.el)
        if (t) texts.set(e.el, t)
      }
    })

    // Step 2: THEN hide containers (display: none removes from layout)
    events.forEach(e => {
      if (e.action === 'show') {
        e.el.style.display = 'none'
      }
    })

    return { section, events, texts }
  })

  // Phase 2: fire-and-forget timeline
  let t = 0

  for (let si = 0; si < sectionGroups.length; si++) {
    const { section, events, texts } = sectionGroups[si]

    // Skip header entirely — it stays static, no animation
    if (si === 0) continue

    const st = t
    setTimeout(() => {
      section.style.opacity = '1'
      section.style.transform = 'translateY(0)'
    }, st)
    t += 40

    for (const event of events) {
      const delay = t

      if (event.action === 'show') {
        setTimeout(() => { event.el.style.display = '' }, delay)
      } else {
        const text = texts.get(event.el)
        if (text) scramble(event.el, text, delay)
      }

      t += GAP
    }

    t += 30
  }
})
