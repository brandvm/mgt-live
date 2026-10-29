// `.animated-item` fade-up (CODE-MIGRATION C5), ported as-is from the live
// site's footer code (and its duplicate in the Home page footer code: one
// observer here replaces both). Each `.animated-item` gets `.animated` once
// half of it is in view; the fade and 12px rise are in legacy-a.css.
// Markup: any element with the Designer class `animated-item`.
export function initReveal() {
  const animatedItems = document.querySelectorAll<HTMLElement>('.animated-item');
  if (!animatedItems.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          obs.unobserve(entry.target); // stop observing once animated
        }
      });
    },
    { threshold: 0.5 },
  );

  animatedItems.forEach((item) => observer.observe(item));
}
