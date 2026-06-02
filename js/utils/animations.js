export function renderRevealElements() {
    const elements = [...document.querySelectorAll(".reveal")];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                currentObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.14,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    elements.forEach((element) => observer.observe(element));
}

export function animateCount(element, endValue = 0, options = {}) {
    if (!element) return;

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