(() => {
  const params = new URLSearchParams(window.location.search);
  const requestedTheme = params.get('theme');
  if (requestedTheme === 'dark' || requestedTheme === 'light') {
    document.body.dataset.theme = requestedTheme;
  }

  // Booth chrome (logo + CNCF mark) lives inside every slide so it scales with
  // the deck. The markup is defined once in a <template> and cloned per slide.
  // A fixed-size frame keeps the content, chrome, and footer aligned while
  // Reveal scales the 1920x1080 canvas to the display.
  const chrome = document.getElementById('deck-chrome');
  const defaultDescriptor = 'Kubernetes multi-tenancy';
  document.querySelectorAll('.slides > section').forEach((slide) => {
    const footer = slide.querySelector('.slide-footer');
    const frame = document.createElement('div');
    frame.className = 'slide-frame';
    const body = document.createElement('div');
    body.className = 'slide-body';
    for (const child of [...slide.children]) {
      if (child !== footer) body.append(child);
    }

    const node = chrome.content.firstElementChild.cloneNode(true);
    node.querySelector('.brand__descriptor').textContent =
      slide.dataset.brandDescriptor || defaultDescriptor;
    frame.append(node, body);
    if (footer) frame.append(footer);
    slide.append(frame);
  });

  // Autoplay: ?seconds=N sets the interval (min 6s), ?autoplay=0 starts static.
  const seconds = Math.max(6, Number(params.get('seconds')) || 12);
  const autoSlide = params.get('autoplay') === '0' ? 0 : seconds * 1000;

  Reveal.initialize({
    width: 1920,
    height: 1080,
    margin: 0,
    minScale: 0.2,
    maxScale: 2,
    center: false,
    controls: true,
    controlsTutorial: false,
    progress: true,
    hash: true,
    transition: 'fade',
    backgroundTransition: 'fade',
    loop: true,
    autoSlide,
    autoSlideStoppable: true,
    hideInactiveCursor: true,
    hideCursorTime: 1500,
  });
})();
