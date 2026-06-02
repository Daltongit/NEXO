import { initRouter, navigateTo } from "./router.js";
import { getState, updateState } from "./state.js";
import { showToast } from "../utils/notifications.js";
import { getInitials, toggleHidden } from "../utils/helpers.js";
import { renderRevealElements } from "../utils/animations.js";
import { getCurrentSessionSafe, signOutUserSafe } from "../auth/session.js";

function bindSidebarToggle() {
    const sidebarToggle = document.getElementById("sidebar-toggle");
    if (!sidebarToggle) return;

    sidebarToggle.addEventListener("click", () => {
        updateState((state) => {
            state.ui.sidebarOpen = !state.ui.sidebarOpen;
            document.body.classList.toggle("sidebar-open", state.ui.sidebarOpen);
        });
    });
}

function bindProfileMenu() {
    const trigger = document.getElementById("profile-menu-trigger");
    const dropdown = document.getElementById("profile-dropdown");

    if (!trigger || !dropdown) return;

    trigger.addEventListener("click", () => {
        updateState((state) => {
            state.ui.profileMenuOpen = !state.ui.profileMenuOpen;
            toggleHidden(dropdown, !state.ui.profileMenuOpen);
        });
    });

    document.addEventListener("click", (event) => {
        const isInside = event.target.closest(".profile-menu-wrap");
        if (!isInside) {
            updateState((state) => {
                state.ui.profileMenuOpen = false;
                toggleHidden(dropdown, true);
            });
        }
    });
}

function bindServiceModal() {
    const modal = document.getElementById("service-modal");
    const openButton = document.getElementById("open-service-modal");
    const closeButton = document.getElementById("close-service-modal");

    if (!modal) return;

    const openModal = () => {
        updateState((state) => {
            state.ui.serviceModalOpen = true;
            toggleHidden(modal, false);
            document.body.style.overflow = "hidden";
        });
    };

    const closeModal = () => {
        updateState((state) => {
            state.ui.serviceModalOpen = false;
            toggleHidden(modal, true);
            document.body.style.overflow = "";
        });
    };

    openButton?.addEventListener("click", openModal);
    closeButton?.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && getState().ui.serviceModalOpen) {
            closeModal();
        }
    });
}

function bindLogoutButtons() {
    const logoutButtons = [
        document.getElementById("logout-button"),
        document.getElementById("logout-button-settings")
    ].filter(Boolean);

    logoutButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const { error } = await signOutUserSafe();

            if (error) {
                showToast({
                    type: "error",
                    title: "No fue posible cerrar sesión",
                    message: error.message || "Intenta nuevamente."
                });
                return;
            }

            showToast({
                type: "success",
                title: "Sesión cerrada",
                message: "Tu sesión fue cerrada correctamente."
            });

            window.location.href = "./auth.html#login";
        });
    });
}

function bindSettingsThemeButtons() {
    document.querySelectorAll("[data-set-theme]").forEach((button) => {
        button.addEventListener("click", async () => {
            const desiredTheme = button.getAttribute("data-set-theme");
            const { applyTheme } = await import("./theme.js");
            applyTheme(desiredTheme);

            showToast({
                type: "success",
                title: "Tema actualizado",
                message: `Se aplicó el tema ${desiredTheme === "dark" ? "oscuro" : "claro"}.`
            });
        });
    });
}

export function hydrateTopbarUser(profile, session) {
    const user = profile || session?.user?.user_metadata || {};
    const fullName = user.full_name || user.name || "Usuario";
    const email = session?.user?.email || "correo@dominio.com";

    const nameElement = document.getElementById("topbar-name");
    const emailElement = document.getElementById("topbar-email");
    const avatarElement = document.getElementById("topbar-avatar");
    const summaryName = document.getElementById("summary-name");
    const summaryUsername = document.getElementById("summary-username");
    const summaryCareer = document.getElementById("summary-career");
    const summaryBio = document.getElementById("summary-bio");

    if (nameElement) nameElement.textContent = fullName;
    if (emailElement) emailElement.textContent = email;
    if (avatarElement) avatarElement.textContent = getInitials(fullName);
    if (summaryName) summaryName.textContent = fullName;
    if (summaryUsername) summaryUsername.textContent = user.username ? `@${user.username}` : "@usuario";
    if (summaryCareer) summaryCareer.textContent = user.career || "No especificada";
    if (summaryBio) summaryBio.textContent = user.bio || "Completa tu perfil para fortalecer tu presencia profesional.";
}

async function protectAppRoute() {
    const { session } = await getCurrentSessionSafe();

    if (!session) {
        window.location.href = "./auth.html#login";
        return null;
    }

    return session;
}

export async function initApp() {
    const body = document.body;
    if (!body.classList.contains("app-body")) return;

    const session = await protectAppRoute();
    if (!session) return;

    updateState((state) => {
        state.currentUser = session.user;
    });

    initRouter();
    bindSidebarToggle();
    bindProfileMenu();
    bindServiceModal();
    bindLogoutButtons();
    bindSettingsThemeButtons();
    renderRevealElements();
    hydrateTopbarUser(session.user.user_metadata || {}, session);

    navigateTo(window.location.hash.replace("#", "") || "dashboard");
}

document.addEventListener("DOMContentLoaded", initApp);