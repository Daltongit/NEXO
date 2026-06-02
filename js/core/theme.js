const THEME_KEY = "nexo-theme";
const root = document.documentElement;
const themeToggles = [...document.querySelectorAll("[data-theme-toggle]")];

function getSystemTheme() {
    if (typeof window.matchMedia !== "function") return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme() {
    try {
        return localStorage.getItem(THEME_KEY);
    } catch {
        return null;
    }
}

export function getCurrentTheme() {
    return root.getAttribute("data-theme") || getStoredTheme() || getSystemTheme();
}

export function applyTheme(theme) {
    const validTheme = theme === "light" ? "light" : "dark";
    root.setAttribute("data-theme", validTheme);

    try {
        localStorage.setItem(THEME_KEY, validTheme);
    } catch { }

    syncThemeToggles(validTheme);
    document.dispatchEvent(
        new CustomEvent("nexo:theme-changed", {
            detail: { theme: validTheme }
        })
    );
}

export function toggleTheme() {
    const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
}

function syncThemeToggles(theme) {
    themeToggles.forEach((toggle) => {
        toggle.setAttribute(
            "aria-label",
            theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"
        );

        toggle.dataset.theme = theme;
    });
}

export function initTheme() {
    const initialTheme = getStoredTheme() || getSystemTheme();
    root.setAttribute("data-theme", initialTheme);
    syncThemeToggles(initialTheme);

    themeToggles.forEach((toggle) => {
        toggle.addEventListener("click", toggleTheme);
    });

    if (typeof window.matchMedia === "function") {
        const media = window.matchMedia("(prefers-color-scheme: dark)");

        const handleThemePreferenceChange = (event) => {
            const storedTheme = getStoredTheme();
            if (storedTheme) return;
            applyTheme(event.matches ? "dark" : "light");
        };

        if (typeof media.addEventListener === "function") {
            media.addEventListener("change", handleThemePreferenceChange);
        } else if (typeof media.addListener === "function") {
            media.addListener(handleThemePreferenceChange);
        }
    }
}

document.addEventListener("DOMContentLoaded", initTheme);