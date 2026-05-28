// Touch/pen swipe for the radio-driven `.oc-carousel` blocks authored in
// markdown. The carousels switch slides by checking one of N sibling radios;
// CSS animates `.track` via `transform`. Here we add finger-following drag and
// snap on release, then hand control back to the CSS `:checked` rules. Wired up
// once from ThemeRoot via event delegation, so it covers carousels that appear
// after client-side navigation too.

const SLIDE_EASE = 'cubic-bezier(.2,.8,.3,1)';
const SLIDE_MS = 450;

type Drag = {
  carousel: HTMLElement;
  track: HTMLElement;
  radios: HTMLInputElement[];
  index: number;
  width: number;
  startX: number;
  startY: number;
  dx: number;
  dragging: boolean;
  pointerId: number;
};

export const initCarouselSwipe = (): (() => void) => {
  let drag: Drag | null = null;
  let cleanup: { track: HTMLElement; timer: number } | null = null;

  // After a snap animation, return the track to CSS `:checked` control. Run
  // eagerly if a fresh interaction starts so styles never linger mid-gesture.
  const runCleanup = () => {
    if (!cleanup) return;
    window.clearTimeout(cleanup.timer);
    cleanup.track.style.transition = '';
    cleanup.track.style.transform = '';
    cleanup = null;
  };

  // Swallow the click synthesized after a drag so it doesn't trip the lightbox.
  const suppressNextClick = () => {
    const onClick = (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      window.clearTimeout(timer);
      document.removeEventListener('click', onClick, true);
    };
    document.addEventListener('click', onClick, true);
    const timer = window.setTimeout(() => document.removeEventListener('click', onClick, true), 400);
  };

  const onPointerDown = (e: PointerEvent) => {
    if (drag) return;
    if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return;
    const target = e.target as HTMLElement | null;
    if (!target || target.closest('.arrow, .dots, a, button')) return;
    const carousel = target.closest<HTMLElement>('.oc-carousel');
    if (!carousel) return;
    const track = carousel.querySelector<HTMLElement>('.track');
    if (!track) return;
    const radios = Array.from(carousel.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    if (radios.length < 2) return;

    runCleanup();
    drag = {
      carousel,
      track,
      radios,
      index: Math.max(0, radios.findIndex((r) => r.checked)),
      width: carousel.clientWidth || 1,
      startX: e.clientX,
      startY: e.clientY,
      dx: 0,
      dragging: false,
      pointerId: e.pointerId,
    };
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (!drag.dragging) {
      if (Math.abs(dx) < 8) return;
      if (Math.abs(dx) <= Math.abs(dy)) {
        drag = null; // vertical intent — let the page scroll
        return;
      }
      drag.dragging = true;
      drag.track.style.transition = 'none';
    }

    drag.dx = dx;
    // Rubber-band when dragging past the first/last slide.
    const atStart = drag.index === 0 && dx > 0;
    const atEnd = drag.index === drag.radios.length - 1 && dx < 0;
    const eff = atStart || atEnd ? dx * 0.35 : dx;
    drag.track.style.transform = `translateX(calc(${-drag.index * 100}% + ${eff}px))`;
    if (e.cancelable) e.preventDefault();
  };

  const onPointerEnd = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const d = drag;
    drag = null;
    if (!d.dragging) return;

    const threshold = Math.max(40, d.width * 0.15);
    let target = d.index;
    if (d.dx <= -threshold && d.index < d.radios.length - 1) target = d.index + 1;
    else if (d.dx >= threshold && d.index > 0) target = d.index - 1;

    // Animate to the target with the carousel's own timing, set the matching
    // radio, then clear the inline styles so CSS `:checked` resumes ownership.
    d.track.style.transition = `transform ${SLIDE_MS}ms ${SLIDE_EASE}`;
    d.track.style.transform = `translateX(${-target * 100}%)`;
    d.radios[target].checked = true;
    cleanup = {
      track: d.track,
      timer: window.setTimeout(runCleanup, SLIDE_MS + 30),
    };
    suppressNextClick();
  };

  document.addEventListener('pointerdown', onPointerDown, { passive: true });
  document.addEventListener('pointermove', onPointerMove, { passive: false });
  document.addEventListener('pointerup', onPointerEnd);
  document.addEventListener('pointercancel', onPointerEnd);

  return () => {
    document.removeEventListener('pointerdown', onPointerDown);
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerEnd);
    document.removeEventListener('pointercancel', onPointerEnd);
    runCleanup();
  };
};
