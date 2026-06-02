import { renderRevealElements } from "../utils/animations.js";

function initAuthPageAnimations() {
  const body = document.body;
  if (!body.classList.contains("auth-body")) return;

  renderRevealElements(".auth-card, .auth-showcase-content, .auth-mini-card");
}

document.addEventListener("DOMContentLoaded", initAuthPageAnimations);
