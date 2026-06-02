import { signInWithEmail } from "../supabase/auth.js";
import { validateLoginPayload } from "../utils/validators.js";

function setStatus(message = "", type = "") {
    const status = document.getElementById("auth-status");
    if (!status) return;

    status.textContent = message;
    status.classList.remove("is-error", "is-success");

    if (type) {
        status.classList.add(type === "error" ? "is-error" : "is-success");
    }
}

function setLoading(form, isLoading) {
    const submitButton = form?.querySelector('button[type="submit"]');
    if (!submitButton) return;

    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? "Ingresando..." : "Ingresar a NEXO";
}

function bindTabSwitching() {
    const tabs = [...document.querySelectorAll("[data-auth-tab]")];
    const switchButtons = [...document.querySelectorAll("[data-switch-auth]")];

    const activateTab = (target) => {
        const loginTab = document.getElementById("tab-login");
        const registerTab = document.getElementById("tab-register");
        const loginPanel = document.getElementById("panel-login");
        const registerPanel = document.getElementById("panel-register");

        const isLogin = target === "login";

        loginTab?.classList.toggle("active", isLogin);
        registerTab?.classList.toggle("active", !isLogin);

        loginTab?.setAttribute("aria-selected", String(isLogin));
        registerTab?.setAttribute("aria-selected", String(!isLogin));

        if (loginPanel) loginPanel.hidden = !isLogin;
        if (registerPanel) registerPanel.hidden = isLogin;

        loginPanel?.classList.toggle("active", isLogin);
        registerPanel?.classList.toggle("active", !isLogin);

        window.location.hash = isLogin ? "login" : "register";
        setStatus("");
    };

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            activateTab(tab.dataset.authTab);
        });
    });

    switchButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activateTab(button.dataset.switchAuth);
        });
    });

    const initialHash = window.location.hash.replace("#", "");
    activateTab(initialHash === "register" ? "register" : "login");
}

async function handleLoginSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
        email: String(formData.get("email") || "").trim(),
        password: String(formData.get("password") || "")
    };

    const validation = validateLoginPayload(payload);

    if (!validation.valid) {
        setStatus(validation.message, "error");
        return;
    }

    setLoading(form, true);
    setStatus("Validando credenciales...", "success");

    const { data, error } = await signInWithEmail(payload);

    if (error) {
        setLoading(form, false);
        setStatus(error.message || "No fue posible iniciar sesión.", "error");
        return;
    }

    if (data?.session) {
        setStatus("Acceso correcto. Redirigiendo...", "success");
        window.location.href = "./app.html#dashboard";
        return;
    }

    setLoading(form, false);
    setStatus("No se detectó una sesión válida.", "error");
}

export function initLogin() {
    const body = document.body;
    if (!body.classList.contains("auth-body")) return;

    bindTabSwitching();

    const loginForm = document.getElementById("login-form");
    if (!loginForm) return;

    loginForm.addEventListener("submit", handleLoginSubmit);
}

document.addEventListener("DOMContentLoaded", initLogin);