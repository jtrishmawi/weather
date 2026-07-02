// Bridges imperative code to the single live region mounted at the app root
// (see StatusAnnouncer). Screen readers only pick up changes to a live region
// that already exists in the DOM, which is why there is exactly one,
// persistent region instead of per-component ones.
//
// Messages are queued and flushed ~1.2s apart: a polite region replaces its
// content, so two back-to-back announce() calls would otherwise swallow the
// first message before it is spoken.

type Listener = (message: string) => void;

let listener: Listener | null = null;
const queue: string[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

const flush = () => {
  flushTimer = null;
  const next = queue.shift();
  if (next === undefined) return;
  listener?.(next);
  flushTimer = setTimeout(flush, 1200);
};

export const setAnnounceListener = (next: Listener | null) => {
  listener = next;
};

export const announce = (message: string) => {
  queue.push(message);
  if (flushTimer === null) flush();
};

// Drops everything not yet spoken. Used on language switch so messages queued
// in the previous language aren't read with the new language's voice.
export const clearAnnouncements = () => {
  queue.length = 0;
  if (flushTimer !== null) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
};
