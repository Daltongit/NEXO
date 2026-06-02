import { renderRevealElements } from "../utils/animations.js";

function animateHeroStats() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const target = Number(element.dataset.count || 0);
        const prefix = element.dataset.prefix || "";
        const suffix = element.dataset.suffix || "";
        const duration = Number(element.dataset.duration || 1200);
        const startTime = performance.now();

        const updateCounter = (time) => {
          const progress = Math.min((time - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.floor(target * eased);
          element.textContent = `${prefix}${value}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            element.textContent = `${prefix}${target}${suffix}`;
          }
        };

        requestAnimationFrame(updateCounter);
        currentObserver.unobserve(element);
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function addParallaxGlow() {
  const hero = document.querySelector(".hero-section");
  const panel = document.querySelector(".hero-panel");

  if (!hero || !panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  hero.addEventListener("mousemove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const moveX = (x - 0.5) * 8;
    const moveY = (y - 0.5) * 8;
    panel.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
  });

  hero.addEventListener("mouseleave", () => {
    panel.style.transform = "translate3d(0, 0, 0)";
  });
}

function bindLandingActions() {
  document.querySelectorAll("[data-go-auth]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-go-auth") || "login";
      window.location.href = `./auth.html#${target}`;
    });
  });
}

function bindAnchorActions() {
  document.querySelectorAll("[data-scroll-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-scroll-target");
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

export function initLandingPage() {
  const body = document.body;
  if (!body.classList.contains("landing-body")) return;

  renderRevealElements();
  animateHeroStats();
  addParallaxGlow();
  bindLandingActions();
  bindAnchorActions();
}

document.addEventListener("DOMContentLoaded", initLandingPage);
