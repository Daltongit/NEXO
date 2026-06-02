import { getCurrentTheme, applyTheme } from "../core/theme.js";
import { showToast } from "../utils/notifications.js";

function bindSettingsPage() {
    const body = document.body;
    if (!body.classList.contains("app-body")) return;

    document.querySelectorAll("[data-set-theme]").forEach((button) => {
        button.addEventListener("click", () => {
            const theme = button.getAttribute("data-set-theme");
            applyTheme(theme);

            showToast({
                type: "success",
                title: "Ajuste aplicado",
                message: `Tema actual: ${theme === "dark" ? "oscuro" : "claro"}.`
            });
        });
    });
}

function reflectThemeInSettings() {
    const currentTheme = getCurrentTheme();

    document.querySelectorAll("[data-set-theme]").forEach((button) => {
        const buttonTheme = button.getAttribute("data-set-theme");
        button.classList.toggle("btn-primary", buttonTheme === currentTheme);
        button.classList.toggle("btn-secondary", buttonTheme !== currentTheme);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    bindSettingsPage();
    reflectThemeInSettings();
});

document.addEventListener("nexo:theme-changed", reflectThemeInSettings);
document.addEventListener("nexo:route-changed", (event) => {
    if (event.detail.route === "settings") {
        reflectThemeInSettings();
    }
});