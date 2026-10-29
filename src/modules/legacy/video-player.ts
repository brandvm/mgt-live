// Video poster overlay (CODE-MIGRATION C20 + X9), ported as-is from IX2
// a-19 "Home Video Player". Clicking the play image `.home-video-play-button`
// fades its `.home-video-play-button-w` cover out (240ms ease-in-out) and
// then sets it to display:none, uncovering the native controls of the
// `<video id="homeVideo">` Embed behind it. As on live, it does not start
// the video: the visitor presses play in the controls.
const FADE_MS = 240;

function hide(wrapper: HTMLElement) {
  if (wrapper.dataset.legacyVideoHidden) return;
  wrapper.dataset.legacyVideoHidden = 'true';
  const done = () => {
    wrapper.style.opacity = '0';
    wrapper.style.display = 'none';
  };
  if (typeof wrapper.animate !== 'function') return done();
  const from = getComputedStyle(wrapper).opacity;
  const anim = wrapper.animate([{ opacity: from }, { opacity: 0 }], {
    duration: FADE_MS,
    easing: 'ease-in-out',
    fill: 'forwards',
  });
  anim.onfinish = done;
  anim.oncancel = done;
}

export function initVideoPlayer() {
  document.querySelectorAll<HTMLElement>('.home-video-play-button').forEach((button) => {
    const wrapper = button.closest<HTMLElement>('.home-video-play-button-w');
    if (!wrapper) return;
    button.addEventListener('click', () => hide(wrapper));
  });
}
