import { renderRevealElements } from "../utils/animations.js";

export function initLandingPage() {
    const body = document.body;
    if (!body.classList.contains("landing-body")) return;

    renderRevealElements();
}

document.addEventListener("DOMContentLoaded", initLandingPage);