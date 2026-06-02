function userPrefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function revealImmediately(selector = ".reveal, .reveal-fade") {
  document.querySelectorAll(selector).forEach((element) => {
    element.classList.add("is-visible");
  });
}

export function renderRevealElements(selector = ".reveal, .reveal-fade") {
  const elements = [...document.querySelectorAll(selector)];
  if (!elements.length) return;

  if (userPrefersReducedMotion() || !("IntersectionObserver" in window)) {
    revealImmediately(selector);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -60px 0px",
      threshold: 0.14
    }
  );

  elements.forEach((element) => observer.observe(element));
}

export function initPageReveal() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      renderRevealElements();
    });
    return;
  }

  renderRevealElements();
}

export function animateCount(element, endValue = 0, options = {}) {
  if (!element) return;

  if (userPrefersReducedMotion()) {
    const {
      prefix = "",
      suffix = "",
      decimals = 0
    } = options;

    element.textContent = `${prefix}${Number(endValue).toFixed(decimals)}${suffix}`;
    return;
  }

  const {
    duration = 900,
    prefix = "",
    suffix = "",
    decimals = 0
  } = options;

  const startValue = 0;
  const startTime = performance.now();

  const updateFrame = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = startValue + (endValue - startValue) * eased;

    element.textContent = `${prefix}${currentValue.toFixed(decimals)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(updateFrame);
    }
  };

  requestAnimationFrame(updateFrame);
}
