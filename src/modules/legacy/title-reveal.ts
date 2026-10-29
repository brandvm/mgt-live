// Section title reveal (CODE-MIGRATION X5), ported from IX2 action list
// a-8 "C // Title (In View)", event e-9: SCROLL_INTO_VIEW on every
// `.c-title-w` at a 20% offset, once (loop off). Its `.c-title-label`,
// `.c-title-heading`, `.c-sub-title` and `.primary-button` start 24px down
// at opacity 0 (legacy-ix-scroll.css, until `.is-inview`) and rise in over
// 400ms `ease`, 120ms apart (Web Animations, holding the start state through
// each delay).
// Markup: the Designer class `c-title-w` (273 pages).
const PARTS: [string, number][] = [
  ['.c-title-label', 0],
  ['.c-title-heading', 120],
  ['.c-sub-title', 240],
  ['.primary-button', 360],
];

function play(title: Element) {
  title.classList.add('is-inview');
  PARTS.forEach(([selector, delay]) => {
    title.querySelectorAll(selector).forEach((el) => {
      el.animate(
        [
          { opacity: 0, transform: 'translate3d(0, 24px, 0)' },
          { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        ],
        { duration: 400, delay, easing: 'ease', fill: 'backwards' },
      );
    });
  });
}

export function initTitleReveal() {
  const titles = document.querySelectorAll<HTMLElement>('.c-title-w');
  if (!titles.length) return;

  // IX2's 20% offset: the title counts as in view once its top is 20% of
  // the viewport above the bottom edge.
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        play(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -20% 0px' },
  );

  titles.forEach((title) => observer.observe(title));
}
