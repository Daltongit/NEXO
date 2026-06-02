function setAuthMode(mode) {
  const loginTab = document.getElementById("tab-login");
  const registerTab = document.getElementById("tab-register");
  const loginPanel = document.getElementById("panel-login");
  const registerPanel = document.getElementById("panel-register");
  const tabs = document.querySelector(".auth-tabs");

  if (!loginTab || !registerTab || !loginPanel || !registerPanel || !tabs) return;

  const isLogin = mode === "login";

  loginTab.classList.toggle("active", isLogin);
  registerTab.classList.toggle("active", !isLogin);

  loginTab.setAttribute("aria-selected", String(isLogin));
  registerTab.setAttribute("aria-selected", String(!isLogin));

  loginPanel.classList.toggle("active", isLogin);
  registerPanel.classList.toggle("active", !isLogin);

  loginPanel.hidden = !isLogin;
  registerPanel.hidden = isLogin;

  tabs.classList.toggle("is-register", !isLogin);
}

function bindAuthTabs() {
  document.querySelectorAll("[data-auth-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.getAttribute("data-auth-tab") || "login";
      setAuthMode(mode);
      window.location.hash = mode;
    });
  });

  document.querySelectorAll("[data-switch-auth]").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.getAttribute("data-switch-auth") || "login";
      setAuthMode(mode);
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

      const shouldShow = input.type === "password";
      input.type = shouldShow ? "text" : "password";

      button.classList.toggle("is-active", shouldShow);
      button.setAttribute("aria-label", shouldShow ? "Ocultar contraseña" : "Mostrar contraseña");
    });
  });
}

function bindChoiceGroups() {
  document.querySelectorAll("[data-choice-group]").forEach((group) => {
    const groupName = group.getAttribute("data-choice-group");
    const hiddenInput = document.getElementById(`register-${groupName}`);
    const chips = group.querySelectorAll(".choice-chip-v3");

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const value = chip.getAttribute("data-choice-value") || "";

        chips.forEach((item) => item.classList.remove("is-active"));
        chip.classList.add("is-active");

        if (hiddenInput) hiddenInput.value = value;
      });
    });
  });
}

function applyHashMode() {
  const mode = window.location.hash.replace("#", "");
  if (mode === "register") {
    setAuthMode("register");
    return;
  }
  setAuthMode("login");
}

function initAuthPage() {
  if (!document.body.classList.contains("auth-v2")) return;

  bindAuthTabs();
  bindPasswordToggles();
  bindChoiceGroups();
  applyHashMode();

  window.addEventListener("hashchange", applyHashMode);
}

document.addEventListener("DOMContentLoaded", initAuthPage);
