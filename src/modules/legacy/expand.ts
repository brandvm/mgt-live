// "Learn more / close" expandable text (CODE-MIGRATION X16), ported from
// IX2 a-34 "Expandable Content" (first click) and a-35 "Collapse Content"
// (second click) on `.expand-info-button.link-underline`.
//
// Each click toggles `is-open` on the button and on its sibling
// `.expand-info-content-w`; legacy-ix.css holds the start state (height 0,
// content opacity 0, "more" shown, "close" hidden), the label swap and the
// 400ms inOutQuad fade. The height (0 ⇄ auto, 320ms inOutQuad) runs here.
//
// Not identical to live: IX2 faded EVERY `.expand-info-content` on the page
// (its target had no "affect only children/siblings"), so on the pages with
// two expanders closing one also blanked the other's open text. Here each
// button only fades its own content.
//
// Added, not in IX2: the button (a div) gets role="button", tabindex and
// aria-expanded, and opens with Enter or Space.
import { animateHeight, EASE } from './ix-shared';

const HEIGHT = { duration: 320, delay: 0, easing: EASE.inOutQuad };

export function initExpand() {
  const buttons = document.querySelectorAll<HTMLElement>('.expand-info-button.link-underline');
  if (!buttons.length) return;

  buttons.forEach((button) => {
    const parent = button.parentElement;
    if (!parent) return;
    const panels = Array.from(parent.children).filter(
      (el): el is HTMLElement => el !== button && el.classList.contains('expand-info-content-w'),
    );
    if (!panels.length) return;

    let open = false;
    if (button.tagName !== 'BUTTON' && button.tagName !== 'A') {
      button.setAttribute('role', 'button');
      if (!button.hasAttribute('tabindex')) button.tabIndex = 0;
    }
    button.setAttribute('aria-expanded', 'false');

    const toggle = () => {
      open = !open;
      button.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
      panels.forEach((panel) => {
        panel.classList.toggle('is-open', open);
        animateHeight(panel, open, HEIGHT);
      });
    };

    button.addEventListener('click', toggle);
    button.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toggle();
    });
  });
}
