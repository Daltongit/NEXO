import { renderRevealElements } from "../utils/animations.js";

function switchAuthPanel(mode) {
  const loginTab = document.getElementById("tab-login");
  const registerTab = document.getElementById("tab-register");
  const loginPanel = document.getElementById("panel-login");
  const registerPanel = document.getElementById("panel-register");

  if (!loginTab || !registerTab || !loginPanel || !registerPanel) return;

  const isLogin = mode === "login";

  loginTab.classList.toggle("active", isLogin);
  registerTab.classList.toggle("active", !isLogin);

  loginTab.setAttribute("aria-selected", String(isLogin));
  registerTab.setAttribute("aria-selected", String(!isLogin));

  loginPanel.hidden = !isLogin;
  registerPanel.hidden = isLogin;
}

function bindAuthTabs() {
  document.querySelectorAll("[data-auth-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.getAttribute("data-auth-tab") || "login";
      switchAuthPanel(mode);
      window.location.hash = mode;
    });
  });

  document.querySelectorAll("[data-switch-auth]").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.getAttribute("data-switch-auth") || "login";
      switchAuthPanel(mode);
      window.location.hash = mode;
    });
  });
}

function bindPasswordToggles() {
  document.querySelectorAll("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => {
      const inputId = button.getAttribute("data-toggle-password");
      const input = document.getElementById(inputId);
      if (!input) return;

      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      button.innerHTML = `<span>${isPassword ? "Ocultar" : "Ver"}</span>`;
      button.setAttribute("aria-label", isPassword ? "Ocultar contraseña" : "Mostrar contraseña");
    });
  });
}

function applyHashMode() {
  const mode = window.location.hash.replace("#", "");
  if (mode === "register") {
    switchAuthPanel("register");
    return;
  }

  switchAuthPanel("login");
}

function initAuthPageAnimations() {
  if (!document.body.classList.contains("auth-body")) return;
  renderRevealElements(".auth-showcase-inner, .auth-preview-card, .auth-card");
}

function initAuthPage() {
  if (!document.body.classList.contains("auth-body")) return;

  bindAuthTabs();
  bindPasswordToggles();
  applyHashMode();
  initAuthPageAnimations();

  window.addEventListener("hashchange", applyHashMode);
}

document.addEventListener("DOMContentLoaded", initAuthPage);
