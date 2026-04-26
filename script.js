const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const projects = document.querySelectorAll('[data-project]');

projects.forEach((project) => {
  const openButton = project.querySelector('[data-open-details]');
  const closeButton = project.querySelector('[data-close-details]');
  const detailsPanel = project.querySelector('.details-panel');

  if (openButton && detailsPanel) {
    openButton.addEventListener('click', () => {
      project.classList.add('is-open');
      detailsPanel.setAttribute('aria-hidden', 'false');
    });
  }

  if (closeButton && detailsPanel) {
    closeButton.addEventListener('click', () => {
      project.classList.remove('is-open');
      detailsPanel.setAttribute('aria-hidden', 'true');
      project.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }
});

const sliders = document.querySelectorAll('[data-slider]');

sliders.forEach((slider) => {
  const track = slider.querySelector('.slider-track');
  const prevButton = slider.querySelector('.slider-arrow--prev');
  const nextButton = slider.querySelector('.slider-arrow--next');
  const dotsContainer = slider.parentElement.querySelector('.slider-dots');
  const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];
  const totalSlides = track ? track.children.length : 0;

  if (!track || totalSlides === 0) return;

  let currentSlide = 0;
  let intervalId = null;

  const updateSlider = (index) => {
    currentSlide = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === currentSlide);
    });
  };

  const goToNext = () => {
    updateSlider(currentSlide + 1);
  };

  const goToPrev = () => {
    updateSlider(currentSlide - 1);
  };

  const startAutoplay = () => {
    if (!slider.hasAttribute('data-autoplay') || totalSlides < 2) return;

    stopAutoplay();
    intervalId = window.setInterval(() => {
      goToNext();
    }, 3200);
  };

  const stopAutoplay = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      goToPrev();
      stopAutoplay();
      startAutoplay();
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      goToNext();
      stopAutoplay();
      startAutoplay();
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIndex = Number(dot.dataset.slideTo || 0);
      updateSlider(targetIndex);
      stopAutoplay();
      startAutoplay();
    });
  });

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  updateSlider(0);
  startAutoplay();
});
