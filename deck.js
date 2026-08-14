(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const controls = document.querySelector('.controls');
  const nextButton = document.querySelector('.control--next');
  const previousButton = document.querySelector('.control--prev');
  const playButton = document.querySelector('.control--play');
  const fullscreenButton = document.querySelector('.control--fullscreen');
  const progress = document.querySelector('.progress i');
  const announcer = document.querySelector('.slide-announcer');
  const brandDescriptor = document.querySelector('.brand__descriptor');
  const params = new URLSearchParams(window.location.search);
  const requestedTheme = params.get('theme');
  const interval = Math.max(6, Number(params.get('seconds')) || 12) * 1000;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (requestedTheme === 'dark' || requestedTheme === 'light') {
    document.body.dataset.theme = requestedTheme;
  }

  let current = Math.min(Math.max((Number(window.location.hash.slice(1)) || 1) - 1, 0), slides.length - 1);
  let playing = params.get('autoplay') !== '0' && !reducedMotion;
  let timer;
  let controlsTimer;
  let touchStartX = null;

  const controlsHideDelay = 1500;
  const controlsHotspotPadding = 28;

  function render(index, direction = 1) {
    const nextIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === nextIndex;
      slide.classList.toggle('is-active', active);
      slide.classList.toggle('was-active', slideIndex === current && !active);
      slide.dataset.direction = direction > 0 ? 'forward' : 'backward';
      slide.setAttribute('aria-hidden', String(!active));
    });

    current = nextIndex;
    brandDescriptor.textContent = slides[current].dataset.brandDescriptor || 'Kubernetes multi-tenancy';
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${current + 1}`);
    announcer.textContent = `Slide ${current + 1} of ${slides.length}: ${slides[current].querySelector('h1, h2').textContent}`;
    resetTimer();
  }

  function resetTimer() {
    window.clearTimeout(timer);
    progress.classList.remove('is-running');
    progress.style.setProperty('--duration', `${interval}ms`);
    void progress.offsetWidth;

    if (playing) {
      progress.classList.add('is-running');
      timer = window.setTimeout(() => render(current + 1, 1), interval);
    }
  }

  function togglePlayback() {
    playing = !playing;
    playButton.setAttribute('aria-pressed', String(playing));
    playButton.setAttribute('aria-label', playing ? 'Pause automatic playback' : 'Resume automatic playback');
    document.body.classList.toggle('is-paused', !playing);
    resetTimer();
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  function hideControls() {
    window.clearTimeout(controlsTimer);
    document.body.classList.remove('is-controls-visible');
  }

  function showControlsTemporarily() {
    window.clearTimeout(controlsTimer);
    document.body.classList.add('is-controls-visible');
    controlsTimer = window.setTimeout(hideControls, controlsHideDelay);
  }

  function isInControlsHotspot(event) {
    const bounds = controls.getBoundingClientRect();
    return event.clientX >= bounds.left - controlsHotspotPadding
      && event.clientX <= bounds.right + controlsHotspotPadding
      && event.clientY >= bounds.top - controlsHotspotPadding
      && event.clientY <= bounds.bottom + controlsHotspotPadding;
  }

  nextButton.addEventListener('click', () => render(current + 1, 1));
  previousButton.addEventListener('click', () => render(current - 1, -1));
  playButton.addEventListener('click', togglePlayback);
  fullscreenButton.addEventListener('click', toggleFullscreen);

  document.addEventListener('mousemove', (event) => {
    if (isInControlsHotspot(event)) showControlsTemporarily();
    else hideControls();
  }, { passive: true });

  document.addEventListener('keydown', (event) => {
    if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
      event.preventDefault();
      render(current + 1, 1);
    }
    if (['ArrowLeft', 'PageUp'].includes(event.key)) {
      event.preventDefault();
      render(current - 1, -1);
    }
    if (event.key.toLowerCase() === 'p') togglePlayback();
    if (event.key.toLowerCase() === 'f') toggleFullscreen();
    if (event.key === 'Home') render(0, -1);
    if (event.key === 'End') render(slides.length - 1, 1);
  });

  document.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchend', (event) => {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 60) render(current + (distance < 0 ? 1 : -1), distance < 0 ? 1 : -1);
    touchStartX = null;
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) window.clearTimeout(timer);
    else resetTimer();
  });

  document.addEventListener('fullscreenchange', () => {
    fullscreenButton.setAttribute('aria-label', document.fullscreenElement ? 'Exit fullscreen' : 'Enter fullscreen');
  });

  document.body.classList.toggle('is-paused', !playing);
  playButton.setAttribute('aria-pressed', String(playing));
  render(current);
})();
