// Disclosure: a button that shows and hides a block of content under it
// (the FAQ answers, the "Learn more" text on the homepage).
// Markup:
//   [data-disclosure]                  the item (FAQ Item, Expand); .is-closed while shut
//     [data-disclosure-toggle]         a button with aria-expanded and aria-controls → the panel's id
//     #<panel> (.collapse › .collapse-inner)   the content
//   data-disclosure-open on the item   starts open
//   [data-disclosure-icon] (optional)  inside the toggle; gets .is-open while open
//                                      (Faq Toggle Is Open: navy, the plus turns into a minus)
// - The markup ships open (aria-expanded="true"): without this module, or
//   before it runs, every answer shows. The module closes the rest.
// - .is-closed folds the panel to nothing and hides its content from the
//   keyboard and screen readers (repo CSS). Opening and closing animate the
//   panel's measured height (and the margin the FAQ panel tucks under its
//   question) in one motion, while the content fades and settles; closing
//   is a little quicker. A click mid-way reverses from where it is.
// - Reduced motion: it switches at once.
// From the prototype (prototype/src/modules/disclosure.ts); in the live
// bundle it runs on the /design pages only (no [data-disclosure] elsewhere).
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const OPEN = { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' };
const CLOSE = { duration: 320, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' };

export function initDisclosure() {
  const items = [...document.querySelectorAll<HTMLElement>('[data-disclosure]')];
  if (!items.length) return undefined;
  const running = new Set<Animation>();

  items.forEach((item) => {
    const toggle = item.querySelector<HTMLElement>('[data-disclosure-toggle]');
    const panel = toggle && document.getElementById(toggle.getAttribute('aria-controls') ?? '');
    if (!toggle || !panel) return;
    const content = panel.firstElementChild as HTMLElement | null;
    const icon = toggle.querySelector<HTMLElement>('[data-disclosure-icon]');
    let animations: Animation[] = [];

    const measure = (closed: boolean) => {
      item.classList.toggle('is-closed', closed);
      return { height: `${panel.offsetHeight}px`, marginTop: getComputedStyle(panel).marginTop };
    };

    const set = (open: boolean, animate: boolean) => {
      toggle.setAttribute('aria-expanded', String(open));
      icon?.classList.toggle('is-open', open);
      if (!animate || reducedMotion()) {
        item.classList.toggle('is-closed', !open);
        return;
      }
      // Start from where the panel is now, even mid-animation.
      const from = { height: `${panel.offsetHeight}px`, marginTop: getComputedStyle(panel).marginTop };
      animations.forEach((a) => a.cancel());
      const to = measure(!open);
      item.classList.remove('is-closed'); // visible while it moves; closed again at the end
      const timing = open ? OPEN : CLOSE;
      const size = panel.animate([from, to], timing);
      const fade = content?.animate(
        open
          ? [{ opacity: 0, transform: 'translateY(-0.375em)' }, { opacity: 1, transform: 'none' }]
          : [{ opacity: 1 }, { opacity: 0 }],
        open ? timing : { ...timing, duration: timing.duration * 0.6 },
      );
      animations = fade ? [size, fade] : [size];
      animations.forEach((a) => running.add(a));
      size.onfinish = () => {
        if (!open) item.classList.add('is-closed');
        animations.forEach((a) => running.delete(a));
        animations = [];
      };
    };

    set(item.hasAttribute('data-disclosure-open'), false);
    toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true', true));
  });

  return () => running.forEach((a) => a.cancel());
}
