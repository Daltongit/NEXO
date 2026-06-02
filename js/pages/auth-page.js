function switchAuthPanel(mode) {
  const loginTab = document.getElementById("tab-login");
  const registerTab = document.getElementById("tab-register");
  const loginPanel = document.getElementById("panel-login");
  const registerPanel = document.getElementById("panel-register");
  const switcher = document.querySelector(".auth-mode-switch");

  if (!loginTab || !registerTab || !loginPanel || !registerPanel || !switcher) return;

  const isLogin = mode === "login";

  loginTab.classList.toggle("active", isLogin);
  registerTab.classList.toggle("active", !isLogin);

  loginTab.setAttribute("aria-selected", String(isLogin));
  registerTab.setAttribute("aria-selected", String(!isLogin));

  loginPanel.classList.toggle("active", isLogin);
  registerPanel.classList.toggle("active", !isLogin);

  loginPanel.hidden = !isLogin;
  registerPanel.hidden = isLogin;

  switcher.classList.toggle("is-register", !isLogin);
}

function bindTabs() {
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

function bindPasswordVision() {
  document.querySelectorAll("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => {
      const inputId = button.getAttribute("data-toggle-password");
      const input = document.getElementById(inputId);
      if (!input) return;

      const willShow = input.type === "password";
      input.type = willShow ? "text" : "password";

      button.classList.toggle("is-active", willShow);
      button.setAttribute("aria-label", willShow ? "Ocultar contraseña" : "Mostrar contraseña");
    });
  });
}

function revealOnLoad() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  requestAnimationFrame(() => {
    elements.forEach((element) => {
      element.classList.add("is-visible");
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

function initAuthPage() {
  if (!document.body.classList.contains("auth-body")) return;

  bindTabs();
  bindPasswordVision();
  applyHashMode();
  revealOnLoad();

  window.addEventListener("hashchange", applyHashMode);
}

document.addEventListener("DOMContentLoaded", initAuthPage);
